import { ExerciseFormLoadContent } from "@/components/ExerciseLoadForm";
import { useExerciseFormActor } from "@/hooks/useExerciseFormActor";
import { Kilograms } from "@/types";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View } from "react-native";

export default function CreateExerciseLoadScreen() {
  const { sessionId } = useLocalSearchParams<"/(tabs)/program/exercise/[sessionId]/load">()
  const exerciseFormActor = useExerciseFormActor(
    sessionId
  );

  if (exerciseFormActor === undefined) {
    return <View testID="exercise-creation-form-load-default" />;
  }

  const handleGoNext = (load: Kilograms) => {
    exerciseFormActor.send({
      type: "SET_EXERCISE_LOAD_AND_GO_NEXT",
      load,
    });
  };

  const handleGoBack = () => {
    exerciseFormActor.send({
      type: "USER_WENT_TO_PREVIOUS_SCREEN",
    });
  };

  return (
    <ExerciseFormLoadContent
      testId={`exercise-creation-form-load-${exerciseFormActor.id}`}
      handleOnSubmit={({ value }) => handleGoNext(value)}
      handleOnGoBack={handleGoBack}
    />
  );
};