import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import {
  ActorRef,
  assign,
  createMachine,
  DoneInvokeEvent,
  InterpreterFrom,
} from "xstate";
import { sendParent } from "xstate/lib/actions";
import {
  navigateBackFromRef,
  navigateFromRef,
} from "../navigation/RootNavigation";
import { TrainingSessionExercise } from "../types";

export type ExerciseCreationFormMachineEvents =
  | {
      type: "SET_EXERCISE_NAME_AND_GO_NEXT";
      name: string;
    }
  | { type: "USER_WENT_TO_PREVIOUS_SCREEN" }
  | {
      type: "SET_EXERCISE_SET_AND_REP_AND_GO_NEXT";
      setCounter: number;
      repCounter: number;
    };

export type ExerciseCreationFormMachineContext = TrainingSessionExercise;

export type AppMachineInterpreter = InterpreterFrom<
  ReturnType<typeof createExerciseCreationFormMachine>
>;

export type ExerciseCreationFormActorRef = ActorRef<
  ExerciseCreationFormMachineEvents,
  ExerciseCreationFormMachineContext
>;

export type ExerciseFormCreationDoneInvokeEvent =
  DoneInvokeEvent<ExerciseCreationFormMachineContext>;

export const createExerciseCreationFormMachine = (
  parentTrainingSessionId: string
) =>
  /** @xstate-layout N4IgpgJg5mDOIC5QAUBOB7KqCGBbAQgK4CWANhGKgLLYDGAFsQHZgB0AkhKWAMQCCECAAIAKjmbMoQgMpxYxdE0SgADunkAXBUqQgAHogAsh1gDYArAA4AnAHYAjJYBMAZgAMpp7YA0IAJ6I9k7mrPa2hm5elpa2LjYuAL5JvkzoFPC6aJg4BCTklDQMzGyc3Mogapra5QYI1k6sroZOhqaWxkERTr4BCBGsbubW9m5u4aamYfbmySBZWHhEZBTUdIwsrCwA7kKwGtgaYEL25ZXEWoo1gW4m1obmLU71praTLj2ILi4NLhG2TjFHJZftYZglfPMckt8qsiixTupztVdLUnG4zFY7I5XB4vB8EABab6sYZOFqg1rmQykpJJIA */
  createMachine(
    {
      schema: {
        context: {} as ExerciseCreationFormMachineContext,
        events: {} as ExerciseCreationFormMachineEvents,
      },
      tsTypes: {} as import("./ExerciseCreationFormMachine.typegen").Typegen0,
      context: {
        exerciseName: "",
        repCounter: 0,
        setCounter: 0,
        uuid: uuidv4(),
        load: {
          unit: "kg",
          value: 0,
        },
      },
      initial: "Exercise name step",
      states: {
        "Exercise name step": {
          on: {
            SET_EXERCISE_NAME_AND_GO_NEXT: {
              target: "Set and rep step",
              actions: [
                "Assign exercise name to context",
                "Navigate to set and rep exercise creation form screen",
              ],
            },

            USER_WENT_TO_PREVIOUS_SCREEN: {
              actions: "Notify parent that user exited the form",
            },
          },
        },

        "Set and rep step": {
          on: {
            SET_EXERCISE_SET_AND_REP_AND_GO_NEXT: {
              target: "Form is completed",
              actions: "Assign exercise set and rep to context",
            },

            USER_WENT_TO_PREVIOUS_SCREEN: {
              target: "Exercise name step",
            },
          },
        },

        "Form is completed": {
          type: "final",

          data: (context) => context,
        },
      },
      id: "ExerciseCreationForm",
    },
    {
      actions: {
        "Assign exercise name to context": assign((context, { name }) => {
          return {
            ...context,
            exerciseName: name,
          };
        }),

        "Assign exercise set and rep to context": assign(
          (context, { repCounter, setCounter }) => {
            return {
              ...context,
              repCounter,
              setCounter,
            };
          }
        ),

        "Navigate to set and rep exercise creation form screen": () =>
          navigateFromRef("ProgramBuilder", {
            screen: "ExerciseCreationForm",
            params: {
              screen: "SetAndRep",
              params: {
                trainingSessionId: parentTrainingSessionId,
              },
            },
          }),

        "Notify parent that user exited the form": sendParent({
          type: "_USER_CANCELLED_EXERCISE_CREATION_FORM",
        }),
      },
    }
  );
