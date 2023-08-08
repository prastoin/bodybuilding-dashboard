import { Exercise, Session } from "@/types";
import { router } from "expo-router";
import invariant from "invariant";
import { ActorRef, assign, createMachine, spawn, State } from "xstate";
import { sendParent } from "xstate/lib/actions";
import { createExerciseFormMachine, ExerciseFormDoneInvokeEvent } from "./ExerciseFormMachine";
import { createExerciseMachine, ExerciseActorRef as SessionExerciseActorRef } from "./ExerciseMachine";

type SessionMachineEvents =
  | {
    type: "REMOVE_SESSION";
  }
  | {
    type: "_REMOVE_SESSION_EXERCISE";
    exerciseId: string;
  }
  | {
    type: "USER_FINISHED_SESSION_NAME_EDITION";
    name: string;
  }
  | {
    type: "USER_ENTERED_SESSION_NAME_EDITOR";
  }
  | {
    type: "USER_CANCELED_SESSION_NAME_EDITION";
  }
  | {
    type: "USER_ENTERED_EXERCISE_CREATION_FORM";
  }
  | {
    type: "_USER_CANCELLED_EXERCISE_CREATION_FORM";
  };

export type SessionMachineContext = {
  initialExercisesToSpawn?: Exercise[];
  name: string;
  uuid: string;
  exerciseActorRefList: SessionExerciseActorRef[];
};

type SessionMachineState = State<
  SessionMachineContext,
  SessionMachineEvents
>;

export type SessionActorRef = ActorRef<
  SessionMachineEvents,
  SessionMachineState
>;

type CreateSessionMachineArgs = Partial<Session> & Pick<Session, 'name' | 'uuid'>

export const createSessionMachine = ({
  exerciseList,
  name,
  uuid: sessionId
}: CreateSessionMachineArgs) => {
  return createMachine(
    {
      predictableActionArguments: true,
      tsTypes: {} as import("./SessionMachine.typegen").Typegen0,
      id: sessionId,
      schema: {
        context: {} as SessionMachineContext,
        events: {} as SessionMachineEvents,
      },
      context: {
        initialExercisesToSpawn: exerciseList,
        exerciseActorRefList: [],
        name: name,
        uuid: sessionId,
      },
      initial: "Spawning initial exercises",
      states: {
        "Spawning initial exercises": {
          always: [
            {
              cond: "Initial Exercises has to been spawned",
              actions: "Spawn and assign initial exercises",
              target: "Idle",
            },
            {
              target: "Idle",
            },
          ],
        },

        Idle: {
          on: {
            REMOVE_SESSION: {
              actions: "Forward session deletion to program builder",
            },

            _REMOVE_SESSION_EXERCISE: {
              actions: "remove session exercise from context",
            },

            USER_ENTERED_SESSION_NAME_EDITOR: {
              target: "User is editing session name",
            },

            USER_ENTERED_EXERCISE_CREATION_FORM: {
              target: "User is creating an exercise",
            },
          },
        },

        "User is creating an exercise": {
          entry: "Navigate to exercise creation form name step",

          invoke: {
            id: "ExerciseForm",

            src: () => {
              return createExerciseFormMachine(sessionId);
            },

            onDone: {
              target: "Idle",
              actions: [
                "Assign created exercise to context",
                // Might not be required as handled by the parent machine
                "Reset program builder stack",
              ],
            },
          },

          on: {
            _USER_CANCELLED_EXERCISE_CREATION_FORM: {
              target: "Idle",
            },
          },
        },

        "User is editing session name": {
          entry: "Navigate to session name editor",

          on: {
            USER_FINISHED_SESSION_NAME_EDITION: {
              actions: ["update session name", "Navigate go back"],
              target: "Idle",
            },

            // User can cancel this operation only by going back by itself
            // Maybe we should sniff and block the operation to perform it there ?
            USER_CANCELED_SESSION_NAME_EDITION: {
              target: "Idle",
            },
          },
        },
      },
    },
    {
      guards: {
        "Initial Exercises has to been spawned": (context) =>
          context.initialExercisesToSpawn !== undefined &&
          context.initialExercisesToSpawn.length > 0,
      },

      actions: {
        "Spawn and assign initial exercises": assign({
          exerciseActorRefList: (context) => {
            const initialExercisesToSpawn = context.initialExercisesToSpawn;

            invariant(
              initialExercisesToSpawn !== undefined,
              "should never occurs initialExercisesToSpawn is undefined"
            );

            return initialExercisesToSpawn.map(
              (exercise) => {
                const newSessionExerciseActorRef: SessionExerciseActorRef =
                  spawn(
                    createExerciseMachine({
                      exercise,
                      parentSessionId: sessionId,
                    }),
                    { sync: true, name: exercise.uuid }
                  );
                return newSessionExerciseActorRef;
              }
            )
          },
          initialExercisesToSpawn: (_context) => undefined
        }),

        "Reset program builder stack": () => {
          router.push("/(tabs)/program")
        },

        "Navigate to exercise creation form name step": ({ uuid: sessionId }) => {
          router.push({
            pathname: "/(tabs)/program/exercise/[sessionId]/name",
            params: {
              sessionId,
            }
          })
        },

        "Navigate to session name editor": ({ uuid: sessionId }) => {
          router.push({
            pathname: "/(tabs)/program/session/[sessionId]",
            params: {
              sessionId
            }
          })
        },

        "Navigate go back": () => {
          router.back()
        },

        "Assign created exercise to context": assign({
          exerciseActorRefList: (context, event) => {
            const {
              data: exercise,
            } = event as ExerciseFormDoneInvokeEvent;

            const newExerciseActor: SessionExerciseActorRef = spawn(
              createExerciseMachine({
                parentSessionId: sessionId,
                exercise
              }),
              { sync: true, name: exercise.uuid }
            );

            return [
              ...context.exerciseActorRefList,
              newExerciseActor,
            ]
          }
        }),

        "update session name": assign({
          name: (_context, { name }) => name
        }),

        // Could make typings works here
        "Forward session deletion to program builder": sendParent({
          type: "_REMOVE_SESSION",
          sessionId,
        }),

        "remove session exercise from context": assign({
          exerciseActorRefList: (context, { exerciseId }) => context.exerciseActorRefList.filter(
            (actor) => {
              const currentActorNeedToBeRemoved = actor.id === exerciseId;
              if (currentActorNeedToBeRemoved) {
                if (actor.stop) {
                  actor.stop();
                }

                return false;
              }
              return true;
            }
          )
        }),
      },
    }
  );
};
