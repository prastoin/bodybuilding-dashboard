
// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
    '@@xstate/typegen': true;
    internalEvents: {
        "done.invoke.Fetch user bodybuilding program service": { type: "done.invoke.Fetch user bodybuilding program service"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
        "done.invoke.SessionForm": { type: "done.invoke.SessionForm"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
        "error.platform.Fetch user bodybuilding program service": { type: "error.platform.Fetch user bodybuilding program service"; data: unknown };
        "xstate.init": { type: "xstate.init" };
    };
    invokeSrcNameMap: {
        "Fetch user bodybuilding program": "done.invoke.Fetch user bodybuilding program service";
    };
    missingImplementations: {
        actions: never;
        delays: never;
        guards: never;
        services: never;
    };
    eventsCausingActions: {
        "addSessionToContext": "done.invoke.SessionForm";
        "assignMergeRetrievedUserProgram": "done.invoke.Fetch user bodybuilding program service";
        "navigateToSessionForm": "ENTER_SESSION_FORM";
        "removeSessionFromContext": "_REMOVE_SESSION";
        "resetProgramStackNavigator": "done.invoke.SessionForm";
    };
    eventsCausingDelays: {

    };
    eventsCausingGuards: {

    };
    eventsCausingServices: {
        "Fetch user bodybuilding program": "xstate.init";
        "SessionForm": "ENTER_SESSION_FORM";
    };
    matchesStates: "Creating a session" | "Fetching user bodybuilding program" | "Idle";
    tags: never;
}
