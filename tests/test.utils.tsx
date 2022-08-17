import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import {
  fireEvent,
  render,
  waitFor,
  within,
} from "@testing-library/react-native";
import App from "../App";
import { BodybuildingProgram } from "../types";
import invariant from "invariant";
import { ReactTestInstance } from "react-test-renderer";
import { faker } from "@faker-js/faker";

export * from "@testing-library/react-native";
export const renderApp = () => {
  return render(<App />);
};

export type TestingScreen = ReturnType<typeof render>;

export const SERVER_ENDPOINT = `http://${process.env.SERVER_HOST!}:${process.env
  .SERVER_PORT!}`;

export const getBodyBuildingProgram = (): BodybuildingProgram => {
  return {
    programName: faker.name.jobDescriptor(),
    trainingSessions: [
      {
        uuid: uuidv4(),
        trainingSessionName: faker.name.jobArea(),
        exercises: [
          {
            uuid: uuidv4(),
            exerciseName: faker.name.jobTitle(),
            repCounter: faker.datatype.number({
              max: 20,
              min: 1,
            }),
            setCounter: faker.datatype.number({
              max: 10,
              min: 1,
            }),
          },
          {
            uuid: uuidv4(),
            exerciseName: faker.name.jobTitle(),
            repCounter: faker.datatype.number({
              max: 20,
              min: 1,
            }),
            setCounter: faker.datatype.number({
              max: 10,
              min: 1,
            }),
          },
          {
            uuid: uuidv4(),
            exerciseName: faker.name.jobTitle(),
            repCounter: faker.datatype.number({
              max: 20,
              min: 1,
            }),
            setCounter: faker.datatype.number({
              max: 10,
              min: 1,
            }),
          },
        ],
      },
      {
        uuid: uuidv4(),
        trainingSessionName: faker.name.jobArea(),
        exercises: [
          {
            uuid: uuidv4(),
            exerciseName: faker.name.jobTitle(),
            repCounter: faker.datatype.number({
              max: 20,
              min: 1,
            }),
            setCounter: faker.datatype.number({
              max: 10,
              min: 1,
            }),
          },
          {
            uuid: uuidv4(),
            exerciseName: faker.name.jobTitle(),
            repCounter: faker.datatype.number({
              max: 20,
              min: 1,
            }),
            setCounter: faker.datatype.number({
              max: 10,
              min: 1,
            }),
          },
        ],
      },
      {
        uuid: uuidv4(),
        trainingSessionName: faker.name.jobArea(),
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

export async function getProgramBuilderTabIcon(
  screen: TestingScreen
): Promise<ReactTestInstance> {
  const programBuilderBottomTab = await screen.findByTestId(
    `program-builder-bottom-tab`
  );

  return programBuilderBottomTab;
}

export async function userNavigatesBackFromHeaderBackButton(
  screen: TestingScreen
) {
  await waitFor(() => {
    const goBackButton = screen.queryAllByTestId("go-back-button").pop();
    expect(goBackButton).toBeTruthy();

    invariant(goBackButton !== undefined, "gobackButton is undefined");
    fireEvent.press(goBackButton);
  });
}

///
