import { ExerciseFormRestContent } from "@/components/ExerciseRestForm";
import { useExerciseFormActor } from "@/hooks/useExerciseFormActor";
import { ExerciseRest } from "@/types";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View } from "react-native";

export default function CreateExerciseRestScreen() {
  const { sessionId } = useLocalSearchParams<"/(tabs)/program/exercise/[sessionId]/rest">()
  const exerciseFormActor = useExerciseFormActor(
    sessionId
  );

  if (exerciseFormActor === undefined) {
    return <View testID="exercise-creation-form-rest-default" />;
  }

  const handleGoNext = (rest: ExerciseRest) => {
    exerciseFormActor.send({
      type: "SET_EXERCISE_REST_AND_GO_NEXT",
      rest,
    });
  };

  const handleGoBack = () => {
    exerciseFormActor.send({
      type: "USER_WENT_TO_PREVIOUS_SCREEN",
    });
  };

  return (
    <ExerciseFormRestContent
      testId={`exercise-creation-form-rest-${exerciseFormActor.id}`}
      handleOnGoBack={handleGoBack}
      handleOnSubmit={handleGoNext}
    />
  );
};
