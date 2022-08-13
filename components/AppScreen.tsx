import invariant from "invariant";
import React from "react";
import { View } from "react-native";

export interface AppScreenProps {
  testID: string;
}

const AppScreen: React.FC<AppScreenProps> = ({ testID, children }) => {
  invariant(
    children !== undefined,
    "You need to provide children to AppScreen"
  );

  return (
    <View
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      testID={testID}
    >
      {children}
    </View>
  );
};

export default AppScreen;
