import { useSelector } from "@xstate/react";
import React from "react";
import { View } from "react-native";
import { useExerciseActorRef } from "../../hooks/useExerciseActorRef";
import { ProgramBuilderExerciseEditorFormRestScreenProps } from "../../navigation/RootStack";
import { ExerciseRest } from "../../types";
import { ExerciseFormRestContent } from "./ExerciseRestFormContent";

const ExerciseRestEditor: React.FC<
  ProgramBuilderExerciseEditorFormRestScreenProps
> = ({ route }) => {
  const { exerciseId, trainingSessionId } = route.params;
  const exerciseActorRef = useExerciseActorRef({
    exerciseId,
    trainingSessionId,
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

export default ExerciseRestEditor;
