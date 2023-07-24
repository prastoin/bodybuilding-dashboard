
  // This file was automatically generated. Edits will be overwritten

  export interface Typegen0 {
        '@@xstate/typegen': true;
        internalEvents: {
          "done.invoke.Fetch user bodybuilding program service": { type: "done.invoke.Fetch user bodybuilding program service"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"done.invoke.TrainingSessionCreationForm": { type: "done.invoke.TrainingSessionCreationForm"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"error.platform.Fetch user bodybuilding program service": { type: "error.platform.Fetch user bodybuilding program service"; data: unknown };
"xstate.init": { type: "xstate.init" };
        };
        invokeSrcNameMap: {
          "Fetch user bodybuilding program": "done.invoke.Fetch user bodybuilding program service";
        };
        missingImplementations: {
          actions: never;
          delays: never;
          guards: never;
          services: never;
        };
        eventsCausingActions: {
          "addTrainingSessionToContext": "done.invoke.TrainingSessionCreationForm";
"assignMergeRetrievedUserProgram": "done.invoke.Fetch user bodybuilding program service";
"navigateToTrainingSessionCreationForm": "ENTER_TRAINING_SESSION_CREATION_FORM";
"removeTrainingSessionToContext": "_REMOVE_TRAINING_SESSION";
"resetProgramBuilderStackNavigator": "done.invoke.TrainingSessionCreationForm";
        };
        eventsCausingDelays: {
          
        };
        eventsCausingGuards: {
          
        };
        eventsCausingServices: {
          "Fetch user bodybuilding program": "xstate.init";
"TrainingSessionCreationForm": "ENTER_TRAINING_SESSION_CREATION_FORM";
        };
        matchesStates: "Creating a training session" | "Fetching user bodybuilding program" | "Idle";
        tags: never;
      }
  