import * as React from "react";
import { Text } from "react-native";
import { useTailwind } from "tailwind-rn";
import AppScreen from "../../../components/AppScreen";
import { SessionTrackFormLoadScreenProps } from "../../../navigation/RootStack";

export const SessionTrackerFormLoad: React.FC<
  SessionTrackFormLoadScreenProps
> = ({ navigation }) => {
  const tailwind = useTailwind();

  return (
    <AppScreen testID="session-tracker-form-load-container">
      <Text style={tailwind("text-blue-600")}>Session tracker Load</Text>
    </AppScreen>
  );
};
