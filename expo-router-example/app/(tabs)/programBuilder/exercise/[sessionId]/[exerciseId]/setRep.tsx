import { ExerciseFormSetAndRepContent } from "@/components/ExerciseSetRepForm";
import { useExerciseActorRef } from "@/hooks/useExerciseActorRef";
import { useSelector } from "@xstate/react";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View } from "react-native";

export default function EditExerciseSetRepScreen() {
  const { sessionId, exerciseId } = useLocalSearchParams<"/(tabs)/programBuilder/exercise/[sessionId]/[exerciseId]/setRep">();
  const exerciseActorRef = useExerciseActorRef({
    exerciseId,
    sessionId,
  });

  if (exerciseActorRef === undefined) {
    return <View testID="exercise-editor-form-set-and-rep-default" />;
  }

  const handleGoNext = ({
    repCounter,
    setCounter,
  }: {
    setCounter: number;
    repCounter: number;
  }) => {
    exerciseActorRef.send({
      type: "USER_FINISHED_SET_AND_REP_EDITION",
      repCounter,
      setCounter,
    });
  };

  const handleGoBack = () => {
    exerciseActorRef.send({
      type: "USER_CANCELLED_SET_AND_REP_EDITION",
    });
  };

  const defaultRepCounter = useSelector(
    exerciseActorRef,
    (state) => state.context.repCounter
  );
  const defaultSetCounter = useSelector(
    exerciseActorRef,
    (state) => state.context.setCounter
  );

  return (
    <ExerciseFormSetAndRepContent
      testId={`exercise-editor-form-set-and-rep-${exerciseActorRef.id}`}
      handleOnGoBack={handleGoBack}
      defaultRepCounter={defaultRepCounter}
      defaultSetCounter={defaultSetCounter}
      handleOnSubmit={handleGoNext}
    />
  );
};