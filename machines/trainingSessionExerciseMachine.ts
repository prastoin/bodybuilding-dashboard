import {
  Actor,
  ActorRef,
  assign,
  ContextFrom,
  createMachine,
  EventFrom,
  State,
} from "xstate";
import { v4 as uuidv4 } from "uuid";
import { TrainingSession, TrainingSessionExercise } from "../types";

type TrainingSessionMachine = ReturnType<typeof createTrainingSessionMachine>;

type TrainingSessionMachineEvent = EventFrom<TrainingSessionMachine>;
type TrainingSessionMachineContext = ContextFrom<TrainingSessionMachine>;

type TrainingSessionMachineState = State<
  TrainingSessionMachineContext,
  TrainingSessionMachineEvent
>;

export type TrainingSessionActorRef = ActorRef<
  TrainingSessionMachineEvent,
  TrainingSessionMachineState
>;

export const createTrainingSessionMachine = ({
  trainingSessionName,
  uuid,
}: {
  trainingSessionName: string;
  uuid: string;
}) =>
  createMachine(
    {
      tsTypes:
        {} as import("./trainingSessionExerciseMachine.typegen").Typegen0,
      id: "ProgramBuilderMachine",
      schema: {
        context: {} as TrainingSession,
        events: {} as {
          type: "ADD_EXERCISE";
          name: string;
        },
      },
      context: {
        exercises: [],
        trainingSessionName,
        uuid,
      },
      initial: "Idle",
      states: {
        Idle: {
          on: {
            ADD_EXERCISE: {
              actions: "User added an exercise",
            },
          },
        },
      },
    },
    {
      actions: {
        "User added an exercise": assign((context, event) => {
          return {
            ...context,
            exercises: [
              ...context.exercises,
              {
                exerciseName: event.name,
              },
            ],
          };
        }),
      },
    }
  );
