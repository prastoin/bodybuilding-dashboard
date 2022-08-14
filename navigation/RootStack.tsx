import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigatorScreenParams } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import * as React from "react";
import ExerciseCreationFormName from "../screens/ExerciseName/ExerciseCreationFormName";
import ExerciseEditorFormName from "../screens/ExerciseName/ExerciseEditorFormName";
import { HomeScreen } from "../screens/Home";
import { ProgramBuilderScreen } from "../screens/ProgramBuilder";
import TrainingSessionCreationFormName from "../screens/TrainingSessionName/TrainingSessionCreationFormName";
import TrainingSessionEditorFormName from "../screens/TrainingSessionName/TrainingSessionEditorFormName";

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
      <BottomTabNavigator.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          tabBarLabel: "Home",
          tabBarTestID: "home-bottom-tab",
        }}
      />
      <BottomTabNavigator.Screen
        name="ProgramBuilder"
        component={ProgramBuilderStackNavigator}
        options={{
          tabBarLabel: "Program Builder",
          tabBarTestID: "program-builder-bottom-tab",
        }}
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
  TrainingSessionEditorFormName: {
    trainingSessionId: string;
  };
  ExerciseEditorFormName: {
    exerciseId: string;
    trainingSessionId: string;
  };
  ExerciseCreationFormName: {
    trainingSessionId: string;
  };
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

export type ProgramBuilderTrainingSessionEditorFormNameScreenProps =
  NativeStackScreenProps<
    ProgramBuilderStackParamList,
    "TrainingSessionEditorFormName"
  >;

export type ProgramBuilderExerciseEditorFormNameScreenProps =
  NativeStackScreenProps<
    ProgramBuilderStackParamList,
    "ExerciseEditorFormName"
  >;

export type ProgramBuilderExerciseCreationFormNameScreenProps =
  NativeStackScreenProps<
    ProgramBuilderStackParamList,
    "ExerciseCreationFormName"
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
        component={TrainingSessionCreationFormName}
      />
      <ProgramBuilderStack.Screen
        name="TrainingSessionEditorFormName"
        component={TrainingSessionEditorFormName}
      />
      <ProgramBuilderStack.Screen
        name="ExerciseEditorFormName"
        component={ExerciseEditorFormName}
      />

      <ProgramBuilderStack.Screen
        name="ExerciseCreationFormName"
        component={ExerciseCreationFormName}
      />
    </ProgramBuilderStack.Navigator>
  );
};

///
