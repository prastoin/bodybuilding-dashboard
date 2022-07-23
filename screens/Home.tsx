import * as React from "react";
import { Button, Text, View } from "react-native";
import { RootDetailsScreenProps } from "../navigation/RootStack";
import { useTailwind } from "tailwind-rn";

export const HomeScreen: React.FC<RootDetailsScreenProps> = ({
  navigation,
}) => {
  const tailwind = useTailwind();

  return (
    <View
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      testID="home-screen-container"
    >
      <Text style={tailwind("text-blue-600")}>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate("Details")}
      />
      <Button
        title="Go to Program Builder"
        onPress={() => navigation.navigate("ProgramBuilder")}
      />
    </View>
  );
};
