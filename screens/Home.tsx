import * as React from "react";
import { Text, View } from "react-native";
import { HomeIndexScreenProps } from "../navigation/RootStack";
import { useTailwind } from "tailwind-rn";

export const HomeScreen: React.FC<HomeIndexScreenProps> = ({ navigation }) => {
  const tailwind = useTailwind();

  return (
    <View
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      testID="home-screen-container"
    >
      <Text style={tailwind("text-blue-600")}>Home Screen</Text>
    </View>
  );
};
