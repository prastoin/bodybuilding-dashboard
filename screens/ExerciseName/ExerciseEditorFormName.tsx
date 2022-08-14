import React from "react";
import { View } from "react-native";
import { useExerciseActorRef } from "../../hooks/useExerciseActorRef";
import { ProgramBuilderExerciseEditorFormNameScreenProps } from "../../navigation/RootStack";
import { ExerciseNameFormContent } from "./ExerciseNameFormContent";

const ExerciseEditorFormName: React.FC<
  ProgramBuilderExerciseEditorFormNameScreenProps
> = ({ route }) => {
  const { exerciseId, trainingSessionId } = route.params;
  const exerciseActorRef = useExerciseActorRef({
    exerciseId,
    trainingSessionId,
  });

  if (exerciseActorRef === undefined) {
    return <View testID="exercise-editor-form-name-default" />;
  }

  const handleGoNext = (newExerciseName: string) => {
    exerciseActorRef.send({
      type: "USER_FINISHED_NAME_EDITION_OPERATION",
      newExerciseName,
    });
  };

  const handleGoBack = () => {
    exerciseActorRef.send({
      type: "USER_CANCELLED_NAME_EDITION_OPERATION",
    });
  };

  return (
    <ExerciseNameFormContent
      testId={`exercise-editor-form-name-${exerciseActorRef.id}`}
      handleOnGoBack={handleGoBack}
      handleOnSubmit={({ exerciseName }) => {
        handleGoNext(exerciseName);
      }}
    />
  );
};

export default ExerciseEditorFormName;
