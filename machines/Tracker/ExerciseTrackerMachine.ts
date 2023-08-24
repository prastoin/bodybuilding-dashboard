import { Exercise, ExerciseMetrics, ExerciseTracker, SessionTracker } from "@/types";
import invariant from "invariant";
import "react-native-get-random-values";
import {
    ActorRef,
    assign,
    createMachine,
    InterpreterFrom,
    State,
} from "xstate";
import { createExerciseFormMachine, ExerciseFormDoneInvokeEvent } from "../ExerciseFormMachine";

export type ExerciseTrackerMachineEvents =
    | {
        type: "USER_PICKED_SESSION"
    } | {
        type: "ADD_NEW_SET"
        exerciseId: string
    }

// To determine the next session to pick we should be looking for the latest SessionRecapId and take the following one
export type ExerciseTrackerMachineContext = ExerciseTracker

export type ExerciseTrackermMachineInterpreter = InterpreterFrom<
    ReturnType<typeof createExerciseTrackerMachine>
>;

type ExerciseTrackerMachineState = State<
    ExerciseTrackerMachineContext,
    ExerciseTrackerMachineEvents
>;

export type ExerciseTrackerActorRef = ActorRef<
    ExerciseTrackerMachineEvents,
    ExerciseTrackerMachineState
>;

interface CreateExerciseTrackerFormMachineArgs {
    exercise: ExerciseTracker
}
// TODO from Exercise to ExerciseTracker
export const createExerciseTrackerMachine = ({ exercise: { exerciseId, expectedMetrics, name, setList } }: CreateExerciseTrackerFormMachineArgs) =>
    /** @xstate-layout N4IgpgJg5mDOIC5QAUBOB7KqCGBbAQgK4CWANhGKgLLYDGAFsQHZgB0AkhKWAMQCCECAAIAKjmbMoQgMpxYxdE0SgADunkAXBUqQgAHogAsh1gDYArAA4AnAHYAjJYBMAZgAMpp7YA0IAJ6I9k7mrPa2hm5elpa2LjYuAL5JvkzoFPC6aJg4BCTklDQMzGyc3Mogapra5QYI1k6sroZOhqaWxkERTr4BCBGsbubW9m5u4aamYfbmySBZWHhEZBTUdIwsrCwA7kKwGtgaYEL25ZXEWoo1gW4m1obmLU71praTLj2ILi4NLhG2TjFHJZftYZglfPMckt8qsiixTupztVdLUnG4zFY7I5XB4vB8EABab6sYZOFqg1rmQykpJJIA */
    createMachine(
        {
            predictableActionArguments: true,
            schema: {
                context: {} as ExerciseTrackerMachineContext,
                events: {} as ExerciseTrackerMachineEvents,
            },
            tsTypes: {} as import("./ExerciseTrackerMachine.typegen").Typegen0,
            context: {
                exerciseId,
                expectedMetrics,
                name,
                setList
            },
            initial: "Idle",
            states: {
                "Idle": {

                },
                "User is adding new set": {
                    entry: "Navigate to tracker exercise creation form name step",

                    invoke: {
                        id: "TrackerExerciseForm",

                        src: (_context, event) => {
                            invariant(event.type === 'ADD_NEW_SET', "Should never occurs manual type checking");

                            // TODO NOT WORKING AS FOLLOWING SCREEN WILL TARGET THE EXERCISE FORM FROM PROGRAM MACHINE
                            const skipNameStep = true;
                            return createExerciseFormMachine(sessionId, skipNameStep, event.exerciseId);
                        },

                    },

                    onDone: {
                        target: "Idle",
                        actions: [
                            "Assign new set information",
                            "Navigate to tracker home page",
                        ],
                    },
                }
            },
        },
        {
            services: {
            },

            actions: {
                "Assign new set information": assign({
                    setList: (context, event) => {
                        const {
                            data: {
                                load,
                                rest,
                                repCounter,
                                setCounter
                            },
                        } = event as ExerciseFormDoneInvokeEvent;

                        return [
                            ...context.setList,
                            {
                                load,
                                rest,
                                repCounter,
                                setCounter
                            }]
                    },
                })
            },
        }
    );
