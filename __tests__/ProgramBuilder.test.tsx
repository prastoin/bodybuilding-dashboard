import { createMachine } from "xstate";
import {
  fireEvent,
  getAllTrainingSessionContainer,
  getLastTrainingSessionContainer,
  getTrainingSessionLastExercise,
  render,
  renderApp,
  waitFor,
  within,
} from "../tests/test.utils";
import { createModel } from "@xstate/test";
import invariant from "invariant";
import { faker } from "@faker-js/faker";

test("User goes to program builder screen from home", async () => {
  const screen = renderApp();

  const goToProgramBuilderButton = screen.getByText(/.*Program.*Builder.*/i);
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
                getLastTrainingSessionContainer(context.screen);

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
                getLastTrainingSessionContainer(context.screen);

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

  "User added exercise to the last training session": {
    exec: async (context) => {
      const { expectedTrainingSessionExerciseCounter, screen } = context;
      context.expectedTrainingSessionExerciseCounter =
        expectedTrainingSessionExerciseCounter === undefined
          ? 1
          : expectedTrainingSessionExerciseCounter + 1;

      const { lastTrainingSessionContainer, lastTrainingSessionId } =
        getLastTrainingSessionContainer(context.screen);

      const addExerciseButton = await within(
        lastTrainingSessionContainer
      ).findByTestId(`add-exercise-button-${lastTrainingSessionId}`);

      fireEvent.press(addExerciseButton);

      const exerciseCreationContainter = await screen.findByTestId(
        /exercise-creation-form-name-.*-visible/i
      );

      const name = faker.name.firstName();
      const textInput = await within(
        exerciseCreationContainter
      ).findByPlaceholderText(/name/i);

      fireEvent(textInput, "focus");
      fireEvent.changeText(textInput, name);

      const submitButton = await within(exerciseCreationContainter).findByText(
        /Submit/i
      );

      fireEvent.press(submitButton);

      await screen.findByTestId("program-builder-screen-container-visible");
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

      const { lastTrainingSessionId } = getLastTrainingSessionContainer(
        context.screen
      );
      const { lastExerciseContainer, lastExerciseId } =
        getTrainingSessionLastExercise({
          screen: context.screen,
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
