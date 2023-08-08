import { ExerciseNameFormContent } from "@/components/ExerciseNameForm";
import { useExerciseFormActor } from "@/hooks/useExerciseFormActor";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View } from "react-native";

export default function CreateExerciseNameScreen() {
  const { sessionId } = useLocalSearchParams<"/(tabs)/program/exercise/[sessionId]/name">()
  const exerciseFormActor = useExerciseFormActor(
    sessionId
  );
  if (exerciseFormActor === undefined) {
    return <View testID="exercise-creation-form-name-default" />;
  }

  const handleGoNext = (name: string) => {
    exerciseFormActor.send({
      type: "SET_EXERCISE_NAME_AND_GO_NEXT",
      name,
    });
  };

  const handleGoBack = () => {
    exerciseFormActor.send({
      type: "USER_WENT_TO_PREVIOUS_SCREEN",
    });
  };

  return (
    <ExerciseNameFormContent
      testId={`exercise-creation-form-name-${exerciseFormActor.id}`}
      handleOnGoBack={handleGoBack}
      handleOnSubmit={({ name }) => {
        handleGoNext(name);
      }}
    />
  );
};