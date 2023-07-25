import { ExerciseFormRestContent } from "@/components/ExerciseRestForm";
import { useExerciseCreationFormActor } from "@/hooks/useExerciseCreationFormActor";
import { ExerciseRest } from "@/types";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View } from "react-native";

export default function CreateExerciseRestScreen() {
  const { sessionId } = useLocalSearchParams<"/(tabs)/programBuilder/exercise/[sessionId]/rest">()
  const exerciseCreationFormActor = useExerciseCreationFormActor(
    sessionId
  );

  if (exerciseCreationFormActor === undefined) {
    return <View testID="exercise-creation-form-rest-default" />;
  }

  const handleGoNext = (rest: ExerciseRest) => {
    exerciseCreationFormActor.send({
      type: "SET_EXERCISE_REST_AND_GO_NEXT",
      rest,
    });
  };

  const handleGoBack = () => {
    exerciseCreationFormActor.send({
      type: "USER_WENT_TO_PREVIOUS_SCREEN",
    });
  };

  return (
    <ExerciseFormRestContent
      testId={`exercise-creation-form-rest-${exerciseCreationFormActor.id}`}
      handleOnGoBack={handleGoBack}
      handleOnSubmit={handleGoNext}
    />
  );
};
