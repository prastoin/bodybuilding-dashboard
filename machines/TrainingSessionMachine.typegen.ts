// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "": { type: "" };
    "done.invoke.ExerciseCreationForm": {
      type: "done.invoke.ExerciseCreationForm";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions: never;
    services: never;
    guards: never;
    delays: never;
  };
  eventsCausingActions: {
    "Assign created exercise to context": "done.invoke.ExerciseCreationForm";
    "Forward training session deletion to program builder": "REMOVE_TRAINING_SESSION";
    "Navigate go back": "USER_FINISHED_TRAINING_SESSION_NAME_EDITION";
    "Navigate to exercise creation form name step": "USER_ENTERED_EXERCISE_CREATION_FORM";
    "Navigate to training session name editor": "USER_ENTERED_TRAINING_SESSION_NAME_EDITOR";
    "Reset program builder stack": "done.invoke.ExerciseCreationForm";
    "Spawn and assign initial exercises": "";
    "User added an exercise": "ADD_EXERCISE";
    "remove training session exercise from context": "_REMOVE_TRAINING_SESSION_EXERCISE";
    "update training session name": "USER_FINISHED_TRAINING_SESSION_NAME_EDITION";
  };
  eventsCausingServices: {};
  eventsCausingGuards: {
    "Initial Exercises has to been spawned": "";
  };
  eventsCausingDelays: {};
  matchesStates:
    | "Idle"
    | "Spawning initial exercises"
    | "User is creating an exercise"
    | "User is editing training session name";
  tags: never;
}
