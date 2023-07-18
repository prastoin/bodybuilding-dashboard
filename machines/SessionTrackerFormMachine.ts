import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { ActorRef, ActorRefFrom, createMachine, State } from "xstate";
import { TrainingSessionMachineContext } from "./TrainingSessionMachine";

export type SessionTrackerFormMachineContext = {
  sessionTrackerId: string;
  trainingSessionMachineContext: TrainingSessionMachineContext;
};

type SessionTrackerFormMachineEvents = {
  type: "ENTER_TRAINING_SESSION_CREATION_FORM";
}

export type SessionTrackerFormMachineState = State<SessionTrackerFormMachineContext, SessionTrackerFormMachineEvents>

export type SessionTrackerFormActorRef = ActorRefFrom<
  typeof createSessionTrackerFormMachine
>;

export const createSessionTrackerFormMachine = () =>
  /** @xstate-layout N4IgpgJg5mDOIC5QAUBOB7KqCGBbAQgK4CWANhGKgLLYDGAFsQHZgB0AkhKWAMQCCECAAIAKjmbMoQgMpxYxdE0SgADunkAXBUqQgAHogAsh1gDYArAA4AnAHYAjJYBMAZgAMpp7YA0IAJ6I9k7mrPa2hm5elpa2LjYuAL5JvkzoFPC6aJg4BCTklDQMzGyc3Mogapra5QYI1k6sroZOhqaWxkERTr4BCBGsbubW9m5u4aamYfbmySBZWHhEZBTUdIwsrCwA7kKwGtgaYEL25ZXEWoo1gW4m1obmLU71praTLj2ILi4NLhG2TjFHJZftYZglfPMckt8qsiixTupztVdLUnG4zFY7I5XB4vB8EABab6sYZOFqg1rmQykpJJIA */
  createMachine(
    {
      schema: {
        context: {} as SessionTrackerFormMachineContext,
        events: {} as SessionTrackerFormMachineEvents
      },
      tsTypes: {} as import("./SessionTrackerFormMachine.typegen").Typegen0,
      initial: "Idle",
      states: {
        Idle: {},
      },
      id: "SessionTrackerMachine",
    },
    {}
  );
