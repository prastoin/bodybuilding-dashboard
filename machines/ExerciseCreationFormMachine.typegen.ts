// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
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
    "Notify parent that user exited the form": "USER_WENT_TO_PREVIOUS_SCREEN";
    assignTrainingSessionNameToContext: "SET_EXERCISE_NAME_AND_GO_NEXT";
  };
  eventsCausingServices: {};
  eventsCausingGuards: {};
  eventsCausingDelays: {};
  matchesStates: "Form is completed" | "Training session name step";
  tags: never;
}
