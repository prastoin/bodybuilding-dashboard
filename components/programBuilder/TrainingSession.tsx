import { useActor } from "@xstate/react";
import * as React from "react";
import { Button, FlatList, Text, View } from "react-native";
import { useTailwind } from "tailwind-rn";
import { TrainingSessionActorRef } from "../../machines/TrainingSessionMachine";
import { TrainingSessionExerciseItem } from "./TrainingSessionExercise";
import { TrainingSessionExerciseActorRef } from "../../machines/TrainingSessionExerciseMachine";

interface TrainingSessionProps {
  trainingSessionActorRef: TrainingSessionActorRef;
  index: number;
}

export const TrainingSessionItem: React.FC<TrainingSessionProps> = ({
  trainingSessionActorRef,
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
      type: "USER_ENTERED_EXERCISE_CREATION_FORM",
    });
  }

  function handleEditTrainingSessionName() {
    sendToTrainingSessionMachine({
      type: "USER_ENTERED_TRAINING_SESSION_NAME_EDITOR",
    });
  }

  return (
    <View
      style={tailwind("mb-1 p-1 flex-1 justify-center border-2 border-black")}
      testID={`training-session-container-${uuid}`}
    >
      <Text onPress={handleEditTrainingSessionName}>{trainingSessionName}</Text>

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
