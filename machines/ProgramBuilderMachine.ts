import { addToCleanupQueue } from "@testing-library/react-native/build/cleanup";
import { assign, createMachine } from "xstate";
import { TrainingSessionCollection } from "../types";

export const createProgramBuilderMachine = () =>
  /** @xstate-layout N4IgpgJg5mDOIC5QAUBOB7KqCGBbAQgK4CWANhGKgLLYDGAFsQHZgB0AkhKWAMQCCECAAIAKjmbMoQgMpxYxdE0SgADunkAXBUqQgAHogAsh1gDYArAA4AnAHYAjJYBMAZgAMpp7YA0IAJ6I9k7mrPa2hm5elpa2LjYuAL5JvkzoFPC6aJg4BCTklDQMzGyc3Mogapra5QYI1k6sroZOhqaWxkERTr4BCBGsbubW9m5u4aamYfbmySBZWHhEZBTUdIwsrCwA7kKwGtgaYEL25ZXEWoo1gW4m1obmLU71praTLj2ILi4NLhG2TjFHJZftYZglfPMckt8qsiixTupztVdLUnG4zFY7I5XB4vB8EABab6sYZOFqg1rmQykpJJIA */
  createMachine(
    {
      schema: {
        context: {} as { trainingSessions: TrainingSessionCollection },
        events: {} as
          | {
              type: "ADD_TRAINING_SESSION";
              name: string;
            }
          | { type: "REMOVE_TRAINING_SESSION" },
      },
      tsTypes: {} as import("./ProgramBuilderMachine.typegen").Typegen0,
      context: {
        trainingSessions: [],
      },
      initial: "Idle",
      states: {
        Idle: {
          on: {
            ADD_TRAINING_SESSION: {
              target: "User is adding new training session",
            },
            REMOVE_TRAINING_SESSION: {
              target: "User is removing last training session",
            },
          },
        },

        "User is removing last training session": {
          entry: "removeTrainingSessionToContext",

          after: {
            TRAINING_SESSION_EDITION_DELAY: {
              target: "Idle",
            },
          },
        },

        "User is adding new training session": {
          entry: "addTrainingSessionToContext",

          after: {
            TRAINING_SESSION_EDITION_DELAY: {
              target: "Idle",
            },
          },
        },
      },
      id: "ProgramBuilderMachine",
    },
    {
      actions: {
        addTrainingSessionToContext: assign((context, event) => {
          return {
            ...context,
            trainingSessions: [
              ...context.trainingSessions,
              {
                name: event.name,
              },
            ],
          };
        }),

        removeTrainingSessionToContext: assign((context, _event) => {
          const indexToRemove = Math.max(
            0,
            context.trainingSessions.length - 1
          );

          return {
            ...context,
            trainingSessions: context.trainingSessions.filter(
              (_trainingSession, index) => index !== indexToRemove
            ),
          };
        }),
      },
      delays: {
        TRAINING_SESSION_EDITION_DELAY: 500,
      },
    }
  );
