import { ActorRef, assign, createMachine, State } from "xstate";
import { sendParent } from "xstate/lib/actions";

type TrainingSessionExerciseMachineEvent =
  | {
      type: "ADD_TRACKER_SECTION";
      name: string;
    }
  | {
      type: "REMOVE_EXERCISE";
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
}: {
  exerciseName: string;
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
            ADD_TRACKER_SECTION: {
              actions: "User added a tracker section",
            },

            REMOVE_EXERCISE: {
              actions: ["Forward exercise deletion to program builder"],
            },
          },
        },
      },
    },
    {
      actions: {
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
