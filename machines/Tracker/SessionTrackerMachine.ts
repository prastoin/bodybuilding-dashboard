import { Exercise, ExerciseTracker, Session, SessionTracker } from "@/types";
import "react-native-get-random-values";
import {
    createMachine,
    InterpreterFrom,
    spawn,
} from "xstate";
import { createExerciseTrackerMachine, ExerciseTrackerActorRef } from "./ExerciseTrackerMachine";

export type TrackerFormMachineEvents =
    | {
        type: "USER_FINISHED_TRACKING_SESSION"
    } | {
        type: "USER_CHANGED_EXERCISE_ORDER",
        exerciseId: string,
        index: number
    }

// To determine the next session to pick we should be looking for the latest SessionRecapId and take the following one
export type TrackerFormMachineContext = Omit<SessionTracker, "exerciseTrackerList"> & {
    exerciseTrackerList: ExerciseTrackerActorRef[]
}

export type TrackermMachineInterpreter = InterpreterFrom<
    ReturnType<typeof createTrackerFormMachine>
>;

interface CreateTrackerFormMachineArgs {
    session: Session
    uuid: string
}

export const createTrackerFormMachine = ({ uuid, session: { name, exerciseList, uuid: sessionId } }: CreateTrackerFormMachineArgs) =>
    /** @xstate-layout N4IgpgJg5mDOIC5QAUBOB7KqCGBbAQgK4CWANhGKgLLYDGAFsQHZgB0AkhKWAMQCCECAAIAKjmbMoQgMpxYxdE0SgADunkAXBUqQgAHogAsh1gDYArAA4AnAHYAjJYBMAZgAMpp7YA0IAJ6I9k7mrPa2hm5elpa2LjYuAL5JvkzoFPC6aJg4BCTklDQMzGyc3Mogapra5QYI1k6sroZOhqaWxkERTr4BCBGsbubW9m5u4aamYfbmySBZWHhEZBTUdIwsrCwA7kKwGtgaYEL25ZXEWoo1gW4m1obmLU71praTLj2ILi4NLhG2TjFHJZftYZglfPMckt8qsiixTupztVdLUnG4zFY7I5XB4vB8EABab6sYZOFqg1rmQykpJJIA */
    createMachine(
        {
            predictableActionArguments: true,
            schema: {
                context: {} as TrackerFormMachineContext,
                events: {} as TrackerFormMachineEvents,
            },
            tsTypes: {} as import("./SessionTrackerMachine.typegen").Typegen0,
            context: {
                uuid,
                createdOn: Date.now(),
                name,
                sessionId,
                exerciseTrackerList: exerciseList.map((exercise) => {
                    const tmp: ExerciseTrackerActorRef = spawn(createExerciseTrackerMachine({
                        exercise
                    }))
                    return tmp
                })
            },
            initial: 'Idle',
            states: {
                "Idle": {
                    on: {
                        "USER_FINISHED_TRACKING_SESSION": {
                            target: "Final"
                        }
                    }
                },

                "Final": {
                    type: "final"
                }
            },
            id: "TrackerFormMachine",
        },
        {
            services: {
            },

            actions: {
            },
        }
    );
