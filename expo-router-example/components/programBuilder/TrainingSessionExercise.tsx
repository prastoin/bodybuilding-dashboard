import { AntDesign } from "@expo/vector-icons";
import { useActor } from "@xstate/react";
import * as React from "react";
import { Text, View } from "react-native";
import { TrainingSessionExerciseActorRef } from "../../machines/TrainingSessionExerciseMachine";

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

  const { exerciseName, uuid, repCounter, setCounter, load, rest } =
    exerciseMachineState.context;

  function handleRemoveExerciseButtonOnPress() {
    sendToExerciseMachine({
      type: "REMOVE_EXERCISE",
    });
  }

  function handleEditExerciseNameOnPress() {
    sendToExerciseMachine({
      type: "USER_ENTERED_NAME_EDITION_OPERATION",
    });
  }

  function handleEditSetAndRepOnPress() {
    sendToExerciseMachine({
      type: "USER_ENTERED_SET_AND_REP_EDITOR",
    });
  }

  function handleEditLoadOnPress() {
    sendToExerciseMachine({
      type: "USER_ENTERED_LOAD_EDITOR",
    });
  }

  function handleEditRestOnPress() {
    sendToExerciseMachine({
      type: "USER_ENTERED_REST_EDITOR",
    });
  }

  return (
    <View
      className="flex-row"
      testID={`training-session-exercise-container-${uuid}`}
    >
      <View className="flex-col flex-1">
        <AntDesign
          className="absolute top-0 right-0"
          name="close"
          size={24}
          color="black"
          onPress={handleRemoveExerciseButtonOnPress}
          testID={`remove-exercise-button-${uuid}`}
        />

        <View testID="exercise-name" className="flex-row">
          <Text>{exerciseName}</Text>
          <AntDesign
            name="edit"
            size={24}
            color="black"
            testID="edit-exercise-name"
            onPress={handleEditExerciseNameOnPress}
          />
        </View>

        <View testID="exercise-set-and-rep" className="flex-row">
          <Text>
            {setCounter}X{repCounter}
          </Text>

          <AntDesign
            name="edit"
            size={24}
            color="black"
            testID="edit-exercise-set-and-rep"
            onPress={handleEditSetAndRepOnPress}
          />
        </View>

        <View testID="exercise-load" className="flex-row">
          <Text>
            {load.value}_{load.unit}
          </Text>

          <AntDesign
            name="edit"
            size={24}
            color="black"
            testID="edit-exercise-load"
            onPress={handleEditLoadOnPress}
          />
        </View>

        <View testID="exercise-rest" className="flex-row">
          <Text>{rest.minute} min</Text>
          <Text>{rest.second} sec</Text>

          <AntDesign
            name="edit"
            size={24}
            color="black"
            testID="edit-exercise-rest"
            onPress={handleEditRestOnPress}
          />
        </View>
      </View>
    </View>
  );
};
