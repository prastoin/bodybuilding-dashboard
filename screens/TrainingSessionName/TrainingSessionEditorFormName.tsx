import React from "react";
import { View } from "react-native";
import { useTrainingSessionActorRef } from "../../hooks/useTrainingSessionActorRef";
import { ProgramBuilderTrainingSessionEditorFormNameScreenProps } from "../../navigation/RootStack";
import { TrainingSessionFormNameContent } from "./TrainingSessionNameFormContent";

const TrainingSessionEditorFormName: React.FC<
  ProgramBuilderTrainingSessionEditorFormNameScreenProps
> = ({ route }) => {
  const { trainingSessionId } = route.params;
  const trainingSessionActorRef = useTrainingSessionActorRef(trainingSessionId);

  if (trainingSessionActorRef === undefined) {
    return <View testID="training-session-editor-form-name-default" />;
  }

  const handleGoNext = (sessionTrainingName: string) => {
    trainingSessionActorRef.send({
      type: "USER_FINISHED_TRAINING_SESSION_NAME_EDITION",
      newName: sessionTrainingName,
    });
  };

  const handleGoBack = () => {
    trainingSessionActorRef.send({
      type: "USER_CANCELED_TRAINING_SESSION_NAME_EDITION",
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

export default TrainingSessionEditorFormName;
