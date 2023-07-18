import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { createMachine, EventFrom, InterpreterFrom } from "xstate";
import { navigateFromRef } from "../navigation/RootNavigation";
import { createSessionTrackerFormMachine } from "./SessionTrackerFormMachine";
import { TrainingSessionMachineContext } from "./TrainingSessionMachine";

export type SessionTrackerMachineEvents = {
  type: "USER_STARTED_NEXT_TRAINING_SESSION_TRACKER";
  trainingSessionMachineContext: TrainingSessionMachineContext;
}
export type SessionTrackerMachineContext = {};

export type SessionTrackerMachineInterpreter = InterpreterFrom<
  typeof createSessionTrackerMachine
>;

export const createSessionTrackerMachine = () =>
  /** @xstate-layout N4IgpgJg5mDOIC5QAUBOB7KqCGBbAQgK4CWANhGKgLLYDGAFsQHZgB0AkhKWAMQCCECAAIAKjmbMoQgMpxYxdE0SgADunkAXBUqQgAHogAsh1gDYArAA4AnAHYAjJYBMAZgAMpp7YA0IAJ6I9k7mrPa2hm5elpa2LjYuAL5JvkzoFPC6aJg4BCTklDQMzGyc3Mogapra5QYI1k6sroZOhqaWxkERTr4BCBGsbubW9m5u4aamYfbmySBZWHhEZBTUdIwsrCwA7kKwGtgaYEL25ZXEWoo1gW4m1obmLU71praTLj2ILi4NLhG2TjFHJZftYZglfPMckt8qsiixTupztVdLUnG4zFY7I5XB4vB8EABab6sYZOFqg1rmQykpJJIA */
  createMachine(
    {
      schema: {
        context: {} as SessionTrackerMachineContext,
        events: {} as SessionTrackerMachineEvents,
      },
      context: {},
      tsTypes: {} as import("./SessionTrackerMachine.typegen").Typegen0,
      initial: "Idle",
      states: {
        Idle: {
          on: {
            USER_STARTED_NEXT_TRAINING_SESSION_TRACKER: {
              target: "User entered session tracker instance"
            },
          },
        },

        "User entered session tracker instance": {
          entry: "Navigate to session tracker first step",

          invoke: {
            id: "InvokedSessionTrackerForm",
            src: createSessionTrackerFormMachine,

            data: (_context, { trainingSessionMachineContext }) => ({
              trainingSessionMachineContext: trainingSessionMachineContext,
              sessionTrackerId: uuidv4(),
            }),
          },
        },
      },
      id: "SessionTrackerMachine",
    },
    {
      actions: {
        "Navigate to session tracker first step": () =>
          navigateFromRef("SessionTracker", {
            screen: "SessionTrackerCreationForm",
            params: {
              screen: "Load"
            }
          }),
      },
    }
  );

// invoke: {
//   id: "SessionTrackerForm",

//   src: () => {
//     return createSessionTrackerFormMachine();
//   },

//   data: {
//     trainingSessionId: (context) => context.
//   },

// },
