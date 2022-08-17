import React from "react";
import { View } from "react-native";
import { useExerciseCreationFormActor } from "../../hooks/useExerciseCreationFormActor";
import { ExerciseCreationFormNameScreenProps } from "../../navigation/RootStack";
import { ExerciseNameFormContent } from "./ExerciseNameFormContent";

const ExerciseCreationFormName: React.FC<
  ExerciseCreationFormNameScreenProps
> = ({ route }) => {
  const exerciseCreationFormActor = useExerciseCreationFormActor(
    route.params.trainingSessionId
  );

  if (exerciseCreationFormActor === undefined) {
    return <View testID="exercise-creation-form-name-default" />;
  }

  const handleGoNext = (exerciseName: string) => {
    exerciseCreationFormActor.send({
      type: "SET_EXERCISE_NAME_AND_GO_NEXT",
      name: exerciseName,
    });
  };

  const handleGoBack = () => {
    exerciseCreationFormActor.send({
      type: "USER_WENT_TO_PREVIOUS_SCREEN",
    });
  };

  return (
    <ExerciseNameFormContent
      testId={`exercise-creation-form-name-${exerciseCreationFormActor.id}`}
      handleOnGoBack={handleGoBack}
      handleOnSubmit={({ exerciseName }) => {
        handleGoNext(exerciseName);
      }}
    />
  );
};

export default ExerciseCreationFormName;
