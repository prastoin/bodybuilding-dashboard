import { SetTracker } from "@/types";
import "react-native-get-random-values";
import {
    ActorRefFrom,
    assign,
    createMachine,
    DoneInvokeEvent,
    sendParent
} from "xstate";

type UserUpdatedFieldEvent = {
    type: "USER_UPDATED_FIELD",
    update: Partial<SetFormMachineContext>
}

export type SetFormMachineEvents =
    | { type: "USER_WENT_TO_PREVIOUS_SCREEN" }
    | UserUpdatedFieldEvent


export type SetFormMachineContext = Omit<SetTracker, "index">

export type SetFormActorRef = ActorRefFrom<
    typeof createSetFormMachine
>;

export type SetFormDoneInvokeEvent =
    DoneInvokeEvent<SetFormMachineContext>;

export const createSetFormMachine = () =>
    createMachine(
        {
            predictableActionArguments: true,
            schema: {
                context: {} as SetFormMachineContext,
                events: {} as SetFormMachineEvents,
            },
            tsTypes: {} as import("./SetFormMachine.typegen").Typegen0,
            context: {
                rep: 0,
                load: 0,
                rest: 0,
                rir: 0,
            },
            id: "SetForm",
            type: "parallel",
            states: {
                "Assign handler": {
                    on: {
                        USER_UPDATED_FIELD: { actions: "Assign update to context" }
                    }
                },

                "Navigation handler": {
                    initial: "Idle",
                    states: {
                        "Idle": {
                            always: {
                                actions: "Navigate to load form screen",
                                target: "Load step"
                            },
                        },

                        "Load step": {
                            on: {
                                "USER_UPDATED_FIELD": {
                                    actions: "Navigate to rep and rir form screen",
                                    target: "Rep and rir step"
                                },

                                "USER_WENT_TO_PREVIOUS_SCREEN": {
                                    actions: "Notify parent that user exited the form"
                                }
                            }
                        },

                        "Rep and rir step": {
                            on: {
                                "USER_UPDATED_FIELD": {
                                    target: "Rest step",
                                    actions: "Navigate to rest form screen",
                                },

                                "USER_WENT_TO_PREVIOUS_SCREEN": {
                                    target: "Load step"
                                }
                            }
                        },

                        "Rest step": {
                            on: {
                                "USER_UPDATED_FIELD": {
                                    target: "Final state",
                                },

                                "USER_WENT_TO_PREVIOUS_SCREEN": {
                                    target: "Load step"
                                }
                            }
                        },

                        "Final state": {
                            type: "final",

                            data: (context) => context,
                        }

                    }
                }
            },
        },
        {
            actions: {
                "Navigate to rep and rir form screen": (_context) => {
                    console.log("do stuff")
                },

                "Navigate to load form screen": (_context) => {
                    console.log("do stuff")
                },

                "Navigate to rest form screen": (_context) => {
                    console.log("do stuff")
                },

                "Notify parent that user exited the form": sendParent({
                    type: "_USER_CANCELLED_SET_CREATION_FORM",
                }),

                "Assign update to context": assign((context, { update }) => {
                    return {
                        ...context,
                        ...update
                    }
                })
            },
        }
    );
