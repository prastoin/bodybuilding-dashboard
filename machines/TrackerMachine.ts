import { Session, SessionTracker } from "@/types";
import invariant from "invariant";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid"
import {
    createMachine,
    InterpreterFrom,
} from "xstate";
import { createTrackerFormMachine } from "./TrackerFormMachine";

export type TrackerMachineEvents =
    | {
        type: "USER_STARTED_TRACKING_SESSION";
    } | {
        type: "USER_PICKED_SESSION";
        session: Session
    }

// To determine the next session to pick we should be looking for the latest SessionRecapId and take the following one
export type TrackerMachineContext = {
    sessionRecapList: SessionTracker[]
}

export type TrackermMachineInterpreter = InterpreterFrom<
    ReturnType<typeof createTrackerMachine>
>;

export const createTrackerMachine = () =>
    /** @xstate-layout N4IgpgJg5mDOIC5QAUBOB7KqCGBbAQgK4CWANhGKgLLYDGAFsQHZgB0AkhKWAMQCCECAAIAKjmbMoQgMpxYxdE0SgADunkAXBUqQgAHogAsh1gDYArAA4AnAHYAjJYBMAZgAMpp7YA0IAJ6I9k7mrPa2hm5elpa2LjYuAL5JvkzoFPC6aJg4BCTklDQMzGyc3Mogapra5QYI1k6sroZOhqaWxkERTr4BCBGsbubW9m5u4aamYfbmySBZWHhEZBTUdIwsrCwA7kKwGtgaYEL25ZXEWoo1gW4m1obmLU71praTLj2ILi4NLhG2TjFHJZftYZglfPMckt8qsiixTupztVdLUnG4zFY7I5XB4vB8EABab6sYZOFqg1rmQykpJJIA */
    createMachine(
        {
            predictableActionArguments: true,
            schema: {
                context: {} as TrackerMachineContext,
                events: {} as TrackerMachineEvents,
            },
            tsTypes: {} as import("./TrackerMachine.typegen").Typegen0,
            context: {
                sessionRecapList: []
            },
            initial: "Idle",
            states: {
                "Idle": {
                    on: {
                        USER_STARTED_TRACKING_SESSION: {
                            target: "Waiting for user to pick session"
                        }
                    }
                },

                "Waiting for user to pick session": {
                    entry: "Navigate to session picker screen",

                    on: {
                        "USER_PICKED_SESSION": {
                            target: "Enter session tracker form"
                        }
                    }
                },

                "Enter session tracker form": {
                    entry: "Navigate to session tracker recap screen",
                    invoke: {
                        id: "ExerciseForm",

                        src: (_context, event) => {
                            invariant(event.type === 'USER_PICKED_SESSION', "Should never occurs manual type checking");

                            return createTrackerFormMachine({
                                uuid: uuidv4(),
                                session: event.session
                            });
                        },

                        onDone: {
                            target: "Idle",
                            actions: [
                                "Assign",
                                "Reset program builder stack",
                            ],
                        },
                    }
                }
            },
            id: "TrackerMachine",
        },
        {
            services: {
            },

            actions: {
                "Navigate to session picker screen": (_context) => console.log("do stuff"),
                "Navigate to session tracker recap screen": (_context) => console.log("do stuff 2")
            },
        }
    );
