import { createMachine } from "xstate";
import {
  fireEvent,
  getBodyBuildingProgram,
  render,
  renderApp,
  SERVER_ENDPOINT,
  within,
} from "../tests/test.utils";
import { createModel } from "@xstate/test";
import { server } from "../tests/mocks/server";
import { rest } from "msw";
import {
  BodybuildingProgram,
  RetrieveUserBodyBuildingProgramResponseBody,
} from "../types";
import { faker } from "@faker-js/faker";

const programBuilderTestMachine = createMachine({
  id: "program builder test machine",
  initial: "Exercise creation form name step",
  states: {
    "Exercise creation form name step": {
      meta: {
        test: async ({ screen }: TestingContext) => {
          await screen.findByTestId(/exercise-creation-form-name-.*-visible/i);
        },
      },

      states: {
        "User should see empty exercise name error label": {
          meta: {
            test: async ({ screen }: TestingContext) => {
              const visibleScreenContainer = await screen.findByTestId(
                /exercise-creation-form-name-.*-visible/i
              );
              await within(visibleScreenContainer).findByText(
                /An exercise name must be set./i
              );
            },
          },
        },
      },

      on: {
        "User submitted empty exercise name": {
          target: ".User should see empty exercise name error label",
        },

        "User submitted valid exercise name": {
          target: "Exercise creation form set and rep step",
        },
      },
    },

    "Exercise creation form set and rep step": {
      meta: {
        test: async ({ screen }: TestingContext) => {
          await screen.findByTestId(
            /exercise-creation-form-set-and-rep-.*-visible/i
          );
        },
      },

      states: {
        "User should see both set and rep empty value errors": {
          meta: {
            test: async ({ screen }: TestingContext) => {
              const visibleScreenContainer = await screen.findByTestId(
                /exercise-creation-form-set-and-rep-.*-visible/i
              );
              await within(visibleScreenContainer).findByText(
                /A set number must be set./i
              );
              await within(visibleScreenContainer).findByText(
                /A repetition number must be set./i
              );
            },
          },
        },
      },

      on: {
        "User submitted null set and rep values": {
          target: ".User should see both set and rep empty value errors",
        },

        "User submitted valid set and rep values": {
          target: "Exercise creation form is completed",
        },
      },
    },

    "Exercise creation form is completed": {
      type: "final",
      meta: {
        test: async ({ screen }: TestingContext) => {
          await screen.findByTestId("program-builder-screen-container-visible");
          //TODO Should make assertions on the created exercise data here too
        },
      },
    },
  },
});

interface TestingContext {
  screen: ReturnType<typeof render>;
  defaultBodyBuildingProgram: BodybuildingProgram;
  createdExerciseName?: string;
  createdExerciseSetCounter?: number;
  createdExerciseRepCounter?: number;
}

const programBuilderTestModel = createModel<TestingContext>(
  programBuilderTestMachine
).withEvents({
  "User submitted empty exercise name": {
    exec: async (context) => {
      const { screen } = context;

      const visibleScreenContainer = await screen.findByTestId(
        /exercise-creation-form-name-.*-visible/i
      );

      const nameTextInput = await within(
        visibleScreenContainer
      ).findByPlaceholderText(/name/i);
      expect(nameTextInput.props.value).toBe("");
      const submitButton = await within(visibleScreenContainer).findByText(
        /submit/i
      );
      fireEvent.press(submitButton);
    },
  },

  "User submitted valid exercise name": {
    exec: async (context) => {
      const { screen } = context;

      const visibleScreenContainer = await screen.findByTestId(
        /exercise-creation-form-name-.*-visible/i
      );

      const nameTextInput = await within(
        visibleScreenContainer
      ).findByPlaceholderText(/name/i);

      const exerciseName = faker.name.jobTitle();
      context.createdExerciseName = exerciseName;
      fireEvent(nameTextInput, "focus");
      fireEvent.changeText(nameTextInput, exerciseName);

      const submitButton = await within(visibleScreenContainer).findByText(
        /submit/i
      );
      fireEvent.press(submitButton);
    },
  },

  "User submitted null set and rep values": {
    exec: async (context) => {
      const { screen } = context;

      const visibleScreenContainer = await screen.findByTestId(
        /exercise-creation-form-set-and-rep-.*-visible/i
      );

      await within(visibleScreenContainer).findByTestId(`set-counter-0`);
      await within(visibleScreenContainer).findByTestId(`rep-counter-0`);

      const submitButton = await within(visibleScreenContainer).findByText(
        /submit/i
      );
      fireEvent.press(submitButton);
    },
  },

  "User submitted valid set and rep values": {
    exec: async (context) => {
      const { screen } = context;

      const visibleScreenContainer = await screen.findByTestId(
        /exercise-creation-form-set-and-rep-.*-visible/i
      );

      const newSetCounterValue = faker.datatype.number({
        min: 1,
        max: 10,
      });
      context.createdExerciseSetCounter = newSetCounterValue;

      const setCounterPicker = await within(
        visibleScreenContainer
      ).findByTestId(`set-counter-0`);

      fireEvent(setCounterPicker, "focus");
      fireEvent(setCounterPicker, "onValueChange", {
        target: {
          value: newSetCounterValue,
        },
      });

      await within(visibleScreenContainer).findByTestId(
        `set-counter-${newSetCounterValue}`
      );

      const newRepCounterValue = faker.datatype.number({
        min: 1,
        max: 20,
      });
      context.createdExerciseRepCounter = newRepCounterValue;
      const repCounterPicker = await within(
        visibleScreenContainer
      ).findByTestId(`rep-counter-0`);

      fireEvent(repCounterPicker, "focus");
      fireEvent(repCounterPicker, "onValueChange", {
        target: {
          value: newRepCounterValue,
        },
      });

      await within(visibleScreenContainer).findByTestId(
        `rep-counter-${newRepCounterValue}`
      );

      const submitButton = await within(visibleScreenContainer).findByText(
        /submit/i
      );
      fireEvent.press(submitButton);
    },
  },
});

describe("Xstate tests generations", () => {
  const testPlans = programBuilderTestModel.getSimplePathPlans();

  testPlans.forEach((plan) => {
    describe(plan.description, () => {
      plan.paths.forEach((path) => {
        it(path.description, async () => {
          const defaultBodyBuildingProgram = getBodyBuildingProgram();
          server.use(
            rest.post<
              undefined,
              Record<string, never>,
              RetrieveUserBodyBuildingProgramResponseBody
            >(`${SERVER_ENDPOINT}/retrieve-program`, (_req, res, ctx) => {
              return res(ctx.status(200), ctx.json(defaultBodyBuildingProgram));
            })
          );
          const screen = renderApp();

          await screen.findByTestId("home-screen-container-visible");
          const goToProgramBuilderButton =
            screen.getByText(/.*Program.*Builder.*/i);
          fireEvent.press(goToProgramBuilderButton);
          await screen.findByTestId("program-builder-screen-container-visible");

          const firstTrainingSessionId =
            defaultBodyBuildingProgram.trainingSessions[0].uuid;
          const firstTrainingSessionContainer = await screen.findByTestId(
            `training-session-container-${firstTrainingSessionId}`
          );
          const createExerciseButton = await within(
            firstTrainingSessionContainer
          ).findByTestId(/add-exercise-button-.*/);
          //Entering the exercise creation form wizard

          fireEvent.press(createExerciseButton);

          await path.test({
            screen,
            defaultBodyBuildingProgram,
          });
        });
      });
    });
  });

  it("should have full coverage", () => {
    return programBuilderTestModel.testCoverage();
  });
});
