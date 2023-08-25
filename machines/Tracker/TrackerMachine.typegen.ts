
// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
    '@@xstate/typegen': true;
    internalEvents: {
        "done.invoke.FetchUserSessionTracker": { type: "done.invoke.FetchUserSessionTracker"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
        "error.platform.FetchUserSessionTracker": { type: "error.platform.FetchUserSessionTracker"; data: unknown };
        "xstate.init": { type: "xstate.init" };
    };
    invokeSrcNameMap: {
        "Fetch user session tracker history": "done.invoke.FetchUserSessionTracker";
    };
    missingImplementations: {
        actions: never;
        delays: never;
        guards: never;
        services: never;
    };
    eventsCausingActions: {
        "Assign retrieved session tracker history": "done.invoke.FetchUserSessionTracker";
        "Navigate to latest session tracker screen": "USER_PICKED_SESSION";
        "Navigate to session picker screen": "USER_PRESSED_CREATE_TRACKING_SESSION";
        "Navigate to session tracker screen": "USER_PRESSED_EXISTING_TRACKING_SESSION";
        "Spawn and assign existing session tracker actor": "USER_PRESSED_EXISTING_TRACKING_SESSION";
        "Spawn and assign new session tracker actor": "USER_PICKED_SESSION";
    };
    eventsCausingDelays: {

    };
    eventsCausingGuards: {
        "Session tracker actor already exists": "USER_PRESSED_EXISTING_TRACKING_SESSION";
    };
    eventsCausingServices: {
        "Fetch user session tracker history": "xstate.init";
    };
    matchesStates: "Fetching user session tracker history" | "Idle" | "Waiting for user to pick session";
    tags: "loading";
}
