import { sendRetrieveUserBodyBuildingProgram } from '@/services/ProgramBuilderService';
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
import { createSessionFormMachine, SessionFormDoneInvokeEvent } from './SessionFormMachine';
import { createSessionMachine, SessionActorRef } from './SessionMachine';

export type ProgramMachineEvents = EventFrom<
  ReturnType<typeof createProgramMachine>
>;

export type ProgramMachineContext = Omit<
  Program,
  "sessionList"
> & {
  sessionActorRefList: SessionActorRef[];
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
            type: "ENTER_SESSION_FORM";
          }
          | { type: "_REMOVE_SESSION"; sessionId: string }
          | { type: "_CANCEL_SESSION_FORM" },
      },
      tsTypes: {} as import("./ProgramMachine.typegen").Typegen0,
      context: {
        name: "Program name",
        uuid: uuidv4(),
        sessionActorRefList: [],
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
            ENTER_SESSION_FORM: {
              target: "Creating a session",
            },
            _REMOVE_SESSION: {
              actions: "removeSessionFromContext",
            },
          },
        },

        "Creating a session": {
          entry: "navigateToSessionForm",

          invoke: {
            id: "SessionForm",

            src: () => {
              return createSessionFormMachine();
            },

            onDone: {
              target: "Idle",
              actions: [
                "addSessionToContext",
                "resetProgramStackNavigator",
              ],
            },
          },

          on: {
            _CANCEL_SESSION_FORM: {
              target: "Idle",
            },
          },
        },
      },
      id: "ProgramMachine",
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
            name,
            sessionList,
            uuid,
          } = event.data;

          const sessionActorRefList =
            sessionList.map<SessionActorRef>(
              (session) =>
                spawn(
                  // TODO Refactor below function to spawn exercises
                  createSessionMachine(session),
                  { sync: true, name: session.uuid }
                )
            );

          return {
            name,
            uuid,
            sessionActorRefList,
          };
        }),

        navigateToSessionForm: (_context, _event) => {
          // Note: imported imperative nagivation router is not typed ?
          router.push("/(tabs)/program/session/createName")
        },

        resetProgramStackNavigator: (_context, _event) => {
          // Note: imported imperative nagivation router is not typed ?
          router.push('/(tabs)/program')
        },

        addSessionToContext: assign({
          sessionActorRefList: (context, event) => {
            const {
              data: { name, uuid: sessionId },
            } = event as SessionFormDoneInvokeEvent;

            const newSessionActor: SessionActorRef = spawn(
              createSessionMachine({
                name,
                uuid: sessionId,
              }),
              { sync: true, name: sessionId }
            );

            return [
              ...context.sessionActorRefList,
              newSessionActor,
            ]
          }
        }),

        removeSessionFromContext: assign({
          sessionActorRefList: (context, { sessionId }) =>
            context.sessionActorRefList.filter((actor) => {
              const currentActorNeedToBeRemoved =
                actor.id === sessionId;

              if (currentActorNeedToBeRemoved) {
                if (actor.stop) {
                  actor.stop();
                }

                return false;
              }

              return true;
            })
        }),
      },
    }
  );
