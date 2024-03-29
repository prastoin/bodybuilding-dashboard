import AppScreen from "@/components/AppScreen";
import { AddButton } from "@/components/common/AddButton";
import { SessionItem } from "@/components/program/SessionItem";
import { useAppContext } from "@/context/appContext";
import { SessionActorRef } from "@/machines/SessionMachine";
import { useActor } from "@xstate/react";
import * as React from "react";
import { FlatList, Text } from "react-native";

export default function ProgramScreen() {
  const { programService } = useAppContext();

  const [programState, sendToProgramMachine] = useActor(
    programService
  );
  const { context: programContext } = programState;

  const addSessionOnPress = () => {
    sendToProgramMachine({
      type: "ENTER_SESSION_FORM",
    });
  }

  return (
    <AppScreen testID={"program-builder-screen-container"}>
      <Text>{programContext.name}</Text>
      <FlatList<SessionActorRef>
        className="w-full"
        data={programContext.sessionActorRefList}
        renderItem={({ index, item }) => (
          <SessionItem sessionActorRef={item} index={index} />
        )}
        keyExtractor={({ id }) => id}
      />

      <AddButton
        title="New session"
        testID="add-training-session-button"
        onPress={addSessionOnPress}
      />
    </AppScreen>
  );
};
