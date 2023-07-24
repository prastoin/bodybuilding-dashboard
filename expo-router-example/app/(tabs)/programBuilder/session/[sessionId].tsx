import { SessionNameForm } from "@/components/SessionNameForm";
import { useTrainingSessionActorRef } from "@/hooks/useTrainingSessionActorRef";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View } from "react-native";

export default function EditSessionName() {
  const { sessionId } = useLocalSearchParams<"/(tabs)/programBuilder/session/[sessionId]">();
  const trainingSessionActorRef = useTrainingSessionActorRef(sessionId);

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
    <SessionNameForm
      testId={`training-session-editor-form-name-${trainingSessionActorRef.id}`}
      handleOnGoBack={handleGoBack}
      handleOnSubmit={({ sessionTrainingName }) => {
        handleGoNext(sessionTrainingName);
      }}
    />
  );
};
