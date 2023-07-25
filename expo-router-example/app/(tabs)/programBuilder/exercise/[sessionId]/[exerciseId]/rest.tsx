import { ExerciseFormRestContent } from "@/components/ExerciseRestForm";
import { useExerciseActorRef } from "@/hooks/useExerciseActorRef";
import { ExerciseRest } from "@/types";
import { useSelector } from "@xstate/react";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View } from "react-native";

export default function EditExerciseRestScreen() {
  const { sessionId, exerciseId } = useLocalSearchParams<"/(tabs)/programBuilder/exercise/[sessionId]/[exerciseId]/rest">();
  const exerciseActorRef = useExerciseActorRef({
    exerciseId,
    sessionId,
  });

  if (exerciseActorRef === undefined) {
    return <View testID="exercise-editor-form-rest-default" />;
  }

  const handleGoNext = (rest: ExerciseRest) => {
    exerciseActorRef.send({
      type: "USER_FINISHED_REST_EDITION",
      rest,
    });
  };

  const handleGoBack = () => {
    exerciseActorRef.send({
      type: "USER_CANCELLED_REST_EDITION",
    });
  };

  const defaultRest = useSelector(
    exerciseActorRef,
    (state) => state.context.rest
  );

  return (
    <ExerciseFormRestContent
      testId={`exercise-editor-form-rest-${exerciseActorRef.id}`}
      handleOnGoBack={handleGoBack}
      defaultRest={defaultRest}
      handleOnSubmit={handleGoNext}
    />
  );
};
