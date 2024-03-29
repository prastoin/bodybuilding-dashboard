import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import {
  ActorRef,
  assign,
  createMachine,
  DoneInvokeEvent
} from "xstate";
import { sendParent } from "xstate/lib/actions";

export type SessionFormMachineEvents =
  | {
    type: "SET_SESSION_NAME_AND_GO_NEXT";
    name: string;
  }
  | { type: "USER_WENT_TO_PREVIOUS_SCREEN" };

export type SessionFormMachineContext = {
  name: string;
  uuid: string;
};

// export type AppMachineInterpreter = InterpreterFrom<
//   ReturnType<typeof createSessionFormMachine>
// >;

export type SessionFormActorRef = ActorRef<
  SessionFormMachineEvents,
  SessionFormMachineContext
>;

export type SessionFormDoneInvokeEvent =
  DoneInvokeEvent<SessionFormMachineContext>;

export const createSessionFormMachine = () =>
  /** @xstate-layout N4IgpgJg5mDOIC5QAUBOB7KqCGBbAQgK4CWANhGKgLLYDGAFsQHZgB0AkhKWAMQCCECAAIAKjmbMoQgMpxYxdE0SgADunkAXBUqQgAHogAsh1gDYArAA4AnAHYAjJYBMAZgAMpp7YA0IAJ6I9k7mrPa2hm5elpa2LjYuAL5JvkzoFPC6aJg4BCTklDQMzGyc3Mogapra5QYI1k6sroZOhqaWxkERTr4BCBGsbubW9m5u4aamYfbmySBZWHhEZBTUdIwsrCwA7kKwGtgaYEL25ZXEWoo1gW4m1obmLU71praTLj2ILi4NLhG2TjFHJZftYZglfPMckt8qsiixTupztVdLUnG4zFY7I5XB4vB8EABab6sYZOFqg1rmQykpJJIA */
  createMachine(
    {
      predictableActionArguments: true,
      schema: {
        context: {} as SessionFormMachineContext,
        events: {} as SessionFormMachineEvents,
      },
      tsTypes:
        {} as import("./SessionFormMachine.typegen").Typegen0,
      context: {
        name: "",
        uuid: uuidv4(),
      },
      initial: "Session name step",
      states: {
        "Session name step": {
          on: {
            SET_SESSION_NAME_AND_GO_NEXT: {
              target: "Form is completed",
              actions: "Assign session name to context",
            },
            USER_WENT_TO_PREVIOUS_SCREEN: {
              actions: "Notify parent that user exited the form",
            },
          },
        },

        "Form is completed": {
          type: "final",

          data: ({ name, uuid }) => ({
            name,
            uuid,
          }),
        },
      },
      id: "SessionMachine",
    },
    {
      actions: {
        "Assign session name to context": assign({
          name: (_context, { name }) => name
        }),

        "Notify parent that user exited the form": sendParent({
          type: "_CANCEL_SESSION_FORM",
        }),
      },
    }
  );
