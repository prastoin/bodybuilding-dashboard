
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
        "Navigate to rep form screen": "USER_UPDATED_FIELD";
        "Navigate to rest form screen": "USER_UPDATED_FIELD";
        "Navigate to rir form screen": "USER_UPDATED_FIELD";
        "Notify parent that user exited the form": "USER_WENT_TO_PREVIOUS_SCREEN";
    };
    eventsCausingDelays: {

    };
    eventsCausingGuards: {

    };
    eventsCausingServices: {

    };
    matchesStates: "Final" | "Idle" | "Load step" | "Rep step" | "Rest step" | "Rir step";
    tags: never;
}
