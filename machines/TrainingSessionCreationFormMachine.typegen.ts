// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions: "popBackToTop";
    services: never;
    guards: never;
    delays: never;
  };
  eventsCausingActions: {
    NotifyParentToCancelTrainingSessionOperation: "GO_BACK";
    assignTrainingSessionNameToContext: "SET_ROOM_NAME_AND_GO_NEXT";
    popBackToTop: "SET_ROOM_NAME_AND_GO_NEXT";
  };
  eventsCausingServices: {};
  eventsCausingGuards: {};
  eventsCausingDelays: {};
  matchesStates: "Form is completed" | "Training session name step";
  tags: never;
}
