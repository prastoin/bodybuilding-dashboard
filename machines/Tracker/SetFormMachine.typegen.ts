
// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
    '@@xstate/typegen': true;
    internalEvents: {
        "": { type: "" };
        "xstate.init": { type: "xstate.init" };
    };
    invokeSrcNameMap: {

    };
    missingImplementations: {
        actions: never;
        delays: never;
        guards: never;
        services: never;
    };
    eventsCausingActions: {
        "Assign set update to context": "USER_UPDATED_FIELD";
        "Navigate to load form screen": "";
        "Navigate to rep and rir form screen": "USER_UPDATED_FIELD";
        "Navigate to rest form screen": "USER_UPDATED_FIELD";
        "Notify parent that user exited the form": "USER_WENT_TO_PREVIOUS_SCREEN";
    };
    eventsCausingDelays: {

    };
    eventsCausingGuards: {

    };
    eventsCausingServices: {

    };
    matchesStates: "Final" | "Idle" | "Idle.Assign handler" | "Idle.Navigation handler" | "Idle.Navigation handler.Idle" | "Idle.Navigation handler.Load step" | "Idle.Navigation handler.Rep and rir step" | "Idle.Navigation handler.Rest step" | { "Idle"?: "Assign handler" | "Navigation handler" | { "Navigation handler"?: "Idle" | "Load step" | "Rep and rir step" | "Rest step"; }; };
    tags: never;
}
