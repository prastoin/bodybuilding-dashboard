
  // This file was automatically generated. Edits will be overwritten

  export interface Typegen0 {
        '@@xstate/typegen': true;
        internalEvents: {
          "": { type: "" };
"xstate.init": { type: "xstate.init" };
        };
        invokeSrcNameMap: {
          
        };
        missingImplementations: {
          actions: never;
          delays: never;
          guards: never;
          services: never;
        };
        eventsCausingActions: {
          "Forward training session deletion to program builder": "REMOVE_TRAINING_SESSION";
"Navigate go back": "USER_FINISHED_TRAINING_SESSION_NAME_EDITION";
"Navigate to exercise creation form name step": "USER_ENTERED_EXERCISE_CREATION_FORM";
"Navigate to training session name editor": "USER_ENTERED_TRAINING_SESSION_NAME_EDITOR";
"Spawn and assign initial exercises": "";
"remove training session exercise from context": "_REMOVE_TRAINING_SESSION_EXERCISE";
"update training session name": "USER_FINISHED_TRAINING_SESSION_NAME_EDITION";
        };
        eventsCausingDelays: {
          
        };
        eventsCausingGuards: {
          "Initial Exercises has to been spawned": "";
        };
        eventsCausingServices: {
          
        };
        matchesStates: "Idle" | "Spawning initial exercises" | "User is creating an exercise" | "User is editing training session name";
        tags: never;
      }
  