import { useSelector } from "@xstate/react";
import invariant from "invariant";
import * as React from "react";
import { Button, Text } from "react-native";
import { useTailwind } from "tailwind-rn";
import AppScreen from "../../components/AppScreen";
import { useAppContext } from "../../contexts/AppContext";
import { SessionTrackIndexScreenProps } from "../../navigation/RootStack";

export const SessionTrackerIndex: React.FC<SessionTrackIndexScreenProps> = ({
  navigation,
}) => {
  const tailwind = useTailwind();

  const { sessionTrackerService, programBuilderService } = useAppContext();

  const firstTrainingSessionActor = useSelector(
    programBuilderService,
    (state) => state.context.trainingSessionActorRefCollection[0]
  );

  if (firstTrainingSessionActor === undefined) {
    return (<AppScreen testID="session-tracker-index-no-program-container">
      <Text>Please create your program first</Text>
    </AppScreen>)
  }

  const firstTrainingSessionSnapshot = useSelector(
    programBuilderService,
    (state) => firstTrainingSessionActor.getSnapshot()
  );

  if (firstTrainingSessionSnapshot === undefined) {
    return (<AppScreen testID="session-tracker-index-error-container">
      <Text>Encountered unknown error please try again later</Text>
    </AppScreen>)
  }

  function handleStartNextTrainingSessionButtonOnPress() {
    invariant(firstTrainingSessionSnapshot !== undefined, "should never occurs firstTrainingSessionSnapshot is undefined");

    sessionTrackerService.send({
      type: "USER_STARTED_NEXT_TRAINING_SESSION_TRACKER",
      trainingSessionMachineContext: firstTrainingSessionSnapshot.context,
    });
  }

  return (
    <AppScreen testID="session-tracker-index-container">
      <Text style={tailwind("text-blue-600")}>
        Session Tracker screen index
      </Text>

      <Button
        onPress={handleStartNextTrainingSessionButtonOnPress}
        title="Start next training session tracker"
      ></Button>

      <Button
        onPress={() => navigation.navigate("SessionTrackerCreationForm", {
          screen: "Load"
        })}
        title="Start next training session tracker"
      ></Button>
    </AppScreen>
  );
};
