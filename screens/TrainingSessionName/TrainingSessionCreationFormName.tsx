import React from "react";
import { View } from "react-native";
import { useTrainingSessionCreationFormActor } from "../../hooks/useTrainingSessionCreationFormActor";
import { ProgramBuilderTrainingSessionCreationFormNameScreenProps } from "../../navigation/RootStack";
import { TrainingSessionFormNameContent } from "./TrainingSessionNameFormContent";

const TrainingSessionCreationFormName: React.FC<
  ProgramBuilderTrainingSessionCreationFormNameScreenProps
> = (props) => {
  const trainingSessionCreationFormActor =
    useTrainingSessionCreationFormActor();

  if (trainingSessionCreationFormActor === undefined) {
    return <View testID="training-session-creation-form-name-default" />;
  }

  const handleGoNext = (sessionTrainingName: string) => {
    trainingSessionCreationFormActor.send({
      type: "SET_ROOM_NAME_AND_GO_NEXT",
      name: sessionTrainingName,
    });
  };

  const handleGoBack = () => {
    trainingSessionCreationFormActor.send({
      type: "USER_WENT_TO_PREVIOUS_SCREEN",
    });
  };

  return (
    <TrainingSessionFormNameContent
      testId="training-session-creation-form-name-step"
      handleOnGoBack={handleGoBack}
      handleOnSubmit={({ sessionTrainingName }) => {
        handleGoNext(sessionTrainingName);
      }}
    />
  );
};

export default TrainingSessionCreationFormName;
