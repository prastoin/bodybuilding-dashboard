import AppScreen from "@/components/AppScreen";
import { useAppContext } from "@/context/appContext";
import { SessionTracker } from "@/types";
import { useActor } from "@xstate/react";
import { Text, View } from "react-native";

const SessionTrackerCard: React.FC<{ sessionTracker: SessionTracker }> = ({ sessionTracker: { createdOn, name } }) => {

  return <View>
    <Text>{name}</Text>
    <Text>Created on: {createdOn}</Text>
  </View>
}

const SessionTrackerHistory: React.FC<{ sessionTrackerList: SessionTracker[] }> = ({ sessionTrackerList }) => {
  const emptySessionHistory = sessionTrackerList.length === 0

  if (emptySessionHistory) {
    return <View>
      <Text>No tracking session ? Start one below !</Text>
    </View>
  }

  return <View>
    {sessionTrackerList.map((sessionTracker) => <SessionTrackerCard sessionTracker={sessionTracker} />)}
  </View>
}

export default function TrackerIndexScreen() {
  const { trackerService } = useAppContext();
  const [trackerState, sendToTrackerMachine] = useActor(trackerService)
  const { context: { sessionTrackerList } } = trackerState


  return (<AppScreen testID="tracker-screen-container">
    <Text>Recent sessions:</Text>
    <SessionTrackerHistory sessionTrackerList={sessionTrackerList} />
  </AppScreen>);
}