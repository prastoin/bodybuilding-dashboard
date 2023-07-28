
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
        "Assign new exercise name to context": "USER_FINISHED_NAME_EDITION_OPERATION";
        "Assign new load to context": "USER_FINISHED_LOAD_EDITION";
        "Assign new rest to context": "USER_FINISHED_REST_EDITION";
        "Assign new set and rep to context": "USER_FINISHED_SET_AND_REP_EDITION";
        "Forward exercise deletion to program builder": "REMOVE_EXERCISE";
        "Navigate go back": "USER_FINISHED_LOAD_EDITION" | "USER_FINISHED_NAME_EDITION_OPERATION" | "USER_FINISHED_REST_EDITION" | "USER_FINISHED_SET_AND_REP_EDITION";
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
