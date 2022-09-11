import { useSelector } from "@xstate/react";
import * as React from "react";
import { Text } from "react-native";
import { useTailwind } from "tailwind-rn";
import AppScreen from "../../../components/AppScreen";
import { retrieveSessionTrackerFormActorContext, useSessionTrackerFormActorRef } from "../../../hooks/userSessionTrackerFormActorRef";
import { SessionTrackFormLoadScreenProps } from "../../../navigation/RootStack";

export const SessionTrackerFormLoad: React.FC<
  SessionTrackFormLoadScreenProps
> = ({ navigation }) => {
  const tailwind = useTailwind();

  const sessionTrackerFormActorRef = useSessionTrackerFormActorRef();

  if (sessionTrackerFormActorRef === undefined) {
    return (
      <AppScreen testID="session-tracker-form-load-container-error">
        <Text style={tailwind("text-blue-600")}>An unknown error occured</Text>
      </AppScreen>
    );
  }

  const context = retrieveSessionTrackerFormActorContext({ actor: sessionTrackerFormActorRef, contextKey: "trainingSessionMachineContext" })
  return (
    <AppScreen testID="session-tracker-form-load-container">
      <Text style={tailwind("text-blue-600")}>Session tracker Load</Text>
      <Text>{JSON.stringify(context)}</Text>
    </AppScreen>
  );
};
