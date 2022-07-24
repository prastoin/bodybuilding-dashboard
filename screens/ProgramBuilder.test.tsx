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
import { mapContext } from "xstate/lib/utils";

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
