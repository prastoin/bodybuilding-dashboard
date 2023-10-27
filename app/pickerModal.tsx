import AppScreen from "@/components/AppScreen";
import { useAppContext } from "@/context/appContext";
import { useBeforeRemove } from "@/hooks/useBeforeRemove";
import { SessionMachineState, SessionMachineContext } from "@/machines/SessionMachine";
import { fromSessionMachineContextToSession } from "@/machines/Tracker/utils";
import { AntDesign } from "@expo/vector-icons";
import { useActor } from "@xstate/react";
import { StatusBar } from "expo-status-bar";
import { FlatList, Platform, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

interface SessionCardCtaProps {
    session: SessionMachineContext,
    onSessionCardPress: (session: SessionMachineContext) => void
}
const YellowSessionCardCta: React.FC<SessionCardCtaProps> = ({ session, onSessionCardPress }) =>
    <TouchableOpacity className="my-3 flex-row items-center justify-between bg-yellow-100 text-yellow-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-yellow-900 dark:text-yellow-300 border border-yellow-400" onPress={() => onSessionCardPress(session)}><Text className="font-bold">{session.name}</Text><AntDesign name="caretright" size={12} color="black" /></TouchableOpacity>
const SessionCardCta: React.FC<SessionCardCtaProps> = ({ session, onSessionCardPress }) =>
    <TouchableOpacity className="my-3 flex-row items-center justify-between bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300 border border-blue-400" onPress={() => onSessionCardPress(session)}><Text className="font-bold">{session.name}</Text><AntDesign name="caretright" size={12} color="black" /></TouchableOpacity>

export default function PickScreen() {
    const { trackerService, programService } = useAppContext();
    const [trackerState, sendToTrackerMachine] = useActor(trackerService)
    const [programState] = useActor(programService)
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
        {nextTrackedSession !== undefined && <View>
            <Text className="font-bold">
                Detected upcoming session:
            </Text>
            <YellowSessionCardCta session={nextTrackedSession} onSessionCardPress={onSessionCardPress} />
        </View>}
        {/* Use a light status bar on iOS to account for the black space above the modal */}
        <Text className="font-bold">Others:</Text>
        <FlatList<SessionMachineContext>
            data={nextTrackedSession ? sessionSnapshotList.filter(session => session.uuid !== nextTrackedSession.uuid) : sessionSnapshotList}
            renderItem={({ item: session }) => <SessionCardCta session={session} onSessionCardPress={onSessionCardPress} />}
            keyExtractor={({ uuid }) => uuid} />
        <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </AppScreen >);
}