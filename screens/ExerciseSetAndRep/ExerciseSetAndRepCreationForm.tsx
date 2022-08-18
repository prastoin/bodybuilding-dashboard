import React from "react";
import { View } from "react-native";
import { useExerciseCreationFormActor } from "../../hooks/useExerciseCreationFormActor";
import { ExerciseCreationFormNameScreenProps } from "../../navigation/RootStack";
import { ExerciseFormSetAndRepContent } from "./ExerciseSetAndRepFormContent";

const ExerciseCreationFormSetAndRep: React.FC<
  ExerciseCreationFormNameScreenProps
> = ({ route }) => {
  const exerciseCreationFormActor = useExerciseCreationFormActor(
    route.params.trainingSessionId
  );

  if (exerciseCreationFormActor === undefined) {
    return <View testID="exercise-creation-form-set-and-rep-default" />;
  }

  const handleGoNext = ({
    repCounter,
    setCounter,
  }: {
    repCounter: number;
    setCounter: number;
  }) => {
    exerciseCreationFormActor.send({
      type: "SET_EXERCISE_SET_AND_REP_AND_GO_NEXT",
      repCounter,
      setCounter,
    });
  };

  const handleGoBack = () => {
    exerciseCreationFormActor.send({
      type: "USER_WENT_TO_PREVIOUS_SCREEN",
    });
  };

  return (
    <ExerciseFormSetAndRepContent
      testId={`exercise-creation-form-set-and-rep-${exerciseCreationFormActor.id}`}
      handleOnGoBack={handleGoBack}
      handleOnSubmit={({ repCounter, setCounter }) => {
        handleGoNext({ repCounter, setCounter });
      }}
    />
  );
};

export default ExerciseCreationFormSetAndRep;
