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
    "Forward training session deletion to program builder": "REMOVE_TRAINING_SESSION";
    "User added an exercise": "ADD_EXERCISE";
    "remove training session exercise from context": "_REMOVE_TRAINING_SESSION_EXERCISE";
  };
  eventsCausingServices: {};
  eventsCausingGuards: {};
  eventsCausingDelays: {};
  matchesStates: "Idle";
  tags: never;
}
