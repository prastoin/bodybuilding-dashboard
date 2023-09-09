import { router } from "expo-router";
import { ActorRef, assign, createMachine, State } from "xstate";
import { sendParent } from "xstate/lib/actions";
import { Exercise } from "../types";

type EditableContextKey = keyof Omit<ExerciseMachineContext, "uuid">
type UserFinishedEditingField = {
  type: "USER_FINISHED_UPDATING_FIELD",
  update: Partial<Pick<ExerciseMachineContext, EditableContextKey>>
}

type ExerciseMachineEvent =
  | {
    type: "REMOVE_EXERCISE";
  }
  | {
    type: "USER_ENTERED_NAME_EDITION_OPERATION";
  }
  | {
    type: "USER_ENTERED_SET_AND_REP_EDITOR";
  }
  | {
    type: "USER_ENTERED_LOAD_EDITOR";
  }
  | {
    type: "USER_ENTERED_REST_EDITOR";
  }
  | UserFinishedEditingField
  | { type: "USER_CANCELLED_CURRENT_EDIT" }

type ExerciseMachineContext = Exercise;

export type ExerciseMachineState = State<
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
    rep,
    set,
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
        set,
        rep,
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
            "USER_FINISHED_UPDATING_FIELD": {
              actions: [
                "Assign updated field to context",
                "Navigate go back",
              ],
              target: "Idle",
            },

            "USER_CANCELLED_CURRENT_EDIT": {
              target: "Idle",
            },
          },
        },

        "User is editing set and rep": {
          entry: "Navigate to set and rep editor screen",

          on: {
            "USER_FINISHED_UPDATING_FIELD": {
              target: "Idle",
              actions: [
                "Assign updated field to context",
                "Navigate go back",
              ],
            },

            USER_CANCELLED_CURRENT_EDIT: {
              target: "Idle",
            },
          },
        },

        "User is editing load": {
          entry: "Navigate to load editor screen",

          on: {
            "USER_FINISHED_UPDATING_FIELD": {
              target: "Idle",
              actions: [
                "Assign updated field to context",
                "Navigate go back",
              ],
            },

            USER_CANCELLED_CURRENT_EDIT: {
              target: "Idle",
            },
          },
        },

        "User is editing rest": {
          entry: "Navigate to rest editor screen",

          on: {
            "USER_FINISHED_UPDATING_FIELD": {
              target: "Idle",
              actions: [
                "Assign updated field to context",
                "Navigate go back",
              ],
            },

            USER_CANCELLED_CURRENT_EDIT: {
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

        "Assign updated field to context": assign((context, { update }) => {
          const result: any = {
            ...context,
            ...update
          }
          return result
        }),

        "Forward exercise deletion to program builder": sendParent({
          type: "_REMOVE_SESSION_EXERCISE",
          exerciseId: uuid,
        }),
      },
    }
  );
