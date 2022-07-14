import { RouteProp } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import React from "react";

import { DetailsScreen } from "../screens/DetailsScreen";
import { HomeScreen } from "../screens/HomeScreen";

export type RootStackParamList = {
  Details: undefined;
  Home: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

export const Root = () => (
  <RootStack.Navigator initialRouteName="Home">
    <RootStack.Screen name="Details" component={DetailsScreen} />
    <RootStack.Screen name="Home" component={HomeScreen} />
  </RootStack.Navigator>
);

export type RootHomeScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Home"
>;
