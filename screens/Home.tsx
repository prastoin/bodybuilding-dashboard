import * as React from "react";
import { Text, View } from "react-native";
import { HomeIndexScreenProps } from "../navigation/RootStack";
import { useTailwind } from "tailwind-rn";
import AppScreen from "../components/AppScreen";

export const HomeScreen: React.FC<HomeIndexScreenProps> = ({ navigation }) => {
  const tailwind = useTailwind();

  return (
    <AppScreen testID="home-screen-container">
      <Text style={tailwind("text-blue-600")}>Home Screen</Text>
    </AppScreen>
  );
};
