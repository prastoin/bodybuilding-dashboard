import { ActorRef, assign, createMachine, State } from "xstate";
import { sendParent } from "xstate/lib/actions";
import {
  navigateBackFromRef,
  navigateFromRef,
} from "../navigation/RootNavigation";
import { TrainingSessionExercise } from "../types";

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
      type: "USER_ENTERED_SET_AND_REP_EDITOR";
    }
  | {
      type: "USER_CANCELLED_SET_AND_REP_EDITION";
    }
  | {
      type: "USER_FINISHED_SET_AND_REP_EDITION";
      setCounter: number;
      repCounter: number;
    }
  | {
      type: "USER_FINISHED_NAME_EDITION_OPERATION";
      newExerciseName: string;
    };

type TrainingSessionExerciseMachineContext = TrainingSessionExercise;

type TrainingSessionExerciseMachineState = State<
  TrainingSessionExerciseMachineContext,
  TrainingSessionExerciseMachineEvent
>;

export type TrainingSessionExerciseActorRef = ActorRef<
  TrainingSessionExerciseMachineEvent,
  TrainingSessionExerciseMachineState
>;

type CreateTrainingSessionExerciseMachineArgs =
  TrainingSessionExerciseMachineContext & {
    parentTrainingSessionId: string;
  };

export const createTrainingSessionExerciseMachine = ({
  exerciseName,
  uuid,
  repCounter,
  setCounter,
  parentTrainingSessionId,
}: CreateTrainingSessionExerciseMachineArgs) =>
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
        setCounter,
        repCounter,
      },
      initial: "Idle",
      states: {
        Idle: {
          on: {
            USER_ENTERED_NAME_EDITION_OPERATION: {
              target: "User is editing exercise name",
            },

            USER_ENTERED_SET_AND_REP_EDITOR: {
              target: "User is editing set and rep",
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

        "User is editing set and rep": {
          entry: "Navigate to set and rep editor screen",

          on: {
            USER_FINISHED_SET_AND_REP_EDITION: {
              target: "Idle",
              actions: [
                "Assign new set and rep to context",
                "Navigate go back",
              ],
            },

            USER_CANCELLED_SET_AND_REP_EDITION: {
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

        "Navigate to set and rep editor screen": (context) => {
          navigateFromRef("ProgramBuilder", {
            screen: "ExerciseEditorFormSetAndRep",
            params: {
              exerciseId: context.uuid,
              trainingSessionId: parentTrainingSessionId,
            },
          });
        },

        "Navigate go back": () => {
          navigateBackFromRef();
        },

        "Assign new exercise name to context": assign(
          (context, { newExerciseName }) => {
            return {
              ...context,
              exerciseName: newExerciseName,
            };
          }
        ),

        "Assign new set and rep to context": assign(
          (context, { setCounter, repCounter }) => {
            return {
              ...context,
              setCounter,
              repCounter,
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
