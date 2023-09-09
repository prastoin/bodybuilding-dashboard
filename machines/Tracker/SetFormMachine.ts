import { SetTracker } from "@/types";
import { router } from "expo-router";
import "react-native-get-random-values";
import {
    ActorRefFrom,
    assign,
    createMachine,
    DoneInvokeEvent,
    sendParent
} from "xstate";

// TODO WAS WORKING ON Last redirection not WORKING
type UserUpdatedFieldEvent = {
    type: "USER_UPDATED_FIELD",
    update: Partial<SetFormMachineContext["set"]>
}

export type SetFormMachineEvents =
    | { type: "USER_WENT_TO_PREVIOUS_SCREEN" }
    | UserUpdatedFieldEvent


export type SetFormMachineContext = {
    set: Omit<SetTracker, "index">
    sessionTrackerId: string,
    exerciseId: string
}

export type SetFormActorRef = ActorRefFrom<
    typeof createSetFormMachine
>;

export type SetFormDoneInvokeEvent =
    DoneInvokeEvent<SetFormMachineContext["set"]>;

type CreateSetFormMachineArgs = Pick<SetFormMachineContext, "exerciseId" | "sessionTrackerId">
export const createSetFormMachine = ({ exerciseId, sessionTrackerId }: CreateSetFormMachineArgs) =>
    createMachine(
        {
            predictableActionArguments: true,
            schema: {
                context: {} as SetFormMachineContext,
                events: {} as SetFormMachineEvents,
            },
            tsTypes: {} as import("./SetFormMachine.typegen").Typegen0,
            context: {
                exerciseId,
                sessionTrackerId,
                set: {
                    rep: 0,
                    load: 0,
                    rest: 0,
                    rir: 0,
                }
            },
            id: "machine",
            initial: "Idle",
            states: {
                "Idle": {
                    always: {
                        actions: "Navigate to load form screen",
                        target: "Form handler"
                    },
                },

                "Form handler": {
                    type: "parallel",
                    states: {
                        "Assign handler": {
                            on: {
                                "USER_UPDATED_FIELD": {
                                    actions: "Assign set update to context"
                                }
                            }
                        },

                        "Navigation handler": {
                            initial: "Load step",
                            states: {
                                "Load step": {
                                    on: {
                                        "USER_UPDATED_FIELD": {
                                            actions: "Navigate to rep form screen",
                                            target: "Rep step"
                                        },

                                        "USER_WENT_TO_PREVIOUS_SCREEN": {
                                            actions: "Notify parent that user exited the form"
                                        }
                                    }
                                },

                                "Rep step": {
                                    on: {
                                        "USER_UPDATED_FIELD": {
                                            actions: "Navigate to rir form screen",
                                            target: "Rir step",
                                        },

                                        "USER_WENT_TO_PREVIOUS_SCREEN": {
                                            target: "Load step"
                                        }
                                    }
                                },

                                "Rir step": {
                                    on: {
                                        "USER_UPDATED_FIELD": {
                                            actions: "Navigate to rest form screen",
                                            target: "Rest step"
                                        },

                                        "USER_WENT_TO_PREVIOUS_SCREEN": {
                                            target: "Rep step"
                                        }
                                    }
                                },

                                "Rest step": {
                                    on: {
                                        "USER_UPDATED_FIELD": {
                                            target: "#machine.Final",
                                        },

                                        "USER_WENT_TO_PREVIOUS_SCREEN": {
                                            target: "Rir step"
                                        }
                                    }
                                },

                            }
                        }
                    }
                },

                Final: {
                    type: "final",

                    data: (context) => {
                        console.log("onDone data");
                        return context.set
                    },
                }
            },
        },
        {
            actions: {
                "Navigate to rir form screen": ({ exerciseId, sessionTrackerId }) => {
                    router.push({
                        pathname: "/(tabs)/tracker/[sessionTrackerId]/[exerciseId]/rir",
                        params: {
                            exerciseId,
                            sessionTrackerId
                        }

                    })
                },

                "Navigate to rep form screen": ({ exerciseId, sessionTrackerId }) => {
                    router.push({
                        pathname: "/(tabs)/tracker/[sessionTrackerId]/[exerciseId]/rep",
                        params: {
                            exerciseId,
                            sessionTrackerId
                        }

                    })
                },

                "Navigate to load form screen": ({ exerciseId, sessionTrackerId }) => {
                    router.push({
                        pathname: "/(tabs)/tracker/[sessionTrackerId]/[exerciseId]/load",
                        params: {
                            exerciseId,
                            sessionTrackerId
                        }

                    })
                },

                "Navigate to rest form screen": ({ exerciseId, sessionTrackerId }) => {
                    router.push({
                        pathname: "/(tabs)/tracker/[sessionTrackerId]/[exerciseId]/rest",
                        params: {
                            exerciseId,
                            sessionTrackerId
                        }

                    })
                },

                "Notify parent that user exited the form": sendParent({
                    type: "_USER_CANCELLED_SET_CREATION_FORM",
                }),

                "Assign set update to context": assign({
                    set: ({ set }, { update }) => {
                        console.log("Received assign", { update })
                        return {
                            ...set,
                            ...update
                        }
                    }
                })
            },
        }
    );
