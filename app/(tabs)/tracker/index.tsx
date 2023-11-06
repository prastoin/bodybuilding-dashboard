import AppScreen from "@/components/AppScreen";
import { AddButton } from "@/components/common/AddButton";
import { Card } from "@/components/common/Card";
import { useAppContext } from "@/context/appContext";
import { SessionTracker } from "@/types";
import { useActor } from "@xstate/react";
import { Text, View, FlatList } from "react-native";
import { RectButton, TouchableOpacity } from "react-native-gesture-handler";

interface SessionTrackerCardProps {
  sessionTracker: SessionTracker,
  onCardPress: (sessionTrackerId: string) => void
}

const SessionTrackerCard: React.FC<SessionTrackerCardProps> = ({ sessionTracker: { createdOn, name, uuid }, onCardPress }) => {
  const date = new Date(createdOn).toDateString();

  return <Card>
    <TouchableOpacity className="p-3" onPress={() => onCardPress(uuid)}>
      <Text className="font-bold">{name}</Text>
      <Text>Created on: {date}</Text>
    </TouchableOpacity>
  </Card>
}

interface SessionTrackerHistoryProps {
  onCardPress: (sessionTrackerId: string) => void
  sessionTrackerList: SessionTracker[]
}
const SessionTrackerHistory: React.FC<SessionTrackerHistoryProps> = ({ sessionTrackerList, onCardPress }) => {
  const emptySessionHistory = sessionTrackerList.length === 0

  if (emptySessionHistory) {
    return <View>
      <Text>No tracking session ? Start one below !</Text>
    </View>
  }

  return <FlatList<SessionTracker>
    data={sessionTrackerList.sort((a, b) => a.createdOn - b.createdOn)}
    keyExtractor={({ uuid }) => uuid}
    renderItem={({ item: sessionTracker }) => <SessionTrackerCard sessionTracker={sessionTracker} onCardPress={onCardPress} />}
  />
}

export default function TrackerIndexScreen() {
  const { trackerService } = useAppContext();
  const [trackerState, sendToTrackerMachine] = useActor(trackerService)
  const { context: { sessionTrackerList } } = trackerState


  return (<AppScreen testID="tracker-screen-container">
    <Text>Recent sessions:</Text>
    <SessionTrackerHistory
      sessionTrackerList={sessionTrackerList}
      onCardPress={(sessionTrackerId: string) => sendToTrackerMachine({ type: "USER_PRESSED_EXISTING_TRACKING_SESSION", sessionTrackerId })}
    />
    <AddButton title="Lets train !" onPress={() => sendToTrackerMachine("USER_PRESSED_CREATE_TRACKING_SESSION")} />
  </AppScreen>);
}