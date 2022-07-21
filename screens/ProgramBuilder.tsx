import { useMachine } from "@xstate/react";
import * as React from "react";
import { Text, View } from "react-native";
import { createProgramBuilderMachine } from "../machines/ProgramBuilderMachine";
import { RootProgramBuilderScreenProps } from "../navigation/RootStack";

export const ProgramBuilderScreen: React.FC<RootProgramBuilderScreenProps> = ({
  navigation,
}) => {
  const [programBuilderMachineState, sendToProgramBuilderMachine] = useMachine(
    createProgramBuilderMachine()
  );

  const programBuilderMachineValue = programBuilderMachineState.value;

  return (
    <View
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      testID={"program-builder-screen-container"}
    >
      <Text>Program Builder Screen</Text>
      <Text>{programBuilderMachineValue}</Text>
    </View>
  );
};
