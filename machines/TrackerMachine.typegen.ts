
// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
    '@@xstate/typegen': true;
    internalEvents: {
        "done.invoke.ExerciseForm": { type: "done.invoke.ExerciseForm"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
        "xstate.init": { type: "xstate.init" };
    };
    invokeSrcNameMap: {

    };
    missingImplementations: {
        actions: "Assign" | "Reset program builder stack";
        delays: never;
        guards: never;
        services: never;
    };
    eventsCausingActions: {
        "Assign": "done.invoke.ExerciseForm";
        "Navigate to session picker screen": "USER_STARTED_TRACKING_SESSION";
        "Navigate to session tracker recap screen": "USER_PICKED_SESSION";
        "Reset program builder stack": "done.invoke.ExerciseForm";
    };
    eventsCausingDelays: {

    };
    eventsCausingGuards: {

    };
    eventsCausingServices: {
        "ExerciseForm": "USER_PICKED_SESSION";
    };
    matchesStates: "Enter session tracker form" | "Idle" | "Waiting for user to pick session";
    tags: never;
}
