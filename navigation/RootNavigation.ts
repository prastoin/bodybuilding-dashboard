// RootNavigation.js

import { createNavigationContainerRef } from "@react-navigation/native";
import * as React from "react";
import { BottomTabNavigatorParamList } from "./RootStack";

/**
 *  ☢️ DO NOT navigationRef.current?.navigation directly ☢️
 *  user navigateFromRef() instead as it's react navigation init safe
 */
export const navigationRef =
  createNavigationContainerRef<BottomTabNavigatorParamList>();

export function goBackFromRef(): void {
  if (navigationRef.isReady() && navigationRef.current) {
    // Perform navigation if the app has mounted
    navigationRef.current.goBack();
  } else {
    console.error("go back from ref NavigationContainer not mounted");
    // You can decide what to do if the app hasn't mounted
    // You can ignore this, or add these actions to a queue you can call later
  }
}

export function navigateFromRef<
  Route extends keyof BottomTabNavigatorParamList
>(
  name: keyof BottomTabNavigatorParamList,
  // Might need later depending on BottomTabNavigatorParamList to set params as optionnal
  params: BottomTabNavigatorParamList[Route]
): void {
  if (navigationRef.isReady() && navigationRef.current) {
    // Perform navigation if the app has mounted
    navigationRef.current.navigate(name, params);
  } else {
    console.error("NavigationContainer not mounted");
    // You can decide what to do if the app hasn't mounted
    // You can ignore this, or add these actions to a queue you can call later
  }
}
