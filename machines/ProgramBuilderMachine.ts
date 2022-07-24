import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { assign, createMachine, EventFrom, spawn } from "xstate";
import {
  createTrainingSessionMachine,
  TrainingSessionActorRef,
} from "./TrainingSessionMachine";

export type ProgramBuilderMachineEvents = EventFrom<
  ReturnType<typeof createProgramBuilderMachine>
>;

export const createProgramBuilderMachine = () =>
  /** @xstate-layout N4IgpgJg5mDOIC5QAUBOB7KqCGBbAQgK4CWANhGKgLLYDGAFsQHZgB0AkhKWAMQCCECAAIAKjmbMoQgMpxYxdE0SgADunkAXBUqQgAHogAsh1gDYArAA4AnAHYAjJYBMAZgAMpp7YA0IAJ6I9k7mrPa2hm5elpa2LjYuAL5JvkzoFPC6aJg4BCTklDQMzGyc3Mogapra5QYI1k6sroZOhqaWxkERTr4BCBGsbubW9m5u4aamYfbmySBZWHhEZBTUdIwsrCwA7kKwGtgaYEL25ZXEWoo1gW4m1obmLU71praTLj2ILi4NLhG2TjFHJZftYZglfPMckt8qsiixTupztVdLUnG4zFY7I5XB4vB8EABab6sYZOFqg1rmQykpJJIA */
  createMachine(
    {
      schema: {
        context: {} as {
          trainingSessionActorRefCollection: TrainingSessionActorRef[];
        },
        events: {} as
          | {
              type: "ADD_TRAINING_SESSION";
              name?: string;
            }
          | { type: "_REMOVE_TRAINING_SESSION"; trainingSessionId: string },
      },
      tsTypes: {} as import("./ProgramBuilderMachine.typegen").Typegen0,
      context: {
        trainingSessionActorRefCollection: [],
      },
      initial: "Idle",
      states: {
        Idle: {
          on: {
            ADD_TRAINING_SESSION: {
              actions: "addTrainingSessionToContext",
            },
            _REMOVE_TRAINING_SESSION: {
              actions: "removeTrainingSessionToContext",
            },
          },
        },
      },
      id: "ProgramBuilderMachine",
    },
    {
      actions: {
        addTrainingSessionToContext: assign((context, event) => {
          const trainingSessionName = event.name || `Training Session`;

          const newTrainingSessionId = uuidv4();
          const newTrainingSessionActor: TrainingSessionActorRef = spawn(
            createTrainingSessionMachine({
              trainingSessionName: trainingSessionName,
              uuid: newTrainingSessionId,
            }),
            { sync: true, name: newTrainingSessionId }
          );
          return {
            ...context,
            trainingSessionActorRefCollection: [
              ...context.trainingSessionActorRefCollection,
              newTrainingSessionActor,
            ],
          };
        }),

        removeTrainingSessionToContext: assign(
          (context, { trainingSessionId }) => {
            const updatedTrainingSessionActorRefCollection =
              context.trainingSessionActorRefCollection.filter((actor) => {
                const currentActorNeedToBeRemoved =
                  actor.id === trainingSessionId;
                if (currentActorNeedToBeRemoved) {
                  if (actor.stop) {
                    actor.stop();
                  }

                  return false;
                }
                return true;
              });

            return {
              ...context,
              trainingSessionActorRefCollection:
                updatedTrainingSessionActorRefCollection,
            };
          }
        ),
      },
    }
  );
