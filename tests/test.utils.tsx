import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { render, within } from "@testing-library/react-native";
import App from "../App";
import { BodybuildingProgram } from "../types";
import invariant from "invariant";
import { ReactTestInstance } from "react-test-renderer";

export * from "@testing-library/react-native";
export const renderApp = () => {
  return render(<App />);
};

export type TestingScreen = ReturnType<typeof render>;

export const SERVER_ENDPOINT = `http://${process.env.SERVER_HOST!}:${process.env
  .SERVER_PORT!}`;

export const getBodyBuildingProgram = (): BodybuildingProgram => {
  return {
    programName: "Bodybuilding Program 1",
    trainingSessions: [
      {
        uuid: uuidv4(),
        trainingSessionName: "Training session A",
        exercises: [
          {
            uuid: uuidv4(),
            exerciseName: "Exercise A1",
          },
          {
            uuid: uuidv4(),
            exerciseName: "Exercise A2",
          },
          {
            uuid: uuidv4(),
            exerciseName: "Exercise A3",
          },
        ],
      },
      {
        uuid: uuidv4(),
        trainingSessionName: "Training session B",
        exercises: [
          {
            uuid: uuidv4(),
            exerciseName: "Exercise B1",
          },
          {
            uuid: uuidv4(),
            exerciseName: "Exercise B2",
          },
        ],
      },
      {
        uuid: uuidv4(),
        trainingSessionName: "Training session C",
        exercises: [],
      },
    ],
    uuid: uuidv4(),
  };
};

// Program Builder

export function getAllTrainingSessionContainer(
  screen: TestingScreen
): ReactTestInstance[] {
  const trainingSessionContainerCollection = screen.queryAllByTestId(
    /training-session-container.*/i
  );

  return trainingSessionContainerCollection;
}

/**
 * Throws error if no training session container found at all
 */
export function getLastTrainingSessionContainer(screen: TestingScreen): {
  lastTrainingSessionId: string;
  lastTrainingSessionContainer: ReactTestInstance;
} {
  const allTrainingSessionContainer = getAllTrainingSessionContainer(screen);

  invariant(
    allTrainingSessionContainer.length > 0,
    "Training session container not found"
  );

  const lastTrainingSessionContainer =
    allTrainingSessionContainer[allTrainingSessionContainer.length - 1];

  const lastTrainingSessionContainerTestId: string =
    lastTrainingSessionContainer.props.testID;

  const lastTrainingSessionIdSplit =
    lastTrainingSessionContainerTestId.split("-");

  const lastTrainingSessionId = lastTrainingSessionIdSplit
    .slice(lastTrainingSessionIdSplit.length - 5)
    .join("-");

  invariant(
    lastTrainingSessionId !== undefined,
    "lastTrainingSessionId is undefined"
  );

  return {
    lastTrainingSessionId,
    lastTrainingSessionContainer,
  };
}

export function getAllTrainingSessionExercise({
  screen,
  trainingSessionId,
}: {
  screen: TestingScreen;
  trainingSessionId: string;
}): ReactTestInstance[] {
  const trainingSessionContainer = screen.getByTestId(
    `training-session-container-${trainingSessionId}`
  );

  const allExerciseContainers = within(
    trainingSessionContainer
  ).queryAllByTestId(/training-session-exercise-container-.*/i);

  return allExerciseContainers;
}

export function getTrainingSessionLastExercise({
  screen,
  trainingSessionId,
}: {
  screen: TestingScreen;
  trainingSessionId: string;
}): { lastExerciseContainer: ReactTestInstance; lastExerciseId: string } {
  const allExercisesContainers = getAllTrainingSessionExercise({
    screen,
    trainingSessionId,
  });

  invariant(
    allExercisesContainers.length > 0,
    "allExercisesContainers length is < to 0"
  );

  const lastExerciseContainer =
    allExercisesContainers[allExercisesContainers.length - 1];

  const lastExerciseTestId: string = lastExerciseContainer.props.testID;

  const lastExerciseTestIdSplit = lastExerciseTestId.split("-");

  const lastExerciseId = lastExerciseTestIdSplit
    .slice(lastExerciseTestIdSplit.length - 5)
    .join("-");

  return {
    lastExerciseContainer,
    lastExerciseId,
  };
}

///
