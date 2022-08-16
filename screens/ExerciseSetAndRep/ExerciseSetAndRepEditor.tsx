import { useSelector } from "@xstate/react";
import React from "react";
import { View } from "react-native";
import { useExerciseActorRef } from "../../hooks/useExerciseActorRef";
import { ProgramBuilderExerciseEditorFormNameScreenProps } from "../../navigation/RootStack";
import { ExerciseEditorFormSetAndRep } from "./ExerciseSetAndRepFormContent";

const ExerciseSetAndRepEditor: React.FC<
  ProgramBuilderExerciseEditorFormNameScreenProps
> = ({ route }) => {
  const { exerciseId, trainingSessionId } = route.params;
  const exerciseActorRef = useExerciseActorRef({
    exerciseId,
    trainingSessionId,
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
    <ExerciseEditorFormSetAndRep
      testId={`exercise-editor-form-set-and-rep-${exerciseActorRef.id}`}
      handleOnGoBack={handleGoBack}
      defaultRepCounter={defaultRepCounter}
      defaultSetCounter={defaultSetCounter}
      handleOnSubmit={handleGoNext}
    />
  );
};

export default ExerciseSetAndRepEditor;
