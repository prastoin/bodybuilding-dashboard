import * as React from "react";
import { Button, Text, View } from "react-native";
import { RootDetailsScreenProps } from "../navigation/RootStack";

export const HomeScreen: React.FC<RootDetailsScreenProps> = ({
  navigation,
}) => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate("Details")}
      />
    </View>
  );
};
