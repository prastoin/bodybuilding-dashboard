import { useMachine } from "@xstate/react";
import * as React from "react";
import { Button, FlatList, ListRenderItem, Text, View } from "react-native";
import { createProgramBuilderMachine } from "../machines/ProgramBuilderMachine";
import { RootProgramBuilderScreenProps } from "../navigation/RootStack";
import { TrainingSession, TrainingSessionCollection } from "../types";

export const ProgramBuilderScreen: React.FC<RootProgramBuilderScreenProps> = ({
  navigation,
}) => {
  const [programBuilderMachineState, sendToProgramBuilderMachine] = useMachine(
    createProgramBuilderMachine()
  );

  const programBuilderMachineValue = programBuilderMachineState.value;
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

  const renderItem: ListRenderItem<TrainingSession> = ({
    item: { name },
    index,
  }) => {
    return (
      <View testID={`training-session-container-${name}-${index}`}>
        <Text>
          {index} _ {name}
        </Text>
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
        renderItem={renderItem}
        keyExtractor={({ name }, index) => `${name}_${index}`} //should be handled differently later
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
