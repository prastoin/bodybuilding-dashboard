import {
  ActorRef,
  assign,
  ContextFrom,
  createMachine,
  EventFrom,
  spawn,
  State,
} from "xstate";
import {
  createTrainingSessionExerciseMachine,
  TrainingSessionExerciseActorRef,
} from "./TrainingSessionExerciseMachine";
import { v4 as uuidv4 } from "uuid";
import { sendParent } from "xstate/lib/actions";
import { ProgramBuilderMachineEvents } from "./ProgramBuilderMachine";

type TrainingSessionMachineEvents =
  | {
      type: "ADD_EXERCISE";
      name: string;
    }
  | {
      type: "REMOVE_TRAINING_SESSION";
    };

type TrainingSessionMachineContext = {
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
}: {
  trainingSessionName: string;
  uuid: string;
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
        trainingSessionExerciseActorRefCollection: [],
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

            REMOVE_TRAINING_SESSION: {
              actions: "Forward training session deletion to program builder",
            },
          },
        },
      },
    },
    {
      actions: {
        "User added an exercise": assign((context, event) => {
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
        // Could make typings works here
        "Forward training session deletion to program builder": sendParent({
          type: "_REMOVE_TRAINING_SESSION",
          trainingSessionId: uuid,
        }),
      },
    }
  );
};
