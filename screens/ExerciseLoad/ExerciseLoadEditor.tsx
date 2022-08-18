import { useSelector } from "@xstate/react";
import React from "react";
import { View } from "react-native";
import { useExerciseActorRef } from "../../hooks/useExerciseActorRef";
import { ProgramBuilderExerciseEditorFormNameScreenProps } from "../../navigation/RootStack";
import { ExerciseLoad } from "../../types";
import { ExerciseFormLoadContent } from "./ExerciseLoadFormContent";

const ExerciseLoadEditor: React.FC<
  ProgramBuilderExerciseEditorFormNameScreenProps
> = ({ route }) => {
  const { exerciseId, trainingSessionId } = route.params;
  const exerciseActorRef = useExerciseActorRef({
    exerciseId,
    trainingSessionId,
  });

  if (exerciseActorRef === undefined) {
    return <View testID="exercise-editor-form-load-default" />;
  }

  const handleGoNext = (load: ExerciseLoad) => {
    exerciseActorRef.send({
      type: "USER_FINISHED_LOAD_EDITION",
      load,
    });
  };

  const handleGoBack = () => {
    exerciseActorRef.send({
      type: "USER_CANCELLED_LOAD_EDITION",
    });
  };

  const defaultLoad = useSelector(
    exerciseActorRef,
    (state) => state.context.load
  );

  return (
    <ExerciseFormLoadContent
      testId={`exercise-editor-form-load-${exerciseActorRef.id}`}
      handleOnGoBack={handleGoBack}
      defaultLoad={defaultLoad}
      handleOnSubmit={handleGoNext}
    />
  );
};

export default ExerciseLoadEditor;
