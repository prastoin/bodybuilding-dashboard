import AppScreen from "@/components/AppScreen";
import { useSessionTrackerActorRef } from "@/hooks/useTrackerHooks";
import { ExerciseTracker, SetTracker } from "@/types";
import { useActor } from "@xstate/react";
import { Stack, useLocalSearchParams } from "expo-router";
import * as React from "react";
import { FlatList, Text, View } from "react-native";
import { BaseButton } from "react-native-gesture-handler";

const SetInformation: React.FC<{ setTracker: SetTracker }> = ({ setTracker: { index, load, rep, rest, rir } }) => {
    return (<View>
        <Text>{index} - {load} | {rep} | {rir} | {rest}</Text>
    </View>)
}

interface ExerciseCardProps {
    exerciseTracker: ExerciseTracker
    addNewSetOnPress: () => void
}
const ExerciseCard: React.FC<ExerciseCardProps> = ({ exerciseTracker: { expectedMetrics, name, setList }, addNewSetOnPress }) => {
    return <View>
        <Text>{name}</Text>
        <Text>{expectedMetrics.set}x{expectedMetrics.rep}</Text>
        <FlatList<SetTracker>
            renderItem={({ item }) => <SetInformation setTracker={item} />}
            data={setList}
            keyExtractor={({ index }) => `exerciseId-${index}`} />
        <BaseButton onPress={addNewSetOnPress}>
            <Text>Create new set</Text>
        </BaseButton>
    </View>
}

export default function ProgramScreen() {
    const { sessionTrackerId } = useLocalSearchParams<"/(tabs)/tracker/[sessionTrackerId]/">();
    const sessionTrackerRef = useSessionTrackerActorRef(sessionTrackerId)

    const [state, _send] = useActor(sessionTrackerRef);
    const { createdOn, name, exerciseTrackerActorList } = state.context
    // Could avoid useActor and use useSelector on specific content field
    const exerciseActorCollection = exerciseTrackerActorList.map((actorRef) => useActor(actorRef))

    return (
        <AppScreen testID={"program-builder-screen-container"}>
            <Stack.Screen
                options={{
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerTitle: name,
                }}
            />
            <Text>{name}</Text>
            <Text>Created on: {createdOn}</Text>
            <FlatList
                data={exerciseActorCollection}
                extraData={exerciseTrackerActorList}
                renderItem={({ item: [state, send] }) =>
                    (<ExerciseCard exerciseTracker={state.context} addNewSetOnPress={() => send("ADD_NEW_SET")} />)
                }
                keyExtractor={([state, _send]) => state.context.exerciseId} />
        </AppScreen>
    );
};
