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
    "Assign new set and rep to context": "USER_FINISHED_SET_AND_REP_EDITION";
    "Forward exercise deletion to program builder": "REMOVE_EXERCISE";
    "Navigate go back":
      | "USER_FINISHED_NAME_EDITION_OPERATION"
      | "USER_FINISHED_SET_AND_REP_EDITION";
    "Navigate to name editor screen": "USER_ENTERED_NAME_EDITION_OPERATION";
    "Navigate to set and rep editor screen": "USER_ENTERED_SET_AND_REP_EDITOR";
    "User added a tracker section": "ADD_TRACKER_SECTION";
  };
  eventsCausingServices: {};
  eventsCausingGuards: {};
  eventsCausingDelays: {};
  matchesStates:
    | "Idle"
    | "User is editing exercise name"
    | "User is editing set and rep";
  tags: never;
}
