import React from "react";
import { View } from "react-native";
import { useExerciseActorRef } from "../../hooks/useExerciseActorRef";
import { ProgramBuilderExerciseEditorFormNameScreenProps } from "../../navigation/RootStack";
import { ExerciseNameFormContent } from "./ExerciseNameFormContent";

const ExerciseEditorFormName: React.FC<
  ProgramBuilderExerciseEditorFormNameScreenProps
> = ({ route }) => {
  const { exerciseId, trainingSessionId } = route.params;
  const trainingSessionActorRef = useExerciseActorRef({
    exerciseId,
    trainingSessionId,
  });

  if (trainingSessionActorRef === undefined) {
    return <View testID="training-session-editor-form-name-default" />;
  }

  const handleGoNext = (newExerciseName: string) => {
    trainingSessionActorRef.send({
      type: "USER_FINISHED_NAME_EDITION_OPERATION",
      newExerciseName,
    });
  };

  const handleGoBack = () => {
    trainingSessionActorRef.send({
      type: "USER_CANCELLED_NAME_EDITION_OPERATION",
    });
  };

  return (
    <ExerciseNameFormContent
      testId={`exercise-editor-form-name-${trainingSessionActorRef.id}`}
      handleOnGoBack={handleGoBack}
      handleOnSubmit={({ exerciseName }) => {
        handleGoNext(exerciseName);
      }}
    />
  );
};

export default ExerciseEditorFormName;
