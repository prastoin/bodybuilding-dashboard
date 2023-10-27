import AppScreen from "@/components/AppScreen";
import { AddButton } from "@/components/common/AddButton";
import { Card } from "@/components/common/Card";
import { useSessionTrackerActorRef } from "@/hooks/useTrackerHooks";
import { ExerciseTracker, SetTracker } from "@/types";
import { useActor } from "@xstate/react";
import { Stack, useLocalSearchParams } from "expo-router";
import * as React from "react";
import { FlatList, Text, View } from "react-native";
import { BaseButton } from "react-native-gesture-handler";

const SetInformation: React.FC<{ setTracker: SetTracker, index: number }> = ({ index, setTracker: { load, rep, rest, rir } }) => {
    const even = index % 2 === 0
    const backgroundColor = even ? 'bg-neutral-400' : ''
    return (<View className={`flex-row ${backgroundColor} justify-evenly `}>
        <Text>{load}</Text>
        <Text>{rep}</Text>
        <Text>{rir}</Text>
        <Text>{rest}</Text>
    </View>)
}

interface ExerciseCardProps {
    exerciseTracker: ExerciseTracker
    addNewSetOnPress: () => void
}
const ExerciseCard: React.FC<ExerciseCardProps> = ({ exerciseTracker: { expectedMetrics, name, setList }, addNewSetOnPress }) => {
    return <Card>
        <View className="flex-row">
            <Text>{name}</Text>
            <Text>{expectedMetrics.set}x{expectedMetrics.rep}</Text>
        </View>

        <View className="max-w-600 min-w-200">
            <FlatList<SetTracker>
                renderItem={({ item, index }) => <SetInformation setTracker={item} index={index} />}
                data={setList}
                keyExtractor={({ index }) => `exerciseId - ${index} `} />
            <AddButton title="Add set" onPress={addNewSetOnPress} />
        </View>
    </Card >
}

// Might wanna use sectionList instead of flatList
export default function ProgramScreen() {
    const { sessionTrackerId } = useLocalSearchParams<"/(tabs)/tracker/[sessionTrackerId]/">();
    const sessionTrackerRef = useSessionTrackerActorRef(sessionTrackerId)

    const [state, _send] = useActor(sessionTrackerRef);
    const { createdOn, name, exerciseTrackerActorList } = state.context

    const formattedCreatedOn = new Date(createdOn).toLocaleDateString()
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
            <Text className="font-bold">{name}</Text>
            <Text>Created on: {formattedCreatedOn}</Text>
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
