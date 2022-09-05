import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigatorScreenParams } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import * as React from "react";
import ExerciseCreationFormLoad from "../screens/ExerciseLoad/ExerciseCreationFormLoad";
import ExerciseLoadEditor from "../screens/ExerciseLoad/ExerciseLoadEditor";
import ExerciseCreationFormName from "../screens/ExerciseName/ExerciseCreationFormName";
import ExerciseEditorFormName from "../screens/ExerciseName/ExerciseEditorFormName";
import ExerciseCreationFormRest from "../screens/ExerciseRest/ExerciseCreationFormRest";
import ExerciseRestEditor from "../screens/ExerciseRest/ExerciseRestEditor";
import ExerciseCreationFormSetAndRep from "../screens/ExerciseSetAndRep/ExerciseSetAndRepCreationForm";
import ExerciseSetAndRepEditor from "../screens/ExerciseSetAndRep/ExerciseSetAndRepEditor";
import { HomeScreen } from "../screens/Home";
import { ProgramBuilderScreen } from "../screens/ProgramBuilder";
import { SessionTrackerFormLoad } from "../screens/SessionTracker/SessionTrackerFormLoad/SessionTrackerFormLoad";
import { SessionTrackerIndex } from "../screens/SessionTracker/SessionTrackerIndex";
import TrainingSessionCreationFormName from "../screens/TrainingSessionName/TrainingSessionCreationFormName";
import TrainingSessionEditorFormName from "../screens/TrainingSessionName/TrainingSessionEditorFormName";

// BottomTab navigator

const BottomTabNavigator =
  createBottomTabNavigator<BottomTabNavigatorParamList>();

export type BottomTabNavigatorParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  ProgramBuilder: NavigatorScreenParams<ProgramBuilderStackParamList>;
  SessionTracker: NavigatorScreenParams<SessionTrackerCreationFormParamList>;
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
      <BottomTabNavigator.Screen
        name="SessionTracker"
        component={SessionTrackerStackNavigator}
        options={{
          tabBarLabel: "Session tracker",
          tabBarTestID: "session-tracker-bottom-tab",
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
      <HomeStack.Screen
        name="Index"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
    </HomeStack.Navigator>
  );
};

///

// Program builder stack Navigator

interface EditorFormScreenParams {
  exerciseId: string;
  trainingSessionId: string;
}

export type ProgramBuilderStackParamList = {
  Index: undefined;
  TrainingSesssionCreationFormName: undefined;
  TrainingSessionEditorFormName: {
    trainingSessionId: string;
  };
  ExerciseEditorFormName: EditorFormScreenParams;
  ExerciseEditorFormSetAndRep: EditorFormScreenParams;
  ExerciseEditorFormLoad: EditorFormScreenParams;
  ExerciseEditorFormRest: EditorFormScreenParams;
  ExerciseCreationForm: NavigatorScreenParams<ExerciseCreationFormParamList>;
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

export type ProgramBuilderExerciseEditorFormSetAndRepScreenProps =
  NativeStackScreenProps<
    ProgramBuilderStackParamList,
    "ExerciseEditorFormSetAndRep"
  >;

export type ProgramBuilderExerciseEditorFormLoadScreenProps =
  NativeStackScreenProps<
    ProgramBuilderStackParamList,
    "ExerciseEditorFormLoad"
  >;

export type ProgramBuilderExerciseEditorFormRestScreenProps =
  NativeStackScreenProps<
    ProgramBuilderStackParamList,
    "ExerciseEditorFormRest"
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
        options={{
          headerShown: false,
        }}
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
        name="ExerciseEditorFormSetAndRep"
        component={ExerciseSetAndRepEditor}
      />
      <ProgramBuilderStack.Screen
        name="ExerciseEditorFormLoad"
        component={ExerciseLoadEditor}
      />
      <ProgramBuilderStack.Screen
        name="ExerciseEditorFormRest"
        component={ExerciseRestEditor}
      />

      <ProgramBuilderStack.Screen
        name="ExerciseCreationForm"
        options={{
          headerShown: false,
        }}
        component={ExerciseCreationFormStackNavigator}
      />
    </ProgramBuilderStack.Navigator>
  );
};

///

// ExerciseCreationForm stack

interface ExerciseCreationFormScreenProps {
  trainingSessionId: string;
}

export type ExerciseCreationFormParamList = {
  Name: ExerciseCreationFormScreenProps;
  SetAndRep: ExerciseCreationFormScreenProps;
  Load: ExerciseCreationFormScreenProps;
  Rest: ExerciseCreationFormScreenProps;
};

const ExerciseCreationForm =
  createNativeStackNavigator<ExerciseCreationFormParamList>();

export type ExerciseCreationFormNameScreenProps = NativeStackScreenProps<
  ExerciseCreationFormParamList,
  "Name"
>;

const ExerciseCreationFormStackNavigator: React.FC = () => {
  return (
    <ExerciseCreationForm.Navigator
      initialRouteName="Name"
      screenOptions={{
        headerShown: true,
      }}
    >
      <ExerciseCreationForm.Screen
        name="Name"
        options={{
          headerTitle: "Exercise Name",
        }}
        component={ExerciseCreationFormName}
      />
      <ExerciseCreationForm.Screen
        name="SetAndRep"
        options={{
          headerTitle: "Sets and Reps",
        }}
        component={ExerciseCreationFormSetAndRep}
      />
      <ExerciseCreationForm.Screen
        name="Load"
        options={{
          headerTitle: "Exercise starting load",
        }}
        component={ExerciseCreationFormLoad}
      />

      <ExerciseCreationForm.Screen
        name="Rest"
        options={{
          headerTitle: "Exercise default rest",
        }}
        component={ExerciseCreationFormRest}
      />
    </ExerciseCreationForm.Navigator>
  );
};

///

// Session tracker stack

export type SessionTrackerParamList = {
  Index: undefined;
  SessionTrackerCreationForm: NavigatorScreenParams<SessionTrackerCreationFormParamList>;
};

const SessionTracker = createNativeStackNavigator<SessionTrackerParamList>();

export type SessionTrackIndexScreenProps = NativeStackScreenProps<
  SessionTrackerParamList,
  "Index"
>;

const SessionTrackerStackNavigator: React.FC = () => {
  return (
    <SessionTracker.Navigator
      initialRouteName="Index"
      screenOptions={{
        headerShown: true,
      }}
    >
      <SessionTracker.Screen
        name="Index"
        options={{
          headerTitle: "Session trackers home",
          headerShown: false,
        }}
        component={SessionTrackerIndex}
      />

      <SessionTracker.Screen
        name="SessionTrackerCreationForm"
        options={{
          headerShown: false,
        }}
        component={SessionTrackerFormStackNavigator}
      />
    </SessionTracker.Navigator>
  );
};

//

// Session tracker form stack

export type SessionTrackerCreationFormParamList = {
  Load: undefined;
};

const SessionTrackerCreationForm =
  createNativeStackNavigator<SessionTrackerCreationFormParamList>();

export type SessionTrackFormLoadScreenProps = NativeStackScreenProps<
  SessionTrackerCreationFormParamList,
  "Load"
>;

const SessionTrackerFormStackNavigator: React.FC = () => {
  return (
    <SessionTrackerCreationForm.Navigator
      screenOptions={{
        headerShown: true,
      }}
    >
      <SessionTrackerCreationForm.Screen
        name="Load"
        options={{
          headerTitle: "Session tracker load",
        }}
        component={SessionTrackerFormLoad}
      />
    </SessionTrackerCreationForm.Navigator>
  );
};

///
