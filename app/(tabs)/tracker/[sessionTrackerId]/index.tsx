import AppScreen from "@/components/AppScreen";
import { useSessionTrackerActorRef } from "@/hooks/useTrackerHooks";
import { ExerciseTrackerMachineState, ExerciseTrackerMachineContext } from "@/machines/Tracker/ExerciseTrackerMachine";
import { ExerciseTracker } from "@/types";
import { useActor } from "@xstate/react";
import { Stack, useLocalSearchParams } from "expo-router";
import * as React from "react";
import { FlatList, Text, View } from "react-native";
import { BaseButton } from "react-native-gesture-handler";

interface ExerciseCardProps {
    exerciseTracker: ExerciseTracker
}
const ExerciseCard: React.FC<ExerciseCardProps> = ({ exerciseTracker: { exerciseId, expectedMetrics, name, setList } }) => {
    return <View>
        <Text>{name}</Text>
        <Text>{expectedMetrics.repCounter}x{expectedMetrics.setCounter}</Text>
        <BaseButton>
            <Text>Create new set</Text>
        </BaseButton>
    </View>
}

export default function ProgramScreen() {
    const { sessionTrackerId } = useLocalSearchParams<"/(tabs)/tracker/[sessionTrackerId]/">();
    const sessionTrackerRef = useSessionTrackerActorRef(sessionTrackerId)
    const [{ context: { name, createdOn, exerciseTrackerList } }] = useActor(sessionTrackerRef)
    const exerciseContextList = exerciseTrackerList
        .map((exercise) => exercise.getSnapshot())
        .filter((el: undefined | ExerciseTrackerMachineState): el is ExerciseTrackerMachineState => el !== undefined)
        .map(el => el.context)

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
            <FlatList<ExerciseTrackerMachineContext>
                data={exerciseContextList}
                renderItem={({ item: exerciseTracker }) => <ExerciseCard exerciseTracker={exerciseTracker} />}
                keyExtractor={({ exerciseId }) => exerciseId} />
        </AppScreen>
    );
};
