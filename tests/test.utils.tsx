import { Program, SessionTracker } from "@/types";
import { faker } from "@faker-js/faker";
import {
  fireEvent,
  render,
  waitFor,
  within
} from "@testing-library/react-native";
// Please refer to alpha docs https://github.com/expo/router/pull/447
import { renderRouter } from "expo-router/src/testing-library";
import invariant from "invariant";
import "react-native-get-random-values";
import { ReactTestInstance } from "react-test-renderer";
import { v4 as uuidv4 } from "uuid";

export * from "@testing-library/react-native";
export const renderApp = () => {
  return renderRouter();
};

export const getRandomMinuteSecondDuration = () =>
  faker.number.int({
    min: 0,
    max: 59,
  });

export type TestingScreen = ReturnType<typeof render>;

export const getBodyBuildingProgram = (): Program => {
  return {
    name: faker.name.jobDescriptor(),
    sessionList: [
      {
        uuid: uuidv4(),
        name: faker.name.jobArea(),
        exerciseList: [
          {
            uuid: uuidv4(),
            name: faker.person.jobTitle(),
            rep: faker.number.int({
              max: 20,
              min: 1,
            }),
            set: faker.number.int({
              max: 10,
              min: 1,
            }),
            load: 42,
            rest: getRandomMinuteSecondDuration(),
            targetMuscle: []
          },
          {
            uuid: uuidv4(),
            name: faker.person.jobTitle(),
            rep: faker.number.int({
              max: 20,
              min: 1,
            }),
            set: faker.number.int({
              max: 10,
              min: 1,
            }),
            load: 42,
            rest: getRandomMinuteSecondDuration(),
            targetMuscle: []
          },
          {
            uuid: uuidv4(),
            name: faker.person.jobTitle(),
            rep: faker.number.int({
              max: 20,
              min: 1,
            }),
            set: faker.number.int({
              max: 10,
              min: 1,
            }),
            load: 42,
            rest: getRandomMinuteSecondDuration(),
            targetMuscle: []
          },
        ],
      },
      {
        uuid: uuidv4(),
        name: faker.name.jobArea(),
        exerciseList: [
          {
            uuid: uuidv4(),
            name: faker.person.jobTitle(),
            rep: faker.number.int({
              max: 20,
              min: 1,
            }),
            set: faker.number.int({
              max: 10,
              min: 1,
            }),
            load: 42,
            rest: getRandomMinuteSecondDuration(),
            targetMuscle: []
          },
          {
            uuid: uuidv4(),
            name: faker.person.jobTitle(),
            rep: faker.number.int({
              max: 20,
              min: 1,
            }),
            set: faker.number.int({
              max: 10,
              min: 1,
            }),
            load: 42,
            rest: getRandomMinuteSecondDuration(),
            targetMuscle: []
          },
        ],
      },
      {
        uuid: uuidv4(),
        name: faker.name.jobArea(),
        exerciseList: [],
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
  return await screen.findByTestId(
    `program-builder-bottom-tab`
  );
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

export function getSessionTracker(): SessionTracker {
  return {
    createdOn: faker.date.anytime().valueOf(),
    exerciseTrackerList: [],
    name: faker.word.words(2),
    sessionId: faker.string.uuid(),
    uuid: faker.string.uuid()
  }
}

///
