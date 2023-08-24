import AppScreen from "@/components/AppScreen";
import { useAppContext } from "@/context/appContext";
import { useBeforeRemove } from "@/hooks/useBeforeRemove";
import { useActor } from "@xstate/react";
import { StatusBar } from "expo-status-bar";
import { Platform, Text } from "react-native";

export default function PickScreen() {
    const { trackerService, programService } = useAppContext();
    const [trackerState, sendToTrackerMachine] = useActor(trackerService)
    const [programState, sendToProgramMachine] = useActor(programService)
    const { context: { sessionTrackerList } } = trackerState
    const { context: { sessionActorRefList } } = programState

    return (<AppScreen testID="picker-modal-screen-container">
        <Text>
            This is the picker modal !
        </Text>
        {/* Use a light status bar on iOS to account for the black space above the modal */}
        <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </AppScreen>);
}