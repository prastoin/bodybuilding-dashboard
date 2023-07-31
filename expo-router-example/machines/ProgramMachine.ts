import { Program, RetrieveUserProgramResponseBody } from '@/types';
import { router } from 'expo-router';
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import {
  assign,
  createMachine,
  DoneInvokeEvent,
  EventFrom,
  InterpreterFrom,
  spawn
} from "xstate";
import { sendRetrieveUserBodyBuildingProgram } from "../services/ProgramBuilderService";
import { createSessionFormMachine, SessionFormDoneInvokeEvent } from './SessionFormMachine';
import { createSessionMachine, SessionActorRef } from './SessionMachine';


export type ProgramMachineEvents = EventFrom<
  ReturnType<typeof createProgramMachine>
>;

export type ProgramMachineContext = Omit<
  Program,
  "trainingSessions"
> & {
  trainingSessionActorRefCollection: SessionActorRef[];
};

export type ProgramMachineInterpreter = InterpreterFrom<
  ReturnType<typeof createProgramMachine>
>;

export const createProgramMachine = () =>
  /** @xstate-layout N4IgpgJg5mDOIC5QAUBOB7KqCGBbAQgK4CWANhGKgLLYDGAFsQHZgB0AkhKWAMQCCECAAIAKjmbMoQgMpxYxdE0SgADunkAXBUqQgAHogAsh1gDYArAA4AnAHYAjJYBMAZgAMpp7YA0IAJ6I9k7mrPa2hm5elpa2LjYuAL5JvkzoFPC6aJg4BCTklDQMzGyc3Mogapra5QYI1k6sroZOhqaWxkERTr4BCBGsbubW9m5u4aamYfbmySBZWHhEZBTUdIwsrCwA7kKwGtgaYEL25ZXEWoo1gW4m1obmLU71praTLj2ILi4NLhG2TjFHJZftYZglfPMckt8qsiixTupztVdLUnG4zFY7I5XB4vB8EABab6sYZOFqg1rmQykpJJIA */
  createMachine(
    {
      predictableActionArguments: true,
      schema: {
        context: {} as ProgramMachineContext,
        events: {} as
          | {
            type: "ENTER_TRAINING_SESSION_CREATION_FORM";
          }
          | { type: "_REMOVE_TRAINING_SESSION"; trainingSessionId: string }
          | { type: "_CANCEL_TRAINING_SESSION_CREATION_FORM" },
      },
      tsTypes: {} as import("./ProgramMachine.typegen").Typegen0,
      context: {
        programName: "Program name",
        uuid: uuidv4(),
        trainingSessionActorRefCollection: [],
      },
      initial: "Fetching user bodybuilding program",
      states: {
        "Fetching user bodybuilding program": {
          invoke: {
            id: "Fetch user bodybuilding program service",
            src: "Fetch user bodybuilding program",
            onDone: {
              target: "Idle",
              actions: "assignMergeRetrievedUserProgram",
            },

            onError: {
              target: "Idle",
              actions: (_context, e) => {
                console.log(e);
                console.log("Fetch error on user bodybuilding program");
              },
            },
          },
        },

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
              return createSessionFormMachine();
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
            _CANCEL_TRAINING_SESSION_CREATION_FORM: {
              target: "Idle",
            },
          },
        },
      },
      id: "ProgramBuilderMachine",
    },
    {
      services: {
        "Fetch user bodybuilding program": async () => {
          return await sendRetrieveUserBodyBuildingProgram();
        },
      },

      actions: {
        assignMergeRetrievedUserProgram: assign((_context, e) => {
          const event =
            e as DoneInvokeEvent<RetrieveUserProgramResponseBody>;

          const {
            programName,
            trainingSessions: trainingSessionCollection,
            uuid,
          } = event.data;

          const trainingSessionActorRefCollection =
            trainingSessionCollection.map<SessionActorRef>(
              (trainingSession) =>
                spawn(
                  // TODO Refactor below function to spawn exercises
                  createSessionMachine({
                    trainingSessionName: trainingSession.trainingSessionName,
                    uuid: trainingSession.uuid,
                    exerciseCollection: trainingSession.exercises,
                  }),
                  { sync: true, name: trainingSession.uuid }
                )
            );

          return {
            programName,
            uuid,
            trainingSessionActorRefCollection,
          };
        }),

        navigateToTrainingSessionCreationForm: (_context, _event) => {
          // Note: imported imperative nagivation router is not typed ?
          router.push("/(tabs)/programBuilder/session/createName")
        },

        resetProgramBuilderStackNavigator: (_context, _event) => {
          // Note: imported imperative nagivation router is not typed ?
          router.push('/(tabs)/programBuilder')
        },

        addTrainingSessionToContext: assign((context, event) => {
          // TODO search for a better typing solution to avoid the `as TrainingSessionFormDoneInvokeEvent`
          const {
            data: { trainingSessionName, uuid: newTrainingSessionId },
          } = event as SessionFormDoneInvokeEvent;

          const newTrainingSessionActor: SessionActorRef = spawn(
            createSessionMachine({
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
