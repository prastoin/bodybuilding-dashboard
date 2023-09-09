import { ExerciseFormLoadContent } from "@/components/ExerciseLoadForm";
import { useExerciseActorRef } from "@/hooks/useExerciseActorRef";
import { Kilograms } from "@/types";
import { useSelector } from "@xstate/react";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View } from "react-native";

export default function EditExerciseLoadScreen() {
  const { sessionId, exerciseId } = useLocalSearchParams<"/(tabs)/program/exercise/[sessionId]/[exerciseId]/load">();
  const exerciseActorRef = useExerciseActorRef({
    exerciseId,
    sessionId,
  });

  if (exerciseActorRef === undefined) {
    return <View testID="exercise-editor-form-load-default" />;
  }

  const handleGoNext = (load: Kilograms) => {
    exerciseActorRef.send({
      type: "USER_FINISHED_UPDATING_FIELD",
      update: {
        load
      }
    });
  };

  const handleGoBack = () => {
    exerciseActorRef.send({
      type: "USER_CANCELLED_CURRENT_EDIT",
    });
  };

  const defaultLoad = useSelector(
    exerciseActorRef,
    (state) => state.context.load
  );

  return (
    <ExerciseFormLoadContent
      testId={`exercise-editor-form-load-${exerciseActorRef.id}`}
      handleOnGoBack={handleGoBack}
      defaultLoad={defaultLoad}
      handleOnSubmit={({ value }) => handleGoNext(value)}
    />
  );
};
