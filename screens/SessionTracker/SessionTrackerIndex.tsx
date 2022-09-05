import * as React from "react";
import { Button, Text } from "react-native";
import { useTailwind } from "tailwind-rn";
import AppScreen from "../../components/AppScreen";
import { SessionTrackIndexScreenProps } from "../../navigation/RootStack";

export const SessionTrackerIndex: React.FC<SessionTrackIndexScreenProps> = ({
  navigation,
}) => {
  const tailwind = useTailwind();

  return (
    <AppScreen testID="session-tracker-index-container">
      <Text style={tailwind("text-blue-600")}>
        Session Tracker screen index
      </Text>
      <Button
        onPress={() => {
          navigation.navigate("SessionTrackerCreationForm", {
            screen: "Load",
          });
        }}
        title="Start next training session tracker"
      ></Button>
    </AppScreen>
  );
};
