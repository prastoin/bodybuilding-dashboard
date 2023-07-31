import { ExerciseActorRef } from "@/machines/ExerciseMachine";
import { SessionActorRef } from "@/machines/SessionMachine";
import { useActor } from "@xstate/react";
import * as React from "react";
import { Button, FlatList, Text, View } from "react-native";
import { TrainingSessionExerciseItem } from "./TrainingSessionExercise";

interface TrainingSessionProps {
  trainingSessionActorRef: SessionActorRef;
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
      className="mb-1 p-1 flex-1 justify-center border-2 border-black"
      testID={`training-session-container-${uuid}`}
    >
      <Text
        className="font-bold pb-2"
        onPress={handleEditTrainingSessionName}
      >
        {trainingSessionName}
      </Text>

      <View>
        <FlatList<ExerciseActorRef>
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
