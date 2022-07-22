import { useMachine } from "@xstate/react";
import * as React from "react";
import { Button, FlatList, ListRenderItem, Text, View } from "react-native";
import { createProgramBuilderMachine } from "../machines/ProgramBuilderMachine";
import { RootProgramBuilderScreenProps } from "../navigation/RootStack";
import { TrainingSession, TrainingSessionExercise } from "../types";

export const ProgramBuilderScreen: React.FC<RootProgramBuilderScreenProps> = ({
  navigation,
}) => {
  const [programBuilderMachineState, sendToProgramBuilderMachine] = useMachine(
    createProgramBuilderMachine()
  );

  const programBuilderContext = programBuilderMachineState.context;

  function handleAddTrainingSessionOnpress() {
    const name = "just a name";
    sendToProgramBuilderMachine({
      type: "ADD_TRAINING_SESSION",
      name,
    });
  }

  function handleRemoveLastTrainingSessionOnpress() {
    sendToProgramBuilderMachine({
      type: "REMOVE_TRAINING_SESSION",
    });
  }

  const renderTrainingSessionItem: ListRenderItem<TrainingSession> = ({
    item: { trainingSessionName, exercises, uuid },
    index,
  }) => {
    const renderTrainingSessionExerciseItem: ListRenderItem<
      TrainingSessionExercise
    > = ({ item: { exerciseName }, index }) => {
      return (
        <View
          testID={`training-session-exercise-container-${exerciseName}-${uuid}`}
        >
          {index} _ {exerciseName}
        </View>
      );
    };

    return (
      <View
        testID={`training-session-container-${trainingSessionName}-${uuid}`}
      >
        <Text>Training Session {index}</Text>
        <Text>{trainingSessionName}</Text>

        <View>
          <FlatList<TrainingSessionExercise>
            data={exercises}
            renderItem={renderTrainingSessionExerciseItem}
            keyExtractor={({ exerciseName }) => `${exerciseName}_${uuid}`}
          ></FlatList>
        </View>
      </View>
    );
  };

  return (
    <View
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      testID={"program-builder-screen-container"}
    >
      <Text>Program Builder Screen</Text>
      <Text>{JSON.stringify(programBuilderContext)}</Text>
      <FlatList<TrainingSession>
        data={programBuilderContext.trainingSessions}
        renderItem={renderTrainingSessionItem}
        keyExtractor={({ uuid }) => uuid}
      />

      <Button
        title="Add static training session"
        onPress={handleAddTrainingSessionOnpress}
      />
      <Button
        title="Remove last training session"
        onPress={handleRemoveLastTrainingSessionOnpress}
      />
    </View>
  );
};
