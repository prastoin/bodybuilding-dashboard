import { router } from "expo-router";
import { ActorRef, assign, createMachine, State } from "xstate";
import { sendParent } from "xstate/lib/actions";
import { Exercise, ExerciseLoad, ExerciseRest } from "../types";

type ExerciseMachineEvent =
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
    name: string;
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
    type: "USER_ENTERED_LOAD_EDITOR";
  }
  | {
    type: "USER_CANCELLED_LOAD_EDITION";
  }
  | {
    type: "USER_FINISHED_LOAD_EDITION";
    load: ExerciseLoad;
  }
  | {
    type: "USER_ENTERED_REST_EDITOR";
  }
  | {
    type: "USER_CANCELLED_REST_EDITION";
  }
  | {
    type: "USER_FINISHED_REST_EDITION";
    rest: ExerciseRest;
  };

type ExerciseMachineContext = Exercise;

type ExerciseMachineState = State<
  ExerciseMachineContext,
  ExerciseMachineEvent
>;

export type ExerciseActorRef = ActorRef<
  ExerciseMachineEvent,
  ExerciseMachineState
>;

type CreateExerciseMachineArgs = {
  exercise: Exercise
  parentSessionId: string;
};

export const createExerciseMachine = ({
  exercise: {
    name,
    uuid,
    repCounter,
    setCounter,
    load,
    rest,
  },
  parentSessionId,
}: CreateExerciseMachineArgs) =>
  createMachine(
    {
      predictableActionArguments: true,
      tsTypes:
        {} as import("./ExerciseMachine.typegen").Typegen0,
      id: uuid,
      schema: {
        context: {} as ExerciseMachineContext,
        events: {} as ExerciseMachineEvent,
      },
      context: {
        name,
        uuid,
        setCounter,
        repCounter,
        load,
        rest,
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

            USER_ENTERED_LOAD_EDITOR: {
              target: "User is editing load",
            },

            USER_ENTERED_REST_EDITOR: {
              target: "User is editing rest",
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

        "User is editing load": {
          entry: "Navigate to load editor screen",

          on: {
            USER_FINISHED_LOAD_EDITION: {
              target: "Idle",
              actions: ["Assign new load to context", "Navigate go back"],
            },

            USER_CANCELLED_LOAD_EDITION: {
              target: "Idle",
            },
          },
        },

        "User is editing rest": {
          entry: "Navigate to rest editor screen",

          on: {
            USER_FINISHED_REST_EDITION: {
              target: "Idle",
              actions: ["Assign new rest to context", "Navigate go back"],
            },

            USER_CANCELLED_REST_EDITION: {
              target: "Idle",
            },
          },
        },
      },
    },
    {
      // Please refactor this within only one action taking the typed field to avoid repetition
      actions: {
        "Navigate to name editor screen": ({ uuid: exerciseId }) => {
          router.push({
            pathname: "/(tabs)/program/exercise/[sessionId]/[exerciseId]/name",
            params: {
              sessionId: parentSessionId,
              exerciseId
            }
          })
        },

        "Navigate to set and rep editor screen": ({ uuid: exerciseId }) => {
          router.push({
            pathname: "/(tabs)/program/exercise/[sessionId]/[exerciseId]/setRep",
            params: {
              sessionId: parentSessionId,
              exerciseId
            }
          })
        },

        "Navigate to rest editor screen": ({ uuid: exerciseId }) => {
          router.push({
            pathname: "/(tabs)/program/exercise/[sessionId]/[exerciseId]/rest",
            params: {
              sessionId: parentSessionId,
              exerciseId
            }
          })
        },

        "Navigate to load editor screen": ({ uuid: exerciseId }) => {
          router.push({
            pathname: "/(tabs)/program/exercise/[sessionId]/[exerciseId]/load",
            params: {
              sessionId: parentSessionId,
              exerciseId
            }
          })
        },

        "Navigate go back": () => {
          router.back()
        },

        "Assign new exercise name to context": assign({
          name: (_context, { name }) => name
        }),

        "Assign new set and rep to context": assign({
          repCounter: (_context, { repCounter }) => repCounter,
          setCounter: (_context, { setCounter }) => setCounter
        }),

        "Assign new load to context": assign({
          load: (_context, { load }) => load
        }),

        "Assign new rest to context": assign({
          rest: (_context, { rest }) => rest
        }),

        "Forward exercise deletion to program builder": sendParent({
          type: "_REMOVE_SESSION_EXERCISE",
          exerciseId: uuid,
        }),
      },
    }
  );
