import { ExerciseActorRef } from "@/machines/ExerciseMachine";
import { AntDesign } from "@expo/vector-icons";
import { useActor } from "@xstate/react";
import * as React from "react";
import { Text, View } from "react-native";

interface ExerciseProps {
  exerciseActorRef: ExerciseActorRef;
  index: number;
}

export const SessionExerciseItem: React.FC<
  ExerciseProps
> = ({ exerciseActorRef, index }) => {
  const [exerciseMachineState, sendToExerciseMachine] = useActor(
    exerciseActorRef
  );

  const { name, uuid, rep, set, load, rest } =
    exerciseMachineState.context;

  const removeExerciseOnPress = () => sendToExerciseMachine({
    type: "REMOVE_EXERCISE",
  });

  const editExerciseNameOnPress = () => sendToExerciseMachine({
    type: "USER_ENTERED_NAME_EDITION_OPERATION",
  });

  const editSetAndRepOnPress = () => sendToExerciseMachine({
    type: "USER_ENTERED_SET_AND_REP_EDITOR",
  });

  const editLoadOnPress = () => sendToExerciseMachine({
    type: "USER_ENTERED_LOAD_EDITOR",
  });

  const editRestOnPress = () => sendToExerciseMachine({
    type: "USER_ENTERED_REST_EDITOR",
  })

  return (
    <View
      className="flex-row"
      testID={`training-session-exercise-container-${uuid}`}
    >
      <View className="flex-row">
        <View className="flex-col flex-1">
          <View testID="exercise-name" className="flex-row">
            <Text className="underline font-bold">{name}</Text>
            <AntDesign
              name="edit"
              size={24}
              color="black"
              testID="edit-exercise-name"
              onPress={editExerciseNameOnPress}
            />
          </View>

          <View testID="exercise-set-and-rep" className="flex-row">
            <Text>
              {set}X{rep}
            </Text>

            <AntDesign
              name="edit"
              size={24}
              color="black"
              testID="edit-exercise-set-and-rep"
              onPress={editSetAndRepOnPress}
            />
          </View>

          <View testID="exercise-load" className="flex-row">
            <Text>
              {load}_KG
            </Text>

            <AntDesign
              name="edit"
              size={24}
              color="black"
              testID="edit-exercise-load"
              onPress={editLoadOnPress}
            />
          </View>

          <View testID="exercise-rest" className="flex-row">
            <Text>{rest} seconds</Text>

            <AntDesign
              name="edit"
              size={24}
              color="black"
              testID="edit-exercise-rest"
              onPress={editRestOnPress}
            />
          </View>
        </View>

        <AntDesign
          className="absolute top-0 right-0"
          name="close"
          size={24}
          color="black"
          onPress={removeExerciseOnPress}
          testID={`remove-exercise-button-${uuid}`}
        />
      </View>

    </View>
  );
};
