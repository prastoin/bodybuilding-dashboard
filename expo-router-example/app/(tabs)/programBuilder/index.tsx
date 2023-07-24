import AppScreen from "@/components/AppScreen";
import * as React from "react";
import { View } from "react-native";

export const ProgramBuilderScreen: React.FC = () => {
  // const { programBuilderService } = useAppContext();

  // const [programBuilderState, sendToProgramBuilderMachine] = useActor(
  //   programBuilderService
  // );
  // const { context: programBuilderContext } = programBuilderState;

  // function handleAddTrainingSessionOnpress() {
  //   sendToProgramBuilderMachine({
  //     type: "ENTER_TRAINING_SESSION_CREATION_FORM",
  //   });
  // }

  return (
    <AppScreen testID={"program-builder-screen-container"}>
      <View>
        {/* <Text>{programBuilderContext.programName}</Text>
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
        /> */}
      </View>
    </AppScreen>
  );
};
