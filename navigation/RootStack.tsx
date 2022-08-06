import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigatorScreenParams } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import * as React from "react";
import { HomeScreen } from "../screens/Home";
import { ProgramBuilderScreen } from "../screens/ProgramBuilder";
import TrainingSessionFormNameWrapper from "../screens/ProgramBuilderTrainingSessionCreatorFormName";

// BottomTab navigator

const BottomTabNavigator =
  createBottomTabNavigator<BottomTabNavigatorParamList>();

export type BottomTabNavigatorParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  ProgramBuilder: NavigatorScreenParams<ProgramBuilderStackParamList>;
};

export type RootHomeScreenProps = NativeStackScreenProps<
  BottomTabNavigatorParamList,
  "Home"
>;

export const BottomTab: React.FC = () => {
  return (
    <BottomTabNavigator.Navigator screenOptions={{ headerShown: false }}>
      <BottomTabNavigator.Screen name="Home" component={HomeStackNavigator} />
      <BottomTabNavigator.Screen
        name="ProgramBuilder"
        component={ProgramBuilderStackNavigator}
      />
    </BottomTabNavigator.Navigator>
  );
};

///

// Home stack navigator

export type HomeStackParamList = {
  Index: undefined;
};

const HomeStack = createNativeStackNavigator<HomeStackParamList>();

export type HomeIndexScreenProps = NativeStackScreenProps<
  HomeStackParamList,
  "Index"
>;

const HomeStackNavigator: React.FC = () => {
  return (
    <HomeStack.Navigator
      initialRouteName="Index"
      screenOptions={{
        headerShown: true,
      }}
    >
      <HomeStack.Screen name="Index" component={HomeScreen} />
    </HomeStack.Navigator>
  );
};

///

// Program builder stack Navigator

export type ProgramBuilderStackParamList = {
  Index: undefined;
  TrainingSesssionCreationFormName: undefined;
};

const ProgramBuilderStack =
  createNativeStackNavigator<ProgramBuilderStackParamList>();

export type ProgramBuilderIndexScreenProps = NativeStackScreenProps<
  ProgramBuilderStackParamList,
  "Index"
>;

export type ProgramBuilderTrainingSessionCreationFormNameScreenProps =
  NativeStackScreenProps<
    ProgramBuilderStackParamList,
    "TrainingSesssionCreationFormName"
  >;

const ProgramBuilderStackNavigator: React.FC = () => {
  return (
    <ProgramBuilderStack.Navigator
      initialRouteName="Index"
      screenOptions={{
        headerShown: true,
      }}
    >
      <ProgramBuilderStack.Screen
        name="Index"
        component={ProgramBuilderScreen}
      />
      <ProgramBuilderStack.Screen
        name="TrainingSesssionCreationFormName"
        component={TrainingSessionFormNameWrapper}
      />
    </ProgramBuilderStack.Navigator>
  );
};

///
