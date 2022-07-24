import { useActor, useMachine } from "@xstate/react";
import * as React from "react";
import { Button, FlatList, Text, View } from "react-native";
import { createProgramBuilderMachine } from "../machines/ProgramBuilderMachine";
import { RootProgramBuilderScreenProps } from "../navigation/RootStack";
import { useTailwind } from "tailwind-rn";
import { TrainingSessionActorRef } from "../machines/TrainingSessionMachine";
import { TrainingSessionExerciseActorRef } from "../machines/TrainingSessionExerciseMachine";
import { AntDesign } from "@expo/vector-icons";

interface TrainingSessionExerciseProps {
  trainingSessionExerciseActorRef: TrainingSessionExerciseActorRef;
  index: number;
}

const TrainingSessionExerciseItem: React.FC<TrainingSessionExerciseProps> = ({
  trainingSessionExerciseActorRef,
  index,
}) => {
  const [exerciseMachineState, sendToExerciseMachine] = useActor(
    trainingSessionExerciseActorRef
  );
  const tailwind = useTailwind();

  const { exerciseName, uuid } = exerciseMachineState.context;

  function handleRemoveExerciseButtonOnPress() {
    console.log("Deletion requested", { uuid });

    sendToExerciseMachine({
      type: "REMOVE_EXERCISE",
    });
  }

  return (
    <View
      style={tailwind("flex-row")}
      testID={`training-session-exercise-container-${exerciseName}-${uuid}`}
    >
      <Text>
        {index} _ {exerciseName}
      </Text>
      <AntDesign
        name="close"
        size={24}
        color="black"
        onPress={handleRemoveExerciseButtonOnPress}
      />
    </View>
  );
};

interface TrainingSessionProps {
  trainingSessionActorRef: TrainingSessionActorRef;
  index: number;
}

const TrainingSessionItem: React.FC<TrainingSessionProps> = ({
  trainingSessionActorRef,
  index,
}) => {
  const [trainingSessionState, sendToTrainingSessionMachine] = useActor(
    trainingSessionActorRef
  );
  const {
    trainingSessionExerciseActorRefCollection,
    trainingSessionName,
    uuid,
  } = trainingSessionState.context;
  const tailwind = useTailwind();

  function handleRemoveTrainingSessionButtonOnPress() {
    sendToTrainingSessionMachine({
      type: "REMOVE_TRAINING_SESSION",
    });
  }

  function handleAddExerciseButtonOnPress() {
    sendToTrainingSessionMachine({
      type: "ADD_EXERCISE",
    });
  }

  return (
    <View
      style={tailwind("mb-1 p-1 flex-1 justify-center border-2 border-black")}
      testID={`training-session-container-${uuid}`}
    >
      <Text>{trainingSessionName}</Text>

      <View>
        <FlatList<TrainingSessionExerciseActorRef>
          data={trainingSessionExerciseActorRefCollection}
          renderItem={({ item, index }) => (
            <TrainingSessionExerciseItem
              trainingSessionExerciseActorRef={item}
              index={index}
            />
          )}
          keyExtractor={({ id }) => id}
        ></FlatList>

        <Button
          title="Add exercise"
          testID={`add-exercise-button-${uuid}`}
          onPress={handleAddExerciseButtonOnPress}
        />
        <Button
          title="Remove training session"
          testID={`remove-training-session-button-${uuid}`}
          onPress={handleRemoveTrainingSessionButtonOnPress}
        />
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
    sendToProgramBuilderMachine({
      type: "ADD_TRAINING_SESSION",
    });
  }

  return (
    <View
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      testID={"program-builder-screen-container"}
    >
      <Text>Program Builder Screen</Text>
      <Text>{JSON.stringify(programBuilderContext)}</Text>

      <View
        style={tailwind(
          "p-4 w-11/12 flex-1 justify-center border-2 border-black"
        )}
      >
        <FlatList<TrainingSessionActorRef>
          data={programBuilderContext.trainingSessionActorRefCollection}
          renderItem={({ index, item }) => (
            <TrainingSessionItem trainingSessionActorRef={item} index={index} />
          )}
          keyExtractor={({ id }) => id}
        />

        <Button
          title="Add static training session"
          onPress={handleAddTrainingSessionOnpress}
        />
      </View>
    </View>
  );
};
