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
      style={tailwind("flex-row")}
      testID={`training-session-exercise-container-${uuid}`}
    >
      <View style={tailwind("flex-col flex-1")}>
        <AntDesign
          style={tailwind("absolute top-0 right-0")}
          name="close"
          size={24}
          color="black"
          onPress={handleRemoveExerciseButtonOnPress}
          testID={`remove-exercise-button-${uuid}`}
        />

        <View testID="exercise-name" style={tailwind("flex-row")}>
          <Text>{exerciseName}</Text>
          <AntDesign
            name="edit"
            size={24}
            color="black"
            testID="edit-exercise-name"
            onPress={handleEditExerciseNameOnPress}
          />
        </View>

        <View testID="exercise-set-and-rep" style={tailwind("flex-row")}>
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

        <View testID="exercise-load" style={tailwind("flex-row")}>
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

        <View testID="exercise-rest" style={tailwind("flex-row")}>
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
