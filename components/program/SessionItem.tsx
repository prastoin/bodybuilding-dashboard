import { ExerciseActorRef } from "@/machines/ExerciseMachine";
import { SessionActorRef } from "@/machines/SessionMachine";
import { FontAwesome } from "@expo/vector-icons";
import { useActor } from "@xstate/react";
import * as React from "react";
import { Button, FlatList, Text, View } from "react-native";
import { AddButton } from "../common/AddButton";
import { Card } from "../common/Card";
import { RemoveButton } from "../common/RemoveButton";
import { SessionExerciseItem } from "./ExerciseItem";

interface SessionProps {
  sessionActorRef: SessionActorRef;
  index: number;
}

export const SessionItem: React.FC<SessionProps> = ({
  sessionActorRef,
}) => {
  const [sessionState, sendToSessionMachine] = useActor(
    sessionActorRef
  );
  const {
    exerciseActorRefList,
    name,
    uuid,
  } = sessionState.context;

  const removeSessionOnPress = () => {
    sendToSessionMachine({
      type: "REMOVE_SESSION",
    });
  }

  const addExerciseOnPress = () => {
    sendToSessionMachine({
      type: "USER_ENTERED_EXERCISE_CREATION_FORM",
    });
  }

  const editSessionNameOnPress = () => {
    sendToSessionMachine({
      type: "USER_ENTERED_SESSION_NAME_EDITOR",
    });
  }

  // Should not have onPress on text elements not accessible
  return (
    <Card testID={`training-session-container-${uuid}`}>
      <View className="flex-row justify-between items-center">
        <Text
          className="font-bold text-xl mb-2"
          onPress={editSessionNameOnPress}
        >
          {name}
        </Text>
        <RemoveButton
          title="Remove"
          testID={`remove-training-session-button-${uuid}`}
          onPress={removeSessionOnPress}
        />
      </View>


      <View>
        <FlatList<ExerciseActorRef>
          data={exerciseActorRefList}
          renderItem={({ item, index }) => (
            <SessionExerciseItem
              exerciseActorRef={item}
              index={index}
            />
          )}
          keyExtractor={({ id }) => id}
        ></FlatList>

        <AddButton
          title="Add exercise"
          testID={`add-exercise-button-${uuid}`}
          onPress={addExerciseOnPress} />
      </View>
    </Card>
  );
};
