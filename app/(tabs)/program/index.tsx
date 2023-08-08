import AppScreen from "@/components/AppScreen";
import { SessionItem } from "@/components/program/SessionItem";
import { useAppContext } from "@/context/appContext";
import { SessionActorRef } from "@/machines/SessionMachine";
import { useActor } from "@xstate/react";
import * as React from "react";
import { Button, FlatList, Text, View } from "react-native";

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
      <View>
        <Text>{programContext.name}</Text>
        <FlatList<SessionActorRef>
          data={programContext.sessionActorRefList}
          renderItem={({ index, item }) => (
            <SessionItem sessionActorRef={item} index={index} />
          )}
          keyExtractor={({ id }) => id}
        />

        <Button
          title="Add static training session"
          testID="add-training-session-button"
          onPress={addSessionOnPress}
        />
      </View>
    </AppScreen>
  );
};
