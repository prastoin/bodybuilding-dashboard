
// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
    '@@xstate/typegen': true;
    internalEvents: {
        "xstate.init": { type: "xstate.init" };
    };
    invokeSrcNameMap: {

    };
    missingImplementations: {
        actions: "Navigate to tracker home page";
        delays: never;
        guards: never;
        services: never;
    };
    eventsCausingActions: {
        "Assign new set information": "done.state.(machine).User is adding new set";
        "Navigate to tracker home page": "done.state.(machine).User is adding new set";
    };
    eventsCausingDelays: {

    };
    eventsCausingGuards: {

    };
    eventsCausingServices: {
        "TrackerExerciseForm": never;
    };
    matchesStates: "Idle" | "User is adding new set";
    tags: never;
}
