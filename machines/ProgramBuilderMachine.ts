import {
  assign,
  createMachine,
  EventFrom,
  InterpreterFrom,
  spawn,
} from "xstate";
import { navigateFromRef } from "../navigation/RootNavigation";
import {
  createTrainingSessionCreationFormMachine,
  TrainingSessionFormDoneInvokeEvent,
} from "./TrainingSessionCreationFormMachine";
import {
  createTrainingSessionMachine,
  TrainingSessionActorRef,
} from "./TrainingSessionMachine";

export type ProgramBuilderMachineEvents = EventFrom<
  ReturnType<typeof createProgramBuilderMachine>
>;

export type ProgramBuilderMachineContext = {
  trainingSessionActorRefCollection: TrainingSessionActorRef[];
};

export type AppMachineInterpreter = InterpreterFrom<
  ReturnType<typeof createProgramBuilderMachine>
>;

export const createProgramBuilderMachine = () =>
  /** @xstate-layout N4IgpgJg5mDOIC5QAUBOB7KqCGBbAQgK4CWANhGKgLLYDGAFsQHZgB0AkhKWAMQCCECAAIAKjmbMoQgMpxYxdE0SgADunkAXBUqQgAHogAsh1gDYArAA4AnAHYAjJYBMAZgAMpp7YA0IAJ6I9k7mrPa2hm5elpa2LjYuAL5JvkzoFPC6aJg4BCTklDQMzGyc3Mogapra5QYI1k6sroZOhqaWxkERTr4BCBGsbubW9m5u4aamYfbmySBZWHhEZBTUdIwsrCwA7kKwGtgaYEL25ZXEWoo1gW4m1obmLU71praTLj2ILi4NLhG2TjFHJZftYZglfPMckt8qsiixTupztVdLUnG4zFY7I5XB4vB8EABab6sYZOFqg1rmQykpJJIA */
  createMachine(
    {
      schema: {
        context: {} as ProgramBuilderMachineContext,
        events: {} as
          | {
              type: "ENTER_TRAINING_SESSION_CREATION_FORM";
            }
          | { type: "_REMOVE_TRAINING_SESSION"; trainingSessionId: string }
          | { type: "_CANCEL_TRAINING_SESSION_CREATION_OPERATION" },
      },
      tsTypes: {} as import("./ProgramBuilderMachine.typegen").Typegen0,
      context: {
        trainingSessionActorRefCollection: [],
      },
      initial: "Idle",
      states: {
        Idle: {
          on: {
            ENTER_TRAINING_SESSION_CREATION_FORM: {
              target: "Creating a training session",
            },
            _REMOVE_TRAINING_SESSION: {
              actions: "removeTrainingSessionToContext",
            },
          },
        },

        "Creating a training session": {
          entry: "navigateToTrainingSessionCreationForm",

          invoke: {
            id: "TrainingSessionCreationForm",

            src: () => {
              return createTrainingSessionCreationFormMachine();
            },

            onDone: {
              target: "Idle",
              actions: [
                "addTrainingSessionToContext",
                "resetProgramBuilderStackNavigator",
              ],
            },
          },

          on: {
            _CANCEL_TRAINING_SESSION_CREATION_OPERATION: {
              target: "Idle",
            },
          },
        },
      },
      id: "ProgramBuilderMachine",
    },
    {
      actions: {
        navigateToTrainingSessionCreationForm: (_context, _event) => {
          navigateFromRef("ProgramBuilder", {
            screen: "TrainingSesssionCreationFormName",
          });
        },

        resetProgramBuilderStackNavigator: (_context, _event) => {
          navigateFromRef("ProgramBuilder", {
            screen: "Index",
          });
        },

        addTrainingSessionToContext: assign((context, event) => {
          // TODO search for a better solution
          const {
            data: { trainingSessionName, uuid: newTrainingSessionId },
          } = event as TrainingSessionFormDoneInvokeEvent;

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
