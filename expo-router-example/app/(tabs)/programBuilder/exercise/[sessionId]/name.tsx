import { ExerciseNameFormContent } from "@/components/ExerciseNameForm";
import { useExerciseCreationFormActor } from "@/hooks/useExerciseCreationFormActor";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View } from "react-native";

export default function CreateExerciseNameScreen() {
  const { sessionId } = useLocalSearchParams<"/(tabs)/programBuilder/exercise/[sessionId]/name">()
  const exerciseCreationFormActor = useExerciseCreationFormActor(
    sessionId
  );
  if (exerciseCreationFormActor === undefined) {
    return <View testID="exercise-creation-form-name-default" />;
  }

  const handleGoNext = (exerciseName: string) => {
    exerciseCreationFormActor.send({
      type: "SET_EXERCISE_NAME_AND_GO_NEXT",
      name: exerciseName,
    });
  };

  const handleGoBack = () => {
    exerciseCreationFormActor.send({
      type: "USER_WENT_TO_PREVIOUS_SCREEN",
    });
  };

  return (
    <ExerciseNameFormContent
      testId={`exercise-creation-form-name-${exerciseCreationFormActor.id}`}
      handleOnGoBack={handleGoBack}
      handleOnSubmit={({ exerciseName }) => {
        handleGoNext(exerciseName);
      }}
    />
  );
};