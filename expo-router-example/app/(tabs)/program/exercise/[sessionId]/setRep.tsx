import { ExerciseFormSetAndRepContent } from "@/components/ExerciseSetRepForm";
import { useExerciseFormActor } from "@/hooks/useExerciseFormActor";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View } from "react-native";

export default function CreateExerciseSetRepScreen() {
  const { sessionId } = useLocalSearchParams<"/(tabs)/program/exercise/[sessionId]/setRep">()
  const exerciseFormActor = useExerciseFormActor(
    sessionId
  );

  if (exerciseFormActor === undefined) {
    return <View testID="exercise-creation-form-set-and-rep-default" />;
  }

  const handleGoNext = ({
    repCounter,
    setCounter,
  }: {
    repCounter: number;
    setCounter: number;
  }) => {
    exerciseFormActor.send({
      type: "SET_EXERCISE_SET_AND_REP_AND_GO_NEXT",
      repCounter,
      setCounter,
    });
  };

  const handleGoBack = () => {
    exerciseFormActor.send({
      type: "USER_WENT_TO_PREVIOUS_SCREEN",
    });
  };

  return (
    <ExerciseFormSetAndRepContent
      testId={`exercise-creation-form-set-and-rep-${exerciseFormActor.id}`}
      handleOnGoBack={handleGoBack}
      handleOnSubmit={({ repCounter, setCounter }) => {
        handleGoNext({ repCounter, setCounter });
      }}
    />
  );
};
