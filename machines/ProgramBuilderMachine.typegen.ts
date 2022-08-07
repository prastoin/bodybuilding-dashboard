// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "done.invoke.TrainingSessionCreationForm": {
      type: "done.invoke.TrainingSessionCreationForm";
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
    addTrainingSessionToContext: "done.invoke.TrainingSessionCreationForm";
    navigateToTrainingSessionCreationForm: "ENTER_TRAINING_SESSION_CREATION_FORM";
    removeTrainingSessionToContext: "_REMOVE_TRAINING_SESSION";
    resetProgramBuilderStackNavigator: "done.invoke.TrainingSessionCreationForm";
  };
  eventsCausingServices: {};
  eventsCausingGuards: {};
  eventsCausingDelays: {};
  matchesStates: "Creating a training session" | "Idle";
  tags: never;
}
