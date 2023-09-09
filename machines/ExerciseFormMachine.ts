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
import { Exercise, Kilograms, Seconds } from "../types";

export type ExerciseFormMachineEvents =
  | {
    type: "SET_EXERCISE_NAME_AND_GO_NEXT";
    name: string;
  }
  | { type: "USER_WENT_TO_PREVIOUS_SCREEN" }
  | {
    type: "SET_EXERCISE_SET_AND_REP_AND_GO_NEXT";
    set: number;
    rep: number;
  }
  | {
    type: "SET_EXERCISE_LOAD_AND_GO_NEXT";
    load: Kilograms;
  }
  | {
    type: "SET_EXERCISE_REST_AND_GO_NEXT";
    rest: Seconds;
  };

export type ExerciseFormMachineContext = Exercise & {
  skipNameStep: boolean
};

// export type AppMachineInterpreter = InterpreterFrom<
//   ReturnType<typeof createExerciseCreationFormMachine>
// >;

export type ExerciseFormActorRef = ActorRefFrom<
  typeof createExerciseFormMachine
>;

export type ExerciseFormDoneInvokeEvent =
  DoneInvokeEvent<ExerciseFormMachineContext>;

export const createExerciseFormMachine = (
  parentTrainingSessionId: string,
  skipNameStep?: boolean,
  uuid?: string
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
        name: "",
        rep: 0,
        set: 0,
        uuid: uuid || uuidv4(),
        load: 0,
        rest: 0,
        skipNameStep: !!skipNameStep
      },
      initial: "Idle",
      states: {
        "Idle": {
          always: [
            {
              cond: "Should skip name step",
              target: "Set and rep step",
            },
            {
              target: "Exercise name step",
            },
          ],
        },

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
      id: "ExerciseForm",
    },
    {
      guards: {
        "Should skip name step": (context) => context.skipNameStep
      },
      actions: {
        "Assign exercise rest to context": assign({
          rest: (_context, { rest }) => rest
        }),

        "Assign exercise name to context": assign({
          name: (_context, { name }) => name
        }),

        "Assign exercise set and rep to context": assign({
          rep: (_context, { rep }) => rep,
          set: (_context, { set }) => set
        }),

        "Assign exercise load to context": assign({
          load: (_context, { load }) => load
        }),

        "Navigate to set and rep exercise creation form screen": () => {
          router.push({
            pathname: "/(tabs)/program/exercise/[sessionId]/setRep",
            params: {
              sessionId: parentTrainingSessionId,
            }
          })
        },

        "Navigate to load exercise creation form screen": () => {
          router.push({
            pathname: "/(tabs)/program/exercise/[sessionId]/load",
            params: {
              sessionId: parentTrainingSessionId,
            }
          })
        },

        "Navigate to rest exercise creation form screen": () => {
          router.push({
            pathname: "/(tabs)/program/exercise/[sessionId]/rest",
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
