import { createMachine } from "xstate";
import {
  fireEvent,
  render,
  renderApp,
  waitFor,
  within,
} from "../tests/test.utils";
import { createModel } from "@xstate/test";

test("User goes to program builder screen from home", async () => {
  const screen = renderApp();

  const goToProgramBuilderButton = screen.getByText(/.*Program.*Builder.*/i);
  fireEvent.press(goToProgramBuilderButton);
  screen.findByTestId(`program-builder-screen-container`);
});

const programBuilderTestMachine = createMachine({
  id: "program builder test machine",
  initial: "Program builder screen view",
  states: {
    "Program builder screen view": {
      meta: {
        test: async ({ screen }: TestingContext) => {
          await screen.findByTestId(`program-builder-screen-container`);
        },
      },
    },

    "User added session training": {
      meta: {
        test: async ({
          screen,
          expectedTrainingSessionsCounter,
        }: TestingContext) => {
          const programBuilderScreenContainer = await screen.findByTestId(
            `program-builder-screen-container`
          );

          waitFor(() => {
            const trainingSessionContainerCollection = within(
              programBuilderScreenContainer
            ).queryAllByTestId(/training-session-container.*/i);

            expect(trainingSessionContainerCollection.length).toBe(
              expectedTrainingSessionsCounter
            );
          });
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

          const programBuilderScreenContainer = await screen.findByTestId(
            `program-builder-screen-container`
          );

          // Checking removed training session doesnot appear anymore
          waitFor(() => {
            const removedTrainingSessionContainer = screen.queryByTestId(
              `training-session-container-${lastlyRemovedTrainningSessionId}`
            );
            expect(removedTrainingSessionContainer).toBeNull();
          });
          context.lastlyRemovedTrainningSessionId = undefined;

          // Checking global expected counter
          waitFor(() => {
            const trainingSessionContainerCollection = within(
              programBuilderScreenContainer
            ).queryAllByTestId(/training-session-container.*/i);

            expect(trainingSessionContainerCollection.length).toBe(
              expectedTrainingSessionsCounter
            );
          });
        },
      },
    },
  },
  on: {
    "User added a training session": {
      target: ".User added session training",
    },

    "User removed the last training session": {
      target: ".User removed session training",
    },
  },
});

interface TestingContext {
  screen: ReturnType<typeof render>;
  expectedTrainingSessionsCounter: number;
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
      if (context.expectedTrainingSessionsCounter === 0) {
        return;
      }

      context.expectedTrainingSessionsCounter--;

      const removeLastTrainingSessionButton = screen.queryAllByTestId(
        /remove-training-session-button-.*/i
      );

      const lastTrainingSessionButton =
        removeLastTrainingSessionButton[
          removeLastTrainingSessionButton.length - 1
        ];

      const lastTrainingSessionButtonTestId: string =
        lastTrainingSessionButton.props.testID;
      context.lastlyRemovedTrainningSessionId = lastTrainingSessionButtonTestId
        .split("-")
        .pop();

      fireEvent.press(lastTrainingSessionButton);
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
