import { HeaderBackButton } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import invariant from "invariant";
import React, { ReactNode } from "react";
import { View } from "react-native";
import { IS_TEST } from "../types";

export interface AppScreenProps {
  testID: string;
  children: ReactNode
}

const AppScreen: React.FC<AppScreenProps> = ({ testID, children }) => {
  const navigation = useNavigation();

  invariant(
    children !== undefined,
    "You need to provide children to AppScreen"
  );

  // In tests we manually add an go back reference within the DOM
  if (IS_TEST) {
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
  }

  return (
    <View
      className="p-4 w-11/12 flex-1 justify-center items-center mx-auto"
      testID={testID}
    >
      {children}
    </View>
  );
};

export default AppScreen;
