import { useActor } from "@xstate/react";
import * as React from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { useTailwind } from "tailwind-rn";
import { TrainingSessionExerciseActorRef } from "../../machines/TrainingSessionExerciseMachine";
import { AntDesign } from "@expo/vector-icons";

interface TrainingSessionExerciseProps {
  trainingSessionExerciseActorRef: TrainingSessionExerciseActorRef;
  index: number;
}

export const TrainingSessionExerciseItem: React.FC<
  TrainingSessionExerciseProps
> = ({ trainingSessionExerciseActorRef, index }) => {
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
      testID={`training-session-exercise-container-${uuid}`}
    >
      <Text>
        {index} _ {exerciseName}
      </Text>
      <AntDesign
        name="close"
        size={24}
        color="black"
        onPress={handleRemoveExerciseButtonOnPress}
        testID={`remove-exercise-button-${uuid}`}
      />
    </View>
  );
};
