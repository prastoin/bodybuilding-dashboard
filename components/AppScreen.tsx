import { useIsFocused, useNavigation } from "@react-navigation/native";
import invariant from "invariant";
import React from "react";
import { View } from "react-native";
import { HeaderBackButton } from "@react-navigation/elements";
import { IS_TEST } from "../types";
import { useTailwind } from "tailwind-rn/dist";

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
  const tailwind = useTailwind();

  return (
    <View
      style={tailwind("p-4 w-11/12 flex-1 justify-center items-center mx-auto")}
      testID={testID}
    >
      {children}
    </View>
  );
};

export default AppScreen;
