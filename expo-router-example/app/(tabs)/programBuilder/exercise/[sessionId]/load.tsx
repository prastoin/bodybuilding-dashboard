import { ExerciseFormLoadContent } from "@/components/ExerciseLoadForm";
import { useExerciseCreationFormActor } from "@/hooks/useExerciseCreationFormActor";
import { ExerciseLoad } from "@/types";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View } from "react-native";

export default function CreateExerciseLoadScreen() {
  const { sessionId } = useLocalSearchParams<"/(tabs)/programBuilder/exercise/[sessionId]/load">()
  const exerciseCreationFormActor = useExerciseCreationFormActor(
    sessionId
  );

  if (exerciseCreationFormActor === undefined) {
    return <View testID="exercise-creation-form-load-default" />;
  }

  const handleGoNext = (load: ExerciseLoad) => {
    exerciseCreationFormActor.send({
      type: "SET_EXERCISE_LOAD_AND_GO_NEXT",
      load,
    });
  };

  const handleGoBack = () => {
    exerciseCreationFormActor.send({
      type: "USER_WENT_TO_PREVIOUS_SCREEN",
    });
  };

  return (
    <ExerciseFormLoadContent
      testId={`exercise-creation-form-load-${exerciseCreationFormActor.id}`}
      handleOnSubmit={handleGoNext}
      handleOnGoBack={handleGoBack}
    />
  );
};