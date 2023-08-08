import { ExerciseActorRef } from "@/machines/ExerciseMachine";
import { SessionActorRef } from "@/machines/SessionMachine";
import { useActor } from "@xstate/react";
import * as React from "react";
import { Button, FlatList, Text, View } from "react-native";
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

  return (
    <View
      className="mb-1 p-1 flex-1 justify-center border-2 border-black"
      testID={`training-session-container-${uuid}`}
    >
      <Text
        className="font-bold pb-2"
        onPress={editSessionNameOnPress}
      >
        {name}
      </Text>

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

        <Button
          title="Add exercise"
          testID={`add-exercise-button-${uuid}`}
          onPress={addExerciseOnPress}
        />
        <Button
          title="Remove training session"
          testID={`remove-training-session-button-${uuid}`}
          onPress={removeSessionOnPress}
        />
      </View>
    </View>
  );
};
