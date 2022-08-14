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
    "Assign new exercise name to context": "USER_FINISHED_NAME_EDITION_OPERATION";
    "Forward exercise deletion to program builder": "REMOVE_EXERCISE";
    "Navigate go back": "USER_FINISHED_NAME_EDITION_OPERATION";
    "Navigate to name editor screen": "USER_ENTERED_NAME_EDITION_OPERATION";
    "User added a tracker section": "ADD_TRACKER_SECTION";
  };
  eventsCausingServices: {};
  eventsCausingGuards: {};
  eventsCausingDelays: {};
  matchesStates: "Idle" | "User is editing exercise name";
  tags: never;
}
