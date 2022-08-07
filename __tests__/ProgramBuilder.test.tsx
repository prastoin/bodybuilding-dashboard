import { createMachine } from "xstate";
import {
  fireEvent,
  render,
  renderApp,
  waitFor,
  within,
} from "../tests/test.utils";
import { createModel } from "@xstate/test";
import invariant from "invariant";
import { ReactTestInstance } from "react-test-renderer";

function getAllTrainingSessionContainer({
  screen,
}: TestingContext): ReactTestInstance[] {
  const trainingSessionContainerCollection = screen.queryAllByTestId(
    /training-session-container.*/i
  );

  return trainingSessionContainerCollection;
}

/**
 * Throws error if no training session container found at all
 */
function getLastTrainingSessionContainer(context: TestingContext): {
  lastTrainingSessionId: string;
  lastTrainingSessionContainer: ReactTestInstance;
} {
  const allTrainingSessionContainer = getAllTrainingSessionContainer(context);

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

function getAllTrainingSessionExercise({
  context: { screen },
  trainingSessionId,
}: {
  context: TestingContext;
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

function getTrainingSessionLastExercise({
  context,
  trainingSessionId,
}: {
  context: TestingContext;
  trainingSessionId: string;
}): { lastExerciseContainer: ReactTestInstance; lastExerciseId: string } {
  const allExercisesContainers = getAllTrainingSessionExercise({
    context,
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

test("User goes to program builder screen from home", async () => {
  const screen = renderApp();

  const goToProgramBuilderButton = screen.getByText(/.*Program.*Builder.*/i);
  fireEvent.press(goToProgramBuilderButton);
  screen.findByTestId(`program-builder-screen-container`);
});

const programBuilderTestMachine = createMachine({
  id: "program builder test machine",
  initial: "Program builder view",
  states: {
    "Program builder view": {
      meta: {
        test: async ({ screen }: TestingContext) => {
          await screen.findByTestId(`program-builder-screen-container`);
        },
      },
    },

    "User added session training": {
      meta: {
        test: async ({ screen }: TestingContext) => {
          await screen.findByTestId(`program-builder-screen-container`);
        },
      },
      initial: "Idle",

      states: {
        Idle: {
          meta: {
            test: async (context: TestingContext) => {
              const { expectedTrainingSessionsCounter, screen } = context;

              waitFor(() => {
                const trainingSessionContainerCollection =
                  getAllTrainingSessionContainer(context);

                expect(trainingSessionContainerCollection.length).toBe(
                  expectedTrainingSessionsCounter
                );
              });
            },
          },
        },

        "User added an exercise to last training session": {
          meta: {
            test: async (context: TestingContext) => {
              const {
                expectedTrainingSessionsCounter,
                screen,
                expectedTrainingSessionExerciseCounter,
              } = context;

              invariant(
                expectedTrainingSessionExerciseCounter !== undefined,
                "Unsync testing context error"
              );

              const { lastTrainingSessionContainer } =
                getLastTrainingSessionContainer(context);

              waitFor(() => {
                const allRelatedExercisesContainer = within(
                  lastTrainingSessionContainer
                ).queryAllByTestId(/training-session-exercise-container-.*/i);

                expect(allRelatedExercisesContainer.length).toBe(
                  expectedTrainingSessionsCounter
                );
              });
            },
          },

          on: {
            "User removed last exercise from last training session": {
              target:
                "User removed last exercise from the last training session",
            },
          },
        },

        "User removed last exercise from the last training session": {
          meta: {
            test: async (context: TestingContext) => {
              const {
                screen,
                expectedTrainingSessionExerciseCounter,
                lastlyRemovedTrainingSessionExerciseId,
              } = context;

              invariant(
                expectedTrainingSessionExerciseCounter !== undefined,
                "Unsync testing context error"
              );

              invariant(
                lastlyRemovedTrainingSessionExerciseId !== undefined,
                "lastlyRemovedTrainingSessionExerciseId is undefined"
              );

              const { lastTrainingSessionContainer } =
                getLastTrainingSessionContainer(context);

              waitFor(() => {
                const allRelatedExercisesContainer = within(
                  lastTrainingSessionContainer
                ).queryAllByTestId(/training-session-exercise-container-.*/i);

                expect(allRelatedExercisesContainer.length).toBe(
                  expectedTrainingSessionExerciseCounter
                );
              });

              // Checking removed training session exercise doesnot appear anymore
              waitFor(() => {
                const removedTrainingSessionExerciseContainer =
                  screen.queryByTestId(
                    `training-session-exercise-container-${lastlyRemovedTrainingSessionExerciseId}`
                  );
                expect(removedTrainingSessionExerciseContainer).toBeNull();
              });
            },
          },
        },
      },

      on: {
        "User added exercise to the last training session": {
          target: ".User added an exercise to last training session",
        },

        "User removed the last training session": {
          target: "User removed session training",
        },
      },
    },

    "User removed session training": {
      meta: {
        test: async (context: TestingContext) => {
          const {
            expectedTrainingSessionsCounter,
            screen,
            lastlyRemovedTrainningSessionId,
          } = context;

          invariant(
            lastlyRemovedTrainningSessionId !== undefined,
            "lastlyRemoveTrainingSessionId is undefined"
          );

          // Checking global expected counter
          waitFor(async () => {
            const trainingSessionContainerCollection =
              getAllTrainingSessionContainer(context);

            expect(trainingSessionContainerCollection.length).toBe(
              expectedTrainingSessionsCounter
            );
          });

          // Checking removed training session doesnot appear anymore
          waitFor(() => {
            const removedTrainingSessionContainer = screen.queryByTestId(
              `training-session-container-${lastlyRemovedTrainningSessionId}`
            );
            expect(removedTrainingSessionContainer).toBeNull();
          });
          context.lastlyRemovedTrainningSessionId = undefined;
        },
      },
    },
  },

  on: {
    "User added a training session": {
      target: "User added session training",
    },
  },
});

interface TestingContext {
  screen: ReturnType<typeof render>;
  expectedTrainingSessionsCounter: number;
  expectedTrainingSessionExerciseCounter?: number;
  lastlyRemovedTrainningSessionId?: string;
  lastlyRemovedTrainingSessionExerciseId?: string;
}

const programBuilderTestModel = createModel<TestingContext>(
  programBuilderTestMachine
).withEvents({
  "User added a training session": {
    exec: async (context) => {
      const { screen } = context;
      context.expectedTrainingSessionsCounter++;

      const addTrainingSessionButton = await screen.findByText(
        /.*add.*training.*session/i
      );

      fireEvent.press(addTrainingSessionButton);

      const creationFormNameScreen = await screen.findByTestId(
        "training-session-creation-form-name-step"
      );

      const textInput = await within(
        creationFormNameScreen
      ).findByPlaceholderText("Name");

      fireEvent(textInput, "focus");
      const trainingSessionName = "just_a_name";
      fireEvent.changeText(textInput, trainingSessionName);

      const submitButton = await within(creationFormNameScreen).findByText(
        /submit/i
      );

      fireEvent.press(submitButton);
    },
  },

  "User removed the last training session": {
    exec: async (context) => {
      const { screen } = context;

      invariant(
        context.expectedTrainingSessionsCounter !== 0,
        "expectedTrainingSessionsCounter is 0"
      );

      context.expectedTrainingSessionsCounter--;

      const { lastTrainingSessionId } =
        getLastTrainingSessionContainer(context);

      const removeLastTrainingSessionButton = await screen.findByTestId(
        `remove-training-session-button-${lastTrainingSessionId}`
      );

      context.lastlyRemovedTrainningSessionId = lastTrainingSessionId;
      getAllTrainingSessionContainer(context);
      fireEvent.press(removeLastTrainingSessionButton);
    },
  },

  "User added exercise to the last training session": {
    exec: async (context) => {
      const { expectedTrainingSessionExerciseCounter } = context;
      context.expectedTrainingSessionExerciseCounter =
        expectedTrainingSessionExerciseCounter === undefined
          ? 1
          : expectedTrainingSessionExerciseCounter + 1;

      const { lastTrainingSessionContainer, lastTrainingSessionId } =
        getLastTrainingSessionContainer(context);

      const addExerciseButton = await within(
        lastTrainingSessionContainer
      ).findByTestId(`add-exercise-button-${lastTrainingSessionId}`);

      fireEvent.press(addExerciseButton);
    },
  },

  "User removed last exercise from last training session": {
    exec: async (context) => {
      const { expectedTrainingSessionExerciseCounter } = context;
      invariant(
        expectedTrainingSessionExerciseCounter !== undefined,
        "expectedTrainingSessionExerciseCounter is undefined"
      );
      // @ts-ignore
      context.expectedTrainingSessionExerciseCounter--;

      const { lastTrainingSessionId } =
        getLastTrainingSessionContainer(context);
      const { lastExerciseContainer, lastExerciseId } =
        getTrainingSessionLastExercise({
          context,
          trainingSessionId: lastTrainingSessionId,
        });

      context.lastlyRemovedTrainingSessionExerciseId = lastExerciseId;

      const removeExerciseButton = await within(
        lastExerciseContainer
      ).findByTestId(`remove-exercise-button-${lastExerciseId}`);

      fireEvent.press(removeExerciseButton);
    },
  },
});

describe("Xstate tests generations", () => {
  const testPlans = programBuilderTestModel.getSimplePathPlans();

  testPlans.forEach((plan) => {
    describe(plan.description, () => {
      plan.paths.forEach((path) => {
        it(path.description, async () => {
          const screen = renderApp();

          await screen.findByTestId("home-screen-container");
          const goToProgramBuilderButton =
            screen.getByText(/.*Program.*Builder.*/i);
          fireEvent.press(goToProgramBuilderButton);
          await screen.findByTestId("program-builder-screen-container");
          // do any setup, then...

          await path.test({
            screen,
            expectedTrainingSessionsCounter: 0,
          });
        });
      });
    });
  });

  it("should have full coverage", () => {
    return programBuilderTestModel.testCoverage();
  });
});
