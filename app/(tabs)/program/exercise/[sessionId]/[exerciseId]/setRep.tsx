import { ExerciseFormSetAndRepContent } from "@/components/ExerciseSetRepForm";
import { useExerciseActorRef } from "@/hooks/useExerciseActorRef";
import { useSelector } from "@xstate/react";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View } from "react-native";

export default function EditExerciseSetRepScreen() {
  const { sessionId, exerciseId } = useLocalSearchParams<"/(tabs)/program/exercise/[sessionId]/[exerciseId]/setRep">();
  const exerciseActorRef = useExerciseActorRef({
    exerciseId,
    sessionId,
  });

  if (exerciseActorRef === undefined) {
    return <View testID="exercise-editor-form-set-and-rep-default" />;
  }

  const handleGoNext = ({
    rep,
    set,
  }: {
    set: number;
    rep: number;
  }) => {
    exerciseActorRef.send({
      type: "USER_FINISHED_UPDATING_FIELD",
      update: {
        rep,
        set
      }
    });
  };

  const handleGoBack = () => {
    exerciseActorRef.send({
      type: "USER_CANCELLED_CURRENT_EDIT",
    });
  };

  const defaultRep = useSelector(
    exerciseActorRef,
    (state) => state.context.rep
  );
  const defaultSet = useSelector(
    exerciseActorRef,
    (state) => state.context.set
  );

  return (
    <ExerciseFormSetAndRepContent
      testId={`exercise-editor-form-set-and-rep-${exerciseActorRef.id}`}
      handleOnGoBack={handleGoBack}
      defaultRep={defaultRep}
      defaultSet={defaultSet}
      handleOnSubmit={handleGoNext}
    />
  );
};