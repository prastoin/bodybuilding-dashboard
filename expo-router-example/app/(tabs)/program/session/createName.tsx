import { SessionNameForm } from "@/components/SessionNameForm";
import { useSessionFormActor } from "@/hooks/useSessionFormActor";
import React from "react";
import { View } from "react-native";

export default function CreateName() {
  const trainingSessionCreationFormActor =
    useSessionFormActor();

  if (trainingSessionCreationFormActor === undefined) {
    return <View testID="training-session-creation-form-name-default" />;
  }

  const handleGoNext = (sessionTrainingName: string) => {
    trainingSessionCreationFormActor.send({
      type: "SET_SESSION_NAME_AND_GO_NEXT",
      name: sessionTrainingName,
    });
  };

  const handleGoBack = () => {
    trainingSessionCreationFormActor.send({
      type: "USER_WENT_TO_PREVIOUS_SCREEN",
    });
  };

  return (
    <SessionNameForm
      testId="training-session-creation-form-name-step"
      handleOnGoBack={handleGoBack}
      handleOnSubmit={({ name }) => handleGoNext(name)
      }
    />
  );
};

