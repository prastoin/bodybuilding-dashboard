import { useMachine } from "@xstate/react";
import * as React from "react";
import { Button, FlatList, Text, View } from "react-native";
import { createProgramBuilderMachine } from "../machines/ProgramBuilderMachine";
import { RootProgramBuilderScreenProps } from "../navigation/RootStack";
import { TrainingSession, TrainingSessionExercise } from "../types";
import { useTailwind } from "tailwind-rn";

interface TrainingSessionExerciseProps {
  exercise: TrainingSessionExercise;
  trainingSessionId: string;
  index: number;
}

const TrainingSessionExerciseItem: React.FC<TrainingSessionExerciseProps> = ({
  exercise: { exerciseName },
  trainingSessionId,
  index,
}) => (
  <View
    testID={`training-session-exercise-container-${exerciseName}-${trainingSessionId}`}
  >
    {index} _ {exerciseName}
  </View>
);

interface TrainingSessionProps {
  trainingSession: TrainingSession;
  index: number;
}

const TrainingSessionItem: React.FC<TrainingSessionProps> = ({
  trainingSession: { exercises, trainingSessionName, uuid },
  index,
}) => {
  const tailwind = useTailwind();

  return (
    <View
      style={tailwind("mb-1 p-1 flex-1 justify-center border-2 border-black")}
      testID={`training-session-container-${trainingSessionName}-${uuid}`}
    >
      <Text>Training Session {index}</Text>
      <Text>{trainingSessionName}</Text>

      <View>
        <FlatList<TrainingSessionExercise>
          data={exercises}
          renderItem={({ item, index }) => (
            <TrainingSessionExerciseItem
              exercise={item}
              index={index}
              trainingSessionId={uuid}
            />
          )}
          keyExtractor={({ exerciseName }) => `${exerciseName}_${uuid}`}
        ></FlatList>
      </View>
    </View>
  );
};

export const ProgramBuilderScreen: React.FC<RootProgramBuilderScreenProps> = ({
  navigation,
}) => {
  const tailwind = useTailwind();
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

  return (
    <View
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      testID={"program-builder-screen-container"}
    >
      <Text>Program Builder Screen</Text>

      <View
        style={tailwind(
          "p-4 w-11/12 flex-1 justify-center border-2 border-black"
        )}
      >
        <FlatList<TrainingSession>
          data={programBuilderContext.trainingSessions}
          renderItem={({ index, item }) => (
            <TrainingSessionItem trainingSession={item} index={index} />
          )}
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
    </View>
  );
};
