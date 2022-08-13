import { useIsFocused, useNavigation } from "@react-navigation/native";
import invariant from "invariant";
import React from "react";
import { View } from "react-native";
import { HeaderBackButton } from "@react-navigation/elements";
import { IS_TEST } from "../types";

export interface AppScreenProps {
  testID: string;
}

const AppScreen: React.FC<AppScreenProps> = ({ testID, children }) => {
  invariant(
    children !== undefined,
    "You need to provide children to AppScreen"
  );

  if (IS_TEST) {
    const navigation = useNavigation();
    React.useLayoutEffect(() => {
      navigation.setOptions({
        headerLeft: (props: any) => {
          return (
            <HeaderBackButton
              testID="go-back-button"
              onPress={() => navigation.goBack()}
              {...props}
            />
          );
        },
      });
    }, [navigation]);

    const isFocused = useIsFocused();
    testID = isFocused ? testID + "-visible" : testID;
  }

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
