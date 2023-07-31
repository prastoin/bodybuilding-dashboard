import { router } from "expo-router";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import {
  ActorRefFrom,
  assign,
  createMachine,
  DoneInvokeEvent
} from "xstate";
import { sendParent } from "xstate/lib/actions";
import { Exercise, ExerciseLoad, ExerciseRest } from "../types";

export type ExerciseFormMachineEvents =
  | {
    type: "SET_EXERCISE_NAME_AND_GO_NEXT";
    name: string;
  }
  | { type: "USER_WENT_TO_PREVIOUS_SCREEN" }
  | {
    type: "SET_EXERCISE_SET_AND_REP_AND_GO_NEXT";
    setCounter: number;
    repCounter: number;
  }
  | {
    type: "SET_EXERCISE_LOAD_AND_GO_NEXT";
    load: ExerciseLoad;
  }
  | {
    type: "SET_EXERCISE_REST_AND_GO_NEXT";
    rest: ExerciseRest;
  };

export type ExerciseFormMachineContext = Exercise;

// export type AppMachineInterpreter = InterpreterFrom<
//   ReturnType<typeof createExerciseCreationFormMachine>
// >;

export type ExerciseFormActorRef = ActorRefFrom<
  typeof createExerciseFormMachine
>;

export type ExerciseFormDoneInvokeEvent =
  DoneInvokeEvent<ExerciseFormMachineContext>;

export const createExerciseFormMachine = (
  parentTrainingSessionId: string
) =>
  /** @xstate-layout N4IgpgJg5mDOIC5QAUBOB7KqCGBbAQgK4CWANhGKgLLYDGAFsQHZgB0AkhKWAMQCCECAAIAKjmbMoQgMpxYxdE0SgADunkAXBUqQgAHogAsh1gDYArAA4AnAHYAjJYBMAZgAMpp7YA0IAJ6I9k7mrPa2hm5elpa2LjYuAL5JvkzoFPC6aJg4BCTklDQMzGyc3Mogapra5QYI1k6sroZOhqaWxkERTr4BCBGsbubW9m5u4aamYfbmySBZWHhEZBTUdIwsrCwA7kKwGtgaYEL25ZXEWoo1gW4m1obmLU71praTLj2ILi4NLhG2TjFHJZftYZglfPMckt8qsiixTupztVdLUnG4zFY7I5XB4vB8EABab6sYZOFqg1rmQykpJJIA */
  createMachine(
    {
      predictableActionArguments: true,
      schema: {
        context: {} as ExerciseFormMachineContext,
        events: {} as ExerciseFormMachineEvents,
      },
      tsTypes: {} as import("./ExerciseFormMachine.typegen").Typegen0,
      context: {
        exerciseName: "",
        repCounter: 0,
        setCounter: 0,
        uuid: uuidv4(),
        load: {
          unit: "kg",
          value: 0,
        },
        rest: {
          minute: 0,
          second: 0,
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
              target: "Exercise load step",
              actions: [
                "Assign exercise set and rep to context",
                "Navigate to load exercise creation form screen",
              ],
            },

            USER_WENT_TO_PREVIOUS_SCREEN: {
              target: "Exercise name step",
            },
          },
        },

        "Exercise load step": {
          on: {
            SET_EXERCISE_LOAD_AND_GO_NEXT: {
              target: "Exercise rest step",
              actions: [
                "Assign exercise load to context",
                "Navigate to rest exercise creation form screen",
              ],
            },

            USER_WENT_TO_PREVIOUS_SCREEN: {
              target: "Set and rep step",
            },
          },
        },

        "Exercise rest step": {
          on: {
            SET_EXERCISE_REST_AND_GO_NEXT: {
              target: "Form is completed",
              actions: "Assign exercise rest to context",
            },

            USER_WENT_TO_PREVIOUS_SCREEN: {
              target: "Exercise load step",
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
        "Assign exercise rest to context": assign((context, { rest }) => {
          return {
            ...context,
            rest,
          };
        }),

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

        "Assign exercise load to context": assign((context, { load }) => {
          return {
            ...context,
            load,
          };
        }),

        "Navigate to set and rep exercise creation form screen": () => {
          router.push({
            pathname: "/(tabs)/programBuilder/exercise/[sessionId]/setRep",
            params: {
              sessionId: parentTrainingSessionId,
            }
          })
        },

        "Navigate to load exercise creation form screen": () => {
          router.push({
            pathname: "/(tabs)/programBuilder/exercise/[sessionId]/load",
            params: {
              sessionId: parentTrainingSessionId,
            }
          })
        },

        "Navigate to rest exercise creation form screen": () => {
          router.push({
            pathname: "/(tabs)/programBuilder/exercise/[sessionId]/rest",
            params: {
              sessionId: parentTrainingSessionId,
            }
          })
        },

        "Notify parent that user exited the form": sendParent({
          type: "_USER_CANCELLED_EXERCISE_CREATION_FORM",
        }),
      },
    }
  );
