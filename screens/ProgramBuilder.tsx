import { useActor } from "@xstate/react";
import * as React from "react";
import { Button, FlatList, Text, View } from "react-native";
import { useTailwind } from "tailwind-rn";
import { TrainingSessionActorRef } from "../machines/TrainingSessionMachine";
import { useAppContext } from "../contexts/AppContext";
import { ProgramBuilderIndexScreenProps } from "../navigation/RootStack";
import AppScreen from "../components/AppScreen";
import { TrainingSessionItem } from "../components/programBuilder/TrainingSession";

export const ProgramBuilderScreen: React.FC<
  ProgramBuilderIndexScreenProps
> = () => {
  const tailwind = useTailwind();
  const { programBuilderService } = useAppContext();

  const [programBuilderState, sendToProgramBuilderMachine] = useActor(
    programBuilderService
  );
  const { context: programBuilderContext } = programBuilderState;

  function handleAddTrainingSessionOnpress() {
    sendToProgramBuilderMachine({
      type: "ENTER_TRAINING_SESSION_CREATION_FORM",
    });
  }

  return (
    <AppScreen testID={"program-builder-screen-container"}>
      <View>
        <Text>{programBuilderContext.programName}</Text>
        <FlatList<TrainingSessionActorRef>
          data={programBuilderContext.trainingSessionActorRefCollection}
          renderItem={({ index, item }) => (
            <TrainingSessionItem trainingSessionActorRef={item} index={index} />
          )}
          keyExtractor={({ id }) => id}
        />

        <Button
          title="Add static training session"
          testID="add-training-session-button"
          onPress={handleAddTrainingSessionOnpress}
        />
      </View>
    </AppScreen>
  );
};
