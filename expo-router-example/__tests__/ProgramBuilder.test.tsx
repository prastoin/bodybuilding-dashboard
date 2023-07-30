import { createModel } from "@xstate/test";
import invariant from "invariant";
import { createMachine } from "xstate";
import {
  fireEvent,
  getAllTrainingSessionContainer,
  getLastTrainingSessionContainer,
  getProgramBuilderTabIcon,
  render,
  renderApp,
  waitFor,
  within
} from "../tests/test.utils";

test("User goes to program builder screen from home", async () => {
  const screen = renderApp();

  const goToProgramBuilderButton = await getProgramBuilderTabIcon(screen);
  fireEvent.press(goToProgramBuilderButton);
  screen.findByTestId(/program-builder-screen-container/i);
});

const programBuilderTestMachine = createMachine({
  id: "program builder test machine",
  initial: "Program builder view",
  states: {
    "Program builder view": {
      meta: {
        test: async ({ screen }: TestingContext) => {
          await screen.findByTestId(/program-builder-screen-container/i);
        },
      },
    },

    "User added session training": {
      meta: {
        test: async ({ screen }: TestingContext) => {
          await screen.findByTestId(/program-builder-screen-container/i);
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
                  getAllTrainingSessionContainer(context.screen);

                expect(trainingSessionContainerCollection.length).toBe(
                  expectedTrainingSessionsCounter
                );
              });
            },
          },
        },
      },

      on: {
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
              getAllTrainingSessionContainer(context.screen);

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

      await waitFor(async () => {
        await screen.findByText(/default.*msw.*bodybuilding.*program/i);
      });

      const addTrainingSessionButton = await screen.findByTestId(
        "add-training-session-button"
      );

      fireEvent.press(addTrainingSessionButton);

      const creationFormNameScreen = await screen.findByTestId(
        /training-session-creation-form-name-step/i
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

      const { lastTrainingSessionId } = getLastTrainingSessionContainer(
        context.screen
      );

      const removeLastTrainingSessionButton = await screen.findByTestId(
        `remove-training-session-button-${lastTrainingSessionId}`
      );

      context.lastlyRemovedTrainningSessionId = lastTrainingSessionId;
      getAllTrainingSessionContainer(context.screen);
      fireEvent.press(removeLastTrainingSessionButton);
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

          await screen.findByTestId("home-screen-container-visible");
          const goToProgramBuilderButton =
            screen.getByText(/.*Program.*Builder.*/i);
          fireEvent.press(goToProgramBuilderButton);
          await screen.findByTestId("program-builder-screen-container-visible");
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
