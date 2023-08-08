import { SessionNameForm } from "@/components/SessionNameForm";
import { useSessionActorRef } from "@/hooks/useSessionActorRef";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View } from "react-native";

export default function EditSessionName() {
  const { sessionId } = useLocalSearchParams<"/(tabs)/program/session/[sessionId]">();
  const sessionActorRef = useSessionActorRef(sessionId);

  if (sessionActorRef === undefined) {
    return <View testID="training-session-editor-form-name-default" />;
  }

  const handleGoNext = (name: string) => {
    sessionActorRef.send({
      type: "USER_FINISHED_SESSION_NAME_EDITION",
      name,
    });
  };

  const handleGoBack = () => {
    sessionActorRef.send({
      type: "USER_CANCELED_SESSION_NAME_EDITION",
    });
  };

  return (
    <SessionNameForm
      testId={`training-session-editor-form-name-${sessionActorRef.id}`}
      handleOnGoBack={handleGoBack}
      handleOnSubmit={({ name }) => handleGoNext(name)
      }
    />
  );
};
