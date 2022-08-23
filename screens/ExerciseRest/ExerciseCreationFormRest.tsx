import React from "react";
import { View } from "react-native";
import { useExerciseCreationFormActor } from "../../hooks/useExerciseCreationFormActor";
import { ExerciseCreationFormNameScreenProps } from "../../navigation/RootStack";
import { ExerciseRest } from "../../types";
import { ExerciseFormRestContent } from "./ExerciseRestFormContent";

const ExerciseCreationFormRest: React.FC<
  ExerciseCreationFormNameScreenProps
> = ({ route }) => {
  const exerciseCreationFormActor = useExerciseCreationFormActor(
    route.params.trainingSessionId
  );

  if (exerciseCreationFormActor === undefined) {
    return <View testID="exercise-creation-form-rest-default" />;
  }

  const handleGoNext = (rest: ExerciseRest) => {
    exerciseCreationFormActor.send({
      type: "SET_EXERCISE_REST_AND_GO_NEXT",
      rest,
    });
  };

  const handleGoBack = () => {
    exerciseCreationFormActor.send({
      type: "USER_WENT_TO_PREVIOUS_SCREEN",
    });
  };

  return (
    <ExerciseFormRestContent
      testId={`exercise-creation-form-rest-${exerciseCreationFormActor.id}`}
      handleOnGoBack={handleGoBack}
      handleOnSubmit={handleGoNext}
    />
  );
};

export default ExerciseCreationFormRest;
