import { ActorRef, assign, createMachine, State } from "xstate";
import { sendParent } from "xstate/lib/actions";
import { goBackFromRef, navigateFromRef } from "../navigation/RootNavigation";

type TrainingSessionExerciseMachineEvent =
  | {
      type: "ADD_TRACKER_SECTION";
      name: string;
    }
  | {
      type: "REMOVE_EXERCISE";
    }
  | {
      type: "USER_ENTERED_NAME_EDITION_OPERATION";
    }
  | {
      type: "USER_CANCELLED_NAME_EDITION_OPERATION";
    }
  | {
      type: "USER_FINISHED_NAME_EDITION_OPERATION";
      newExerciseName: string;
    };

type TrainingSessionExerciseMachineContext = {
  exerciseName: string;
  uuid: string;
};

type TrainingSessionExerciseMachineState = State<
  TrainingSessionExerciseMachineContext,
  TrainingSessionExerciseMachineEvent
>;

export type TrainingSessionExerciseActorRef = ActorRef<
  TrainingSessionExerciseMachineEvent,
  TrainingSessionExerciseMachineState
>;

export const createTrainingSessionExerciseMachine = ({
  exerciseName,
  uuid,
  parentTrainingSessionId,
}: {
  exerciseName: string;
  parentTrainingSessionId: string;
  uuid: string;
}) =>
  createMachine(
    {
      tsTypes:
        {} as import("./TrainingSessionExerciseMachine.typegen").Typegen0,
      id: uuid,
      schema: {
        context: {} as TrainingSessionExerciseMachineContext,
        events: {} as TrainingSessionExerciseMachineEvent,
      },
      context: {
        exerciseName,
        uuid,
      },
      initial: "Idle",
      states: {
        Idle: {
          on: {
            USER_ENTERED_NAME_EDITION_OPERATION: {
              target: "User is editing exercise name",
            },

            ADD_TRACKER_SECTION: {
              actions: "User added a tracker section",
            },

            REMOVE_EXERCISE: {
              actions: ["Forward exercise deletion to program builder"],
            },
          },
        },

        "User is editing exercise name": {
          entry: "Navigate to name editor screen",

          on: {
            USER_FINISHED_NAME_EDITION_OPERATION: {
              actions: [
                "Assign new exercise name to context",
                "Navigate go back",
              ],
              target: "Idle",
            },

            USER_CANCELLED_NAME_EDITION_OPERATION: {
              target: "Idle",
            },
          },
        },
      },
    },
    {
      actions: {
        "Navigate to name editor screen": (context) => {
          navigateFromRef("ProgramBuilder", {
            screen: "ExerciseEditorFormName",
            params: {
              exerciseId: context.uuid,
              trainingSessionId: parentTrainingSessionId,
            },
          });
        },

        "Navigate go back": () => {
          goBackFromRef();
        },

        "Assign new exercise name to context": assign(
          (context, { newExerciseName }) => {
            return {
              ...context,
              exerciseName: newExerciseName,
            };
          }
        ),

        "User added a tracker section": assign((context, event) => {
          return context;
        }),

        "Forward exercise deletion to program builder": sendParent({
          type: "_REMOVE_TRAINING_SESSION_EXERCISE",
          exerciseId: uuid,
        }),
      },
    }
  );
