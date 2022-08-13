import "react-native-get-random-values";
import { ActorRef, assign, createMachine, spawn, State } from "xstate";
import {
  createTrainingSessionExerciseMachine,
  TrainingSessionExerciseActorRef,
} from "./TrainingSessionExerciseMachine";
import { v4 as uuidv4 } from "uuid";
import { sendParent } from "xstate/lib/actions";
import { goBackFromRef, navigateFromRef } from "../navigation/RootNavigation";
import { TrainingSessionExercise } from "../types";
import invariant from "invariant";

type TrainingSessionMachineEvents =
  | {
      type: "ADD_EXERCISE";
      name?: string;
    }
  | {
      type: "REMOVE_TRAINING_SESSION";
    }
  | {
      type: "_REMOVE_TRAINING_SESSION_EXERCISE";
      exerciseId: string;
    }
  | {
      type: "USER_FINISHED_TRAINING_SESSION_NAME_EDITION";
      newName: string;
    }
  | {
      type: "USER_ENTERED_TRAINING_SESSION_NAME_EDITOR";
    }
  | {
      type: "USER_CANCELED_TRAINING_SESSION_NAME_EDITION";
    };

type TrainingSessionMachineContext = {
  initialExercisesToSpawn?: TrainingSessionExercise[];
  trainingSessionName: string;
  uuid: string;
  trainingSessionExerciseActorRefCollection: TrainingSessionExerciseActorRef[];
};

type TrainingSessionMachineState = State<
  TrainingSessionMachineContext,
  TrainingSessionMachineEvents
>;

export type TrainingSessionActorRef = ActorRef<
  TrainingSessionMachineEvents,
  TrainingSessionMachineState
>;

export const createTrainingSessionMachine = ({
  trainingSessionName,
  uuid,
  exerciseCollection,
}: {
  trainingSessionName: string;
  uuid: string;
  exerciseCollection?: TrainingSessionExercise[];
}) => {
  return createMachine(
    {
      tsTypes: {} as import("./TrainingSessionMachine.typegen").Typegen0,
      id: uuid,
      schema: {
        context: {} as TrainingSessionMachineContext,
        events: {} as TrainingSessionMachineEvents,
      },
      context: {
        initialExercisesToSpawn: exerciseCollection,
        trainingSessionExerciseActorRefCollection: [],
        trainingSessionName,
        uuid,
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
            ADD_EXERCISE: {
              actions: "User added an exercise",
            },

            REMOVE_TRAINING_SESSION: {
              actions: "Forward training session deletion to program builder",
            },

            _REMOVE_TRAINING_SESSION_EXERCISE: {
              actions: "remove training session exercise from context",
            },

            USER_ENTERED_TRAINING_SESSION_NAME_EDITOR: {
              target: "User is editing training session name",
            },
          },
        },

        "User is editing training session name": {
          entry: "Navigate to training session name editor",

          on: {
            USER_FINISHED_TRAINING_SESSION_NAME_EDITION: {
              actions: ["update training session name", "Navigate go back"],
              target: "Idle",
            },

            USER_CANCELED_TRAINING_SESSION_NAME_EDITION: {
              target: "Idle",
            },
          },
        },
      },
    },
    {
      guards: {
        "Initial Exercises has to been spawned": (context) =>
          context.initialExercisesToSpawn !== undefined,
      },

      actions: {
        "Spawn and assign initial exercises": assign((context, event) => {
          const { initialExercisesToSpawn } = context;
          invariant(
            initialExercisesToSpawn !== undefined,
            "should never occurs initialExercisesToSpawn is undefined"
          );

          const exerciseActorRefCollection = initialExercisesToSpawn.map(
            ({ exerciseName, uuid }) => {
              const newTrainingSessionExerciseActorRef: TrainingSessionExerciseActorRef =
                spawn(
                  createTrainingSessionExerciseMachine({
                    exerciseName,
                    uuid,
                  }),
                  { sync: true, name: uuid }
                );
              return newTrainingSessionExerciseActorRef;
            }
          );

          return {
            ...context,
            initialExercisesToSpawn: undefined,
            trainingSessionExerciseActorRefCollection:
              exerciseActorRefCollection,
          };
        }),

        "User added an exercise": assign((context, _event) => {
          const uuid = uuidv4();
          const newTrainingSessionExerciseActorRef: TrainingSessionExerciseActorRef =
            spawn(
              createTrainingSessionExerciseMachine({
                exerciseName: `Exercise_${
                  context.trainingSessionExerciseActorRefCollection.length + 1
                }`,
                uuid,
              }),
              { sync: true, name: uuid }
            );

          return {
            ...context,
            trainingSessionExerciseActorRefCollection: [
              ...context.trainingSessionExerciseActorRefCollection,
              newTrainingSessionExerciseActorRef,
            ],
          };
        }),

        "Navigate to training session name editor": (context) => {
          navigateFromRef("ProgramBuilder", {
            screen: "TrainingSessionEditorFormName",
            params: {
              trainingSessionId: context.uuid,
            },
          });
        },

        "Navigate go back": () => {
          goBackFromRef();
        },

        "update training session name": assign((context, { newName }) => {
          return {
            ...context,
            trainingSessionName: newName,
          };
        }),

        // Could make typings works here
        "Forward training session deletion to program builder": sendParent({
          type: "_REMOVE_TRAINING_SESSION",
          trainingSessionId: uuid,
        }),

        "remove training session exercise from context": assign(
          (context, { exerciseId }) => {
            const updatedExerciseCollection =
              context.trainingSessionExerciseActorRefCollection.filter(
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
              );

            return {
              ...context,
              trainingSessionExerciseActorRefCollection:
                updatedExerciseCollection,
            };
          }
        ),
      },
    }
  );
};
