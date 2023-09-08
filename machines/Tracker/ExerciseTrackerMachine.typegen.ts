
// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
    '@@xstate/typegen': true;
    internalEvents: {
        "done.invoke.SetFormMachine": { type: "done.invoke.SetFormMachine"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
        "xstate.init": { type: "xstate.init" };
    };
    invokeSrcNameMap: {

    };
    missingImplementations: {
        actions: "Navigate to tracker exercise creation form name step";
        delays: never;
        guards: never;
        services: never;
    };
    eventsCausingActions: {
        "Assign new set information": "done.invoke.SetFormMachine";
        "Navigate to exercise tracker review": "done.invoke.SetFormMachine";
        "Navigate to tracker exercise creation form name step": "ADD_NEW_SET";
    };
    eventsCausingDelays: {

    };
    eventsCausingGuards: {

    };
    eventsCausingServices: {
        "SetFormMachine": "ADD_NEW_SET";
    };
    matchesStates: "Idle" | "User is adding new set";
    tags: never;
}
