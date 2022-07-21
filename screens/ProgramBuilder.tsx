import * as React from "react";
import { Text, View } from "react-native";
import { RootProgramBuilderScreenProps } from "../navigation/RootStack";

export const ProgramBuilderScreen: React.FC<RootProgramBuilderScreenProps> = ({
  navigation,
}) => {
  return (
    <View
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      testID={"program-builder-screen-container"}
    >
      <Text>Program Builder Screen</Text>
    </View>
  );
};
