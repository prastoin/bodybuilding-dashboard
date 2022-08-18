import { useActor } from "@xstate/react";
import * as React from "react";
import { Button, Text, View } from "react-native";
import { useTailwind } from "tailwind-rn";
import { TrainingSessionExerciseActorRef } from "../../machines/TrainingSessionExerciseMachine";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { navigateFromRef } from "../../navigation/RootNavigation";
import { loadOptions } from "@babel/core";

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

  const { exerciseName, uuid, repCounter, setCounter, load } =
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

        <View style={tailwind("flex-row")}>
          <Text>{exerciseName}</Text>
          <AntDesign
            name="edit"
            size={24}
            color="black"
            testID="edit-exercise-name"
            onPress={handleEditExerciseNameOnPress}
          />
        </View>

        <View style={tailwind("flex-row")}>
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

        <View style={tailwind("flex-row")}>
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
      </View>
    </View>
  );
};
