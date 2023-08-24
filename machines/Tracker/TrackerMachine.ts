import { retrieveUserSessionTrackerHistory } from "@/services/ProgramBuilderService";
import { RetrieveUserSessionTrackerHistory, Session, SessionTracker } from "@/types";
import invariant from "invariant";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid"
import {
    assign,
    createMachine,
    DoneInvokeEvent,
    InterpreterFrom,
    spawn,
} from "xstate";
import { createSessionTrackerMachine, SessionTrackerActorRef } from "./SessionTrackerMachine";
import { fromExerciseListToExerciseTracker } from "./utils";

export type TrackerMachineEvents =
    | {
        type: "USER_PRESSED_CREATE_TRACKING_SESSION";
    } | {
        type: "USER_PICKED_SESSION";
        session: Session
    } | {
        type: "USER_PRESSED_EXISTING_TRACKING_SESSION",
        sessionTrackerId: string
    }

// To determine the next session to pick we should be looking for the latest SessionRecapId and take the following one
export type TrackerMachineContext = {
    sessionTrackerList: SessionTracker[],
    // Once the user clicked on an session tracker instance we spawn the actor not before.
    // For lets say if he wanna edit it or just review it
    sessionTrackerActorRef: SessionTrackerActorRef[]
}

export type TrackerMachineInterpreter = InterpreterFrom<
    ReturnType<typeof createTrackerMachine>
>;

export const createTrackerMachine = () =>
    /** @xstate-layout N4IgpgJg5mDOIC5QAUBOB7KqCGBbAQgK4CWANhGKgLLYDGAFsQHZgB0AkhKWAMQCCECAAIAKjmbMoQgMpxYxdE0SgADunkAXBUqQgAHogAsh1gDYArAA4AnAHYAjJYBMAZgAMpp7YA0IAJ6I9k7mrPa2hm5elpa2LjYuAL5JvkzoFPC6aJg4BCTklDQMzGyc3Mogapra5QYI1k6sroZOhqaWxkERTr4BCBGsbubW9m5u4aamYfbmySBZWHhEZBTUdIwsrCwA7kKwGtgaYEL25ZXEWoo1gW4m1obmLU71praTLj2ILi4NLhG2TjFHJZftYZglfPMckt8qsiixTupztVdLUnG4zFY7I5XB4vB8EABab6sYZOFqg1rmQykpJJIA */
    createMachine(
        {
            preserveActionOrder: true,
            predictableActionArguments: true,
            schema: {
                context: {} as TrackerMachineContext,
                events: {} as TrackerMachineEvents,
            },
            tsTypes: {} as import("./TrackerMachine.typegen").Typegen0,
            context: {
                sessionTrackerList: [],
                sessionTrackerActorRef: [],
            },
            initial: "Idle",
            states: {
                "Fetching user session tracker history": {
                    tags: "loading",
                    invoke: {
                        id: "FetchUserSessionTracker",
                        src: "Fetch user session tracker history",
                        onDone: {
                            target: "Idle",
                            actions: "Assign retrieved session tracker history",
                        },

                        onError: {
                            // TODO Handle with modal
                            target: "Idle",
                            actions: (_context, e) => {
                                console.log(e);
                                console.log("Fetch error on user bodybuilding program");
                            },
                        },
                    },
                },

                "Idle": {
                    on: {
                        "USER_PRESSED_CREATE_TRACKING_SESSION": {
                            target: "Waiting for user to pick session"
                        },

                        "USER_PRESSED_EXISTING_TRACKING_SESSION": [
                            {
                                cond: "Session tracker actor already exists",
                                actions: "Navigate to session tracker screen",
                                target: "Idle"
                            },
                            {
                                actions: [
                                    "Spawn and assign existing session tracker actor",
                                    "Navigate to session tracker screen"
                                ],
                                target: "Idle"
                            }
                        ]
                    }
                },

                "Waiting for user to pick session": {
                    entry: "Navigate to session picker screen",

                    on: {
                        "USER_PICKED_SESSION": {
                            target: "Idle",
                            actions: [
                                "Spawn and assign new session tracker actor",
                                "Navigate to session tracker screen"
                            ]
                        }
                    }
                },

            },
        },
        {
            guards: {
                "Session tracker actor already exists": (context, { sessionTrackerId }) => context.sessionTrackerActorRef.find(actor => actor.id === sessionTrackerId) !== undefined
            },

            services: {
                "Fetch user session tracker history": async () => {
                    return await retrieveUserSessionTrackerHistory();
                },
            },

            actions: {
                "Navigate to session picker screen": (_context) => console.log("do stuff"),

                "Navigate to session tracker screen": (_context) => console.log("do stuff 2"),

                "Assign retrieved session tracker history": assign({
                    sessionTrackerList: (_context, e) => {
                        const { data: sessionTrackerList } =
                            e as DoneInvokeEvent<RetrieveUserSessionTrackerHistory>;
                        return sessionTrackerList
                    }
                }),

                "Spawn and assign new session tracker actor": assign({
                    sessionTrackerActorRef: ({ sessionTrackerActorRef }, event) => {
                        const { session: { name, uuid: sessionId, exerciseList } } = event
                        const sessionTrackerId = uuidv4();
                        const sessionTracker: SessionTracker = {
                            createdOn: Date.now(),
                            exerciseTrackerList: fromExerciseListToExerciseTracker(exerciseList),
                            name,
                            sessionId,
                            uuid: sessionTrackerId
                        };

                        const newSessionTrackerActor = spawn(createSessionTrackerMachine({
                            sessionTracker
                        }), {
                            sync: true,
                            name: sessionTrackerId
                        })

                        return [...sessionTrackerActorRef, newSessionTrackerActor]
                    }
                }),

                "Spawn and assign existing session tracker actor": assign({
                    sessionTrackerActorRef: (context, event) => {
                        const { sessionTrackerId } = event
                        const sessionTracker = context.sessionTrackerList.find((sessionTracker) => sessionTracker.uuid === sessionTrackerId)

                        invariant(sessionTracker !== undefined, "Could not retrieve existing session tracker from context should never occurs");

                        const newActor: SessionTrackerActorRef = spawn(createSessionTrackerMachine({
                            sessionTracker
                        }))
                        return [
                            ...context.sessionTrackerActorRef,
                            newActor
                        ]
                    }
                })
            },
        }
    );
