import { ActorRef, assign, createMachine, spawn, State } from "xstate";
import {
  createTrainingSessionExerciseMachine,
  TrainingSessionExerciseActorRef,
} from "./TrainingSessionExerciseMachine";
import { sendParent } from "xstate/lib/actions";
import {
  navigateBackFromRef,
  navigateFromRef,
} from "../navigation/RootNavigation";
import { TrainingSessionExercise } from "../types";
import invariant from "invariant";
import {
  createExerciseCreationFormMachine,
  ExerciseFormCreationDoneInvokeEvent,
} from "./ExerciseCreationFormMachine";

type TrainingSessionMachineEvents =
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
    }
  | {
      type: "USER_ENTERED_EXERCISE_CREATION_FORM";
    }
  | {
      type: "_USER_CANCELLED_EXERCISE_CREATION_FORM";
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
  uuid: trainingSessionId,
  exerciseCollection,
}: {
  trainingSessionName: string;
  uuid: string;
  exerciseCollection?: TrainingSessionExercise[];
}) => {
  return createMachine(
    {
      tsTypes: {} as import("./TrainingSessionMachine.typegen").Typegen0,
      id: trainingSessionId,
      schema: {
        context: {} as TrainingSessionMachineContext,
        events: {} as TrainingSessionMachineEvents,
      },
      context: {
        initialExercisesToSpawn: exerciseCollection,
        trainingSessionExerciseActorRefCollection: [],
        trainingSessionName,
        uuid: trainingSessionId,
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
            REMOVE_TRAINING_SESSION: {
              actions: "Forward training session deletion to program builder",
            },

            _REMOVE_TRAINING_SESSION_EXERCISE: {
              actions: "remove training session exercise from context",
            },

            USER_ENTERED_TRAINING_SESSION_NAME_EDITOR: {
              target: "User is editing training session name",
            },

            USER_ENTERED_EXERCISE_CREATION_FORM: {
              target: "User is creating an exercise",
            },
          },
        },

        "User is creating an exercise": {
          entry: "Navigate to exercise creation form name step",

          invoke: {
            id: "ExerciseCreationForm",

            src: () => {
              return createExerciseCreationFormMachine(trainingSessionId);
            },

            onDone: {
              target: "Idle",
              actions: [
                "Assign created exercise to context",
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

        "User is editing training session name": {
          entry: "Navigate to training session name editor",

          on: {
            USER_FINISHED_TRAINING_SESSION_NAME_EDITION: {
              actions: ["update training session name", "Navigate go back"],
              target: "Idle",
            },

            // User can cancel this operation only by going back by itself
            // Maybe we should sniff and block the operation to perform it there ?
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
          context.initialExercisesToSpawn !== undefined &&
          context.initialExercisesToSpawn.length > 0,
      },

      actions: {
        "Spawn and assign initial exercises": assign((context) => {
          const initialExercisesToSpawn = context.initialExercisesToSpawn;

          invariant(
            initialExercisesToSpawn !== undefined,
            "should never occurs initialExercisesToSpawn is undefined"
          );

          const exerciseActorRefCollection = initialExercisesToSpawn.map(
            ({ exerciseName, uuid, repCounter, setCounter, load, rest }) => {
              const newTrainingSessionExerciseActorRef: TrainingSessionExerciseActorRef =
                spawn(
                  createTrainingSessionExerciseMachine({
                    exerciseName,
                    uuid,
                    parentTrainingSessionId: trainingSessionId,
                    repCounter,
                    setCounter,
                    load,
                    rest,
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

        "Reset program builder stack": () => {
          navigateFromRef("ProgramBuilder", {
            screen: "Index",
          });
        },

        "Navigate to exercise creation form name step": () => {
          navigateFromRef("ProgramBuilder", {
            screen: "ExerciseCreationForm",
            params: {
              screen: "Name",
              params: {
                trainingSessionId,
              },
            },
          });
        },

        "Navigate to training session name editor": (context) => {
          navigateFromRef("ProgramBuilder", {
            screen: "TrainingSessionEditorFormName",
            params: {
              trainingSessionId: context.uuid,
            },
          });
        },

        "Navigate go back": () => {
          navigateBackFromRef();
        },

        "Assign created exercise to context": assign((context, event) => {
          const {
            data: {
              exerciseName,
              uuid: newTrainingSessionId,
              repCounter,
              setCounter,
              load,
              rest,
            },
          } = event as ExerciseFormCreationDoneInvokeEvent;

          const newExerciseActor: TrainingSessionExerciseActorRef = spawn(
            createTrainingSessionExerciseMachine({
              exerciseName,
              parentTrainingSessionId: trainingSessionId,
              uuid: newTrainingSessionId,
              repCounter,
              setCounter,
              load,
              rest,
            }),
            { sync: true, name: newTrainingSessionId }
          );

          return {
            ...context,
            trainingSessionExerciseActorRefCollection: [
              ...context.trainingSessionExerciseActorRefCollection,
              newExerciseActor,
            ],
          };
        }),

        "update training session name": assign((context, { newName }) => {
          return {
            ...context,
            trainingSessionName: newName,
          };
        }),

        // Could make typings works here
        "Forward training session deletion to program builder": sendParent({
          type: "_REMOVE_TRAINING_SESSION",
          trainingSessionId: trainingSessionId,
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
