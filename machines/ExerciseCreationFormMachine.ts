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

export type ExerciseCreationFormMachineEvents =
  | {
      type: "SET_EXERCISE_NAME_AND_GO_NEXT";
      name: string;
    }
  | { type: "USER_WENT_TO_PREVIOUS_SCREEN" };

export type ExerciseCreationFormMachineContext = {
  exerciseName: string;
  uuid: string;
};

export type AppMachineInterpreter = InterpreterFrom<
  ReturnType<typeof createExerciseCreationFormMachine>
>;

export type ExerciseCreationFormActorRef = ActorRef<
  ExerciseCreationFormMachineEvents,
  ExerciseCreationFormMachineContext
>;

export type ExerciseFormCreationDoneInvokeEvent =
  DoneInvokeEvent<ExerciseCreationFormMachineContext>;

export const createExerciseCreationFormMachine = () =>
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
        uuid: uuidv4(),
      },
      initial: "Training session name step",
      states: {
        "Training session name step": {
          on: {
            SET_EXERCISE_NAME_AND_GO_NEXT: {
              target: "Form is completed",
              actions: "assignTrainingSessionNameToContext",
            },
            USER_WENT_TO_PREVIOUS_SCREEN: {
              actions: "Notify parent that user exited the form",
            },
          },
        },

        "Form is completed": {
          type: "final",

          data: ({ exerciseName, uuid }) => ({
            exerciseName,
            uuid,
          }),
        },
      },
      id: "ExerciseCreationForm",
    },
    {
      actions: {
        assignTrainingSessionNameToContext: assign((context, { name }) => {
          return {
            ...context,
            exerciseName: name,
          };
        }),
        "Notify parent that user exited the form": sendParent({
          type: "_USER_CANCELLED_EXERCISE_CREATION_FORM",
        }),
      },
    }
  );