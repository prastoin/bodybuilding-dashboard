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
import { navigateFromRef } from "../navigation/RootNavigation";

export type TrainingSessionCreationFormMachineEvents =
  | {
      type: "SET_ROOM_NAME_AND_GO_NEXT";
      name: string;
    }
  | { type: "GO_BACK" };

export type TrainingSessionCreationFormMachineContext = {
  trainingSessionName: string;
  uuid: string;
};

export type AppMachineInterpreter = InterpreterFrom<
  ReturnType<typeof createTrainingSessionCreationFormMachine>
>;

export type TrainingSessionCreationFormActorRef = ActorRef<
  TrainingSessionCreationFormMachineEvents,
  TrainingSessionCreationFormMachineContext
>;

export type TrainingSessionFormDoneInvokeEvent =
  DoneInvokeEvent<TrainingSessionCreationFormMachineContext>;

export const createTrainingSessionCreationFormMachine = () =>
  /** @xstate-layout N4IgpgJg5mDOIC5QAUBOB7KqCGBbAQgK4CWANhGKgLLYDGAFsQHZgB0AkhKWAMQCCECAAIAKjmbMoQgMpxYxdE0SgADunkAXBUqQgAHogAsh1gDYArAA4AnAHYAjJYBMAZgAMpp7YA0IAJ6I9k7mrPa2hm5elpa2LjYuAL5JvkzoFPC6aJg4BCTklDQMzGyc3Mogapra5QYI1k6sroZOhqaWxkERTr4BCBGsbubW9m5u4aamYfbmySBZWHhEZBTUdIwsrCwA7kKwGtgaYEL25ZXEWoo1gW4m1obmLU71praTLj2ILi4NLhG2TjFHJZftYZglfPMckt8qsiixTupztVdLUnG4zFY7I5XB4vB8EABab6sYZOFqg1rmQykpJJIA */
  createMachine(
    {
      schema: {
        context: {} as TrainingSessionCreationFormMachineContext,
        events: {} as TrainingSessionCreationFormMachineEvents,
      },
      tsTypes:
        {} as import("./TrainingSessionCreationFormMachine.typegen").Typegen0,
      context: {
        trainingSessionName: "",
        uuid: uuidv4(),
      },
      initial: "Training session name step",
      states: {
        "Training session name step": {
          on: {
            SET_ROOM_NAME_AND_GO_NEXT: {
              target: "Form is completed",
              actions: "assignTrainingSessionNameToContext",
            },
            GO_BACK: {
              actions: "NotifyParentToCancelTrainingSessionOperation",
            },
          },
        },

        "Form is completed": {
          entry: "popBackToTop",
          type: "final",

          data: ({ trainingSessionName, uuid }) => ({
            trainingSessionName,
            uuid,
          }),
        },
      },
      id: "ProgramBuilderMachine",
    },
    {
      actions: {
        assignTrainingSessionNameToContext: assign((context, { name }) => {
          console.log("ASSIGN IN FORM MACHINE");

          return {
            ...context,
            trainingSessionName: name,
          };
        }),
        NotifyParentToCancelTrainingSessionOperation: sendParent({
          type: "_CANCEL_TRAINING_SESSION_CREATION_OPERATION",
        }),
      },
    }
  );
