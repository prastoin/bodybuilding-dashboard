import {
  ActorRef,
  assign,
  ContextFrom,
  createMachine,
  EventFrom,
  State,
} from "xstate";

type TrainingSessionExerciseMachine = ReturnType<
  typeof createTrainingSessionExerciseMachine
>;

type TrainingSessionExerciseMachineEvent =
  EventFrom<TrainingSessionExerciseMachine>;
type TrainingSessionExerciseMachineContext =
  ContextFrom<TrainingSessionExerciseMachine>;

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
        context: {} as {
          exerciseName: string;
          uuid: string;
        },
        events: {} as {
          type: "ADD_TRACKER_SECTION";
          name: string;
        },
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
          },
        },
      },
    },
    {
      actions: {
        "User added a tracker section": assign((context, event) => {
          return context;
        }),
      },
    }
  );
