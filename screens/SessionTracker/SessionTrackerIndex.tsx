import { useSelector } from "@xstate/react";
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

  const firstTrainingSessionSnapshot = useSelector(
    programBuilderService,
    (state) => state.context.trainingSessionActorRefCollection[0].getSnapshot()
  );

  function handleStartNextTrainingSessionButtonOnPress() {
    if (firstTrainingSessionSnapshot === undefined) {
      return;
    }

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
    </AppScreen>
  );
};
