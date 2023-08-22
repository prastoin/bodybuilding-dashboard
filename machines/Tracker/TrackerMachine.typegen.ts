
// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
    '@@xstate/typegen': true;
    internalEvents: {
        "done.invoke.TrackerFormMachine": { type: "done.invoke.TrackerFormMachine"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
        "xstate.init": { type: "xstate.init" };
    };
    invokeSrcNameMap: {

    };
    missingImplementations: {
        actions: "";
        delays: never;
        guards: never;
        services: never;
    };
    eventsCausingActions: {
        "": "done.invoke.TrackerFormMachine";
        "Navigate to session picker screen": "USER_CREATED_TRACKING_SESSION";
        "Navigate to session tracker recap screen": "USER_PICKED_SESSION";
    };
    eventsCausingDelays: {

    };
    eventsCausingGuards: {

    };
    eventsCausingServices: {
        "TrackerFormMachine": "USER_PICKED_SESSION";
    };
    matchesStates: "Enter session tracker form" | "Idle" | "Waiting for user to pick session";
    tags: never;
}
