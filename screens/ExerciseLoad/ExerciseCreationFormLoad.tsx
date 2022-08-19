import React from "react";
import { View } from "react-native";
import { useExerciseCreationFormActor } from "../../hooks/useExerciseCreationFormActor";
import { ExerciseCreationFormNameScreenProps } from "../../navigation/RootStack";
import { ExerciseLoad } from "../../types";
import { ExerciseFormLoadContent } from "./ExerciseLoadFormContent";

const ExerciseCreationFormLoad: React.FC<
  ExerciseCreationFormNameScreenProps
> = ({ route }) => {
  const exerciseCreationFormActor = useExerciseCreationFormActor(
    route.params.trainingSessionId
  );

  if (exerciseCreationFormActor === undefined) {
    return <View testID="exercise-creation-form-load-default" />;
  }

  const handleGoNext = (load: ExerciseLoad) => {
    exerciseCreationFormActor.send({
      type: "SET_EXERCISE_LOAD_AND_GO_NEXT",
      load,
    });
  };

  const handleGoBack = () => {
    exerciseCreationFormActor.send({
      type: "USER_WENT_TO_PREVIOUS_SCREEN",
    });
  };

  return (
    <ExerciseFormLoadContent
      testId={`exercise-creation-form-load-${exerciseCreationFormActor.id}`}
      handleOnSubmit={handleGoNext}
      handleOnGoBack={handleGoBack}
    />
  );
};

export default ExerciseCreationFormLoad;
