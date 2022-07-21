// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  eventsCausingActions: {
    addTrainingSessionToContext: "ADD_TRAINING_SESSION";
  };
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
  eventsCausingServices: {};
  eventsCausingGuards: {};
  eventsCausingDelays: {
    ADD_TRAINING_SESSION_DELAY: "xstate.init";
  };
  matchesStates: "Idle" | "User is adding new training session";
  tags: never;
}
