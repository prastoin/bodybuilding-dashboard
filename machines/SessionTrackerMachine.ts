import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { createMachine, EventFrom, InterpreterFrom } from "xstate";

export type SessionTrackerMachineEvents = EventFrom<
  ReturnType<typeof createSessionTrackerMachine>
>;

export type SessionTrackerMachineContext = {};

export type SessionTrackerMachineInterpreter = InterpreterFrom<
  ReturnType<typeof createSessionTrackerMachine>
>;

export const createSessionTrackerMachine = () =>
  /** @xstate-layout N4IgpgJg5mDOIC5QAUBOB7KqCGBbAQgK4CWANhGKgLLYDGAFsQHZgB0AkhKWAMQCCECAAIAKjmbMoQgMpxYxdE0SgADunkAXBUqQgAHogAsh1gDYArAA4AnAHYAjJYBMAZgAMpp7YA0IAJ6I9k7mrPa2hm5elpa2LjYuAL5JvkzoFPC6aJg4BCTklDQMzGyc3Mogapra5QYI1k6sroZOhqaWxkERTr4BCBGsbubW9m5u4aamYfbmySBZWHhEZBTUdIwsrCwA7kKwGtgaYEL25ZXEWoo1gW4m1obmLU71praTLj2ILi4NLhG2TjFHJZftYZglfPMckt8qsiixTupztVdLUnG4zFY7I5XB4vB8EABab6sYZOFqg1rmQykpJJIA */
  createMachine(
    {
      schema: {
        context: {} as SessionTrackerMachineContext,
        events: {} as {
          type: "ENTER_TRAINING_SESSION_CREATION_FORM";
        },
      },
      tsTypes: {} as import("./SessionTrackerMachine.typegen").Typegen0,
      context: {},
      states: {},
      id: "SessionTrackerMachine",
    },
    {}
  );
