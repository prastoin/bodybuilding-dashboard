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
    "Navigate go back": "USER_FINISHED_TRAINING_SESSION_NAME_EDITION";
    "Navigate to training session name editor": "USER_ENTERED_TRAINING_SESSION_NAME_EDITOR";
    "User added an exercise": "ADD_EXERCISE";
    "remove training session exercise from context": "_REMOVE_TRAINING_SESSION_EXERCISE";
    "update training session name": "USER_FINISHED_TRAINING_SESSION_NAME_EDITION";
  };
  eventsCausingServices: {};
  eventsCausingGuards: {};
  eventsCausingDelays: {};
  matchesStates: "Idle" | "User is editing training session name";
  tags: never;
}
