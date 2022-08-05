import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import * as React from "react";
import { DetailsScreen } from "../screens/Details";
import { HomeScreen } from "../screens/Home";
import { ProgramBuilderScreen } from "../screens/ProgramBuilder";
import TrainingSessionFormNameWrapper from "../screens/ProgramBuilderTrainingSessionCreatorFormName";

const Stack = createNativeStackNavigator<RootStackParamList>();

export type RootStackParamList = {
  Details: undefined;
  Home: undefined;
  ProgramBuilder: undefined;
};

export type RootHomeScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Home"
>;

export type RootDetailsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Details"
>;

export type RootProgramBuilderScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "ProgramBuilder"
>;

export const RootStack: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Overview" }}
      />
      <Stack.Screen name="Details" component={DetailsScreen} />
      <Stack.Screen
        name="ProgramBuilder"
        component={ProgramBuilderStackNavigator}
      />
    </Stack.Navigator>
  );
};

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
        headerShown: false,
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
