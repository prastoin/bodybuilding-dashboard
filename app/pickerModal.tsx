import AppScreen from "@/components/AppScreen";
import { useAppContext } from "@/context/appContext";
import { useBeforeRemove } from "@/hooks/useBeforeRemove";
import { SessionMachineState, SessionMachineContext } from "@/machines/SessionMachine";
import { fromSessionMachineContextToSession } from "@/machines/Tracker/utils";
import { Session } from "@/types";
import { useActor } from "@xstate/react";
import { StatusBar } from "expo-status-bar";
import { FlatList, Platform, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

interface SessionCardCtaProps {
    session: SessionMachineContext,
    onSessionCardPress: (session: SessionMachineContext) => void
}
const SessionCardCta: React.FC<SessionCardCtaProps> = ({ session, onSessionCardPress }) => <TouchableOpacity onPress={() => onSessionCardPress(session)}><Text>{session.name}</Text></TouchableOpacity>

export default function PickScreen() {
    const { trackerService, programService } = useAppContext();
    const [trackerState, sendToTrackerMachine] = useActor(trackerService)
    const [programState, sendToProgramMachine] = useActor(programService)
    const { context: { sessionTrackerList } } = trackerState
    const { context: { sessionActorRefList } } = programState

    const onSessionCardPress = (sessionMachineContext: SessionMachineContext) => {
        const session = fromSessionMachineContextToSession(sessionMachineContext)
        sendToTrackerMachine({
            type: "USER_PICKED_SESSION",
            session
        })
    }

    useBeforeRemove(() => sendToTrackerMachine("USER_CANCELLED_TRACKING_SESSION_PICKER"))
    const sessionSnapshotList = sessionActorRefList.map((session) => session.getSnapshot()).filter((el: SessionMachineState | undefined): el is SessionMachineState => el !== undefined).map((el) => el.context)
    const latestTrackedSessionId = sessionTrackerList.length > 0 ? sessionTrackerList.slice(-1)[0].sessionId : undefined

    const latestTrackedIndex = sessionSnapshotList.findIndex(({ uuid }) => uuid === latestTrackedSessionId);
    const notFound = latestTrackedIndex === -1
    const defaultIndex = 0;
    const nextTrackedIndex = notFound ? defaultIndex : (latestTrackedIndex + 1) % (sessionSnapshotList.length)
    const nextTrackedSession = sessionSnapshotList.length >= nextTrackedIndex ? sessionSnapshotList[nextTrackedIndex] : undefined;

    return (<AppScreen testID="picker-modal-screen-container">
        <Text className="font-bold">
            This is the picker modal !
        </Text>
        {nextTrackedSession !== undefined && <View>
            <Text>
                Upcoming session ?:
            </Text>
            <SessionCardCta session={nextTrackedSession} onSessionCardPress={onSessionCardPress} />
        </View>}
        {/* Use a light status bar on iOS to account for the black space above the modal */}
        <Text className="font-bold">All available sessions:</Text>
        <FlatList<SessionMachineContext>
            data={sessionSnapshotList}
            renderItem={({ item: session }) => <SessionCardCta session={session} onSessionCardPress={onSessionCardPress} />}
            keyExtractor={({ uuid }) => uuid} />
        <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </AppScreen >);
}