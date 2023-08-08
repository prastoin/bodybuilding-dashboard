
// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
    '@@xstate/typegen': true;
    internalEvents: {
        "": { type: "" };
        "done.invoke.ExerciseForm": { type: "done.invoke.ExerciseForm"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
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
        "Assign created exercise to context": "done.invoke.ExerciseForm";
        "Forward session deletion to program builder": "REMOVE_SESSION";
        "Navigate go back": "USER_FINISHED_SESSION_NAME_EDITION";
        "Navigate to exercise creation form name step": "USER_ENTERED_EXERCISE_CREATION_FORM";
        "Navigate to session name editor": "USER_ENTERED_SESSION_NAME_EDITOR";
        "Reset program builder stack": "done.invoke.ExerciseForm";
        "Spawn and assign initial exercises": "";
        "remove session exercise from context": "_REMOVE_SESSION_EXERCISE";
        "update session name": "USER_FINISHED_SESSION_NAME_EDITION";
    };
    eventsCausingDelays: {

    };
    eventsCausingGuards: {
        "Initial Exercises has to been spawned": "";
    };
    eventsCausingServices: {
        "ExerciseForm": "USER_ENTERED_EXERCISE_CREATION_FORM";
    };
    matchesStates: "Idle" | "Spawning initial exercises" | "User is creating an exercise" | "User is editing session name";
    tags: never;
}
