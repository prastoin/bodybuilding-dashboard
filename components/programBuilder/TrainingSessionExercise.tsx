import { useActor } from "@xstate/react";
import * as React from "react";
import { Text, View } from "react-native";
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
    sendToExerciseMachine({
      type: "REMOVE_EXERCISE",
    });
  }

  return (
    <View
      style={tailwind("flex-row")}
      testID={`training-session-exercise-container-${uuid}`}
    >
      <View style={tailwind("flex-row ")}>
        <Text>
          {index} _ {exerciseName}
        </Text>
        <AntDesign
          name="edit"
          size={24}
          color="black"
          onPress={() =>
            sendToExerciseMachine({
              type: "USER_ENTERED_NAME_EDITION_OPERATION",
            })
          }
        />
      </View>
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
