import { ExerciseNameFormContent } from "@/components/ExerciseNameForm";
import { useExerciseActorRef } from "@/hooks/useExerciseActorRef";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View } from "react-native";

export default function EditExerciseNameScreen() {
  const { sessionId, exerciseId } = useLocalSearchParams<"/(tabs)/program/exercise/[sessionId]/[exerciseId]/name">();
  const exerciseActorRef = useExerciseActorRef({
    exerciseId,
    sessionId,
  });

  if (exerciseActorRef === undefined) {
    return <View testID="exercise-editor-form-name-default" />;
  }

  const handleGoNext = (name: string) => {
    exerciseActorRef.send({
      type: "USER_FINISHED_NAME_EDITION_OPERATION",
      name
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
      handleOnSubmit={({ name }) => {
        handleGoNext(name);
      }}
    />
  );
};
