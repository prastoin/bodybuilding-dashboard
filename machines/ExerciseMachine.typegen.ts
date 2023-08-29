
// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
    '@@xstate/typegen': true;
    internalEvents: {
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
        "Assign updated field to context": "USER_FINISHED_UPDATING_FIELD";
        "Forward exercise deletion to program builder": "REMOVE_EXERCISE";
        "Navigate go back": "USER_FINISHED_UPDATING_FIELD";
        "Navigate to load editor screen": "USER_ENTERED_LOAD_EDITOR";
        "Navigate to name editor screen": "USER_ENTERED_NAME_EDITION_OPERATION";
        "Navigate to rest editor screen": "USER_ENTERED_REST_EDITOR";
        "Navigate to set and rep editor screen": "USER_ENTERED_SET_AND_REP_EDITOR";
    };
    eventsCausingDelays: {

    };
    eventsCausingGuards: {

    };
    eventsCausingServices: {

    };
    matchesStates: "Idle" | "User is editing exercise name" | "User is editing load" | "User is editing rest" | "User is editing set and rep";
    tags: never;
}
