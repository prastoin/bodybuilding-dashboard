import { faker } from "@faker-js/faker";
import { createModel } from "@xstate/test";
import { rest } from "msw";
import { createMachine } from "xstate";
import { server } from "../tests/mocks/server";
import {
  fireEvent,
  getBodyBuildingProgram,
  getProgramBuilderTabIcon,
  getRandomMinuteSecondDuration,
  render,
  renderApp,
  userNavigatesBackFromHeaderBackButton, within
} from "../tests/test.utils";
import {
  ExerciseLoad,
  ExerciseRest,
  LoadUnit, Program, RetrieveUserProgramResponseBody, SERVER_ENDPOINT
} from "../types";

const programBuilderTestMachine = createMachine({
  id: "program builder test machine",
  initial: "Exercise creation form name step",
  states: {
    "Exercise creation form name step": {
      meta: {
        test: async ({ screen, createdExerciseName }: TestingContext) => {
          const visibleContainer = await screen.findByTestId(
            /exercise-creation-form-name-.*/i
          );

          const nameTextInput = await within(
            visibleContainer
          ).findByPlaceholderText(/name/i);

          expect(nameTextInput.props.value).toBe(createdExerciseName);
        },
      },

      states: {
        "User should see empty exercise name error label": {
          meta: {
            test: async ({ screen }: TestingContext) => {
              const visibleScreenContainer = await screen.findByTestId(
                /exercise-creation-form-name-.*/i
              );
              await within(visibleScreenContainer).findByText(
                /An exercise name must be set./i
              );
            },
          },
        },

        "User went back on this form step": {
          meta: {
            test: async ({ screen }: TestingContext) => {
              // This assertion is only to provide a full test coverage on every states node
              await screen.findByTestId(
                /exercise-creation-form-name-.*/i
              );
            },
          },
        },
      },

      on: {
        "User navigates back": {
          target: "User exited exercise creation form",
        },

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
        test: async ({
          screen,
          createdExerciseRepCounter,
          createdExerciseSetCounter,
        }: TestingContext) => {
          const visibleContainer = await screen.findByTestId(
            /exercise-creation-form-set-and-rep-.*/i
          );

          await within(visibleContainer).findByTestId(
            `set-counter-${createdExerciseSetCounter}`
          );
          await within(visibleContainer).findByTestId(
            `rep-counter-${createdExerciseRepCounter}`
          );
        },
      },

      states: {
        "User should see both set and rep empty value errors": {
          meta: {
            test: async ({ screen }: TestingContext) => {
              const visibleScreenContainer = await screen.findByTestId(
                /exercise-creation-form-set-and-rep-.*/i
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

        "User went back on this form step": {
          meta: {
            test: async ({ screen }: TestingContext) => {
              // This assertion is only to provide a full test coverage on every states node
              await screen.findByTestId(
                /exercise-creation-form-set-and-rep-.*/i
              );
            },
          },
        },
      },

      on: {
        "User navigates back": {
          target:
            "Exercise creation form name step.User went back on this form step",
        },

        "User submitted null set and rep values": {
          target: ".User should see both set and rep empty value errors",
        },

        "User submitted valid set and rep values": {
          target: "Exercise creation form load step",
        },
      },
    },

    "Exercise creation form load step": {
      meta: {
        test: async ({ screen, load }: TestingContext) => {
          const visibleContainer = await screen.findByTestId(
            /exercise-creation-form-load-.*/i
          );

          const loadInputValue = await within(
            visibleContainer
          ).findByPlaceholderText(/Load/i);
          expect(loadInputValue.props.value).toBe(`${load.value}`);

          await within(visibleContainer).findByTestId(`load-unit-${load.unit}`);
        },
      },

      states: {
        "User should see load empty field error": {
          meta: {
            test: async ({ screen }: TestingContext) => {
              const visibleContainer = await screen.findByTestId(
                /exercise-creation-form-load-.*/i
              );

              await within(visibleContainer).findByText(
                /A load value must be set/i
              );
            },
          },
        },

        "User went back on this form step": {
          meta: {
            test: async ({ screen, load }: TestingContext) => {
              // This assertion is only to provide a full test coverage on every states node
              await screen.findByTestId(
                /exercise-creation-form-load-.*/i
              );
            },
          },
        },
      },

      on: {
        "User navigates back": {
          target:
            "Exercise creation form set and rep step.User went back on this form step",
        },

        "User submitted empty load value": {
          target: ".User should see load empty field error",
        },

        "User submitted valid load an load unit": {
          target: "Exercise creation form rest step",
        },
      },
    },

    "Exercise creation form rest step": {
      meta: {
        test: async ({ screen, rest }: TestingContext) => {
          const visibleContainer = await screen.findByTestId(
            /exercise-creation-form-rest-.*/i
          );

          await within(visibleContainer).findByTestId(
            `rest-second-${rest.second}`
          );
          await within(visibleContainer).findByTestId(
            `rest-minute-${rest.minute}`
          );
        },
      },

      on: {
        "User navigates back": {
          target:
            "Exercise creation form load step.User went back on this form step",
        },

        "User submitted valid rest minute and second value": {
          target: "Exercise creation form is completed",
        },
      },
    },

    "Exercise creation form is completed": {
      type: "final",
      meta: {
        test: async ({ screen }: TestingContext) => {
          await screen.findByTestId("program-builder-screen-container");
          //TODO Should make assertions on the created exercise data here too
        },
      },
    },

    "User exited exercise creation form": {
      type: "final",
      meta: {
        test: async ({ screen }: TestingContext) => {
          await screen.findByTestId("program-builder-screen-container");
          //TODO Should make assertions on the created exercise data here too
        },
      },
    },
  },
});

interface TestingContext {
  screen: ReturnType<typeof render>;
  defaultBodyBuildingProgram: Program;
  createdExerciseName: string;
  createdExerciseSetCounter: number;
  createdExerciseRepCounter: number;
  load: ExerciseLoad;
  rest: ExerciseRest;
}

const programBuilderTestModel = createModel<TestingContext>(
  programBuilderTestMachine
).withEvents({
  "User submitted empty exercise name": {
    exec: async (context) => {
      const { screen } = context;

      const visibleScreenContainer = await screen.findByTestId(
        /exercise-creation-form-name-.*/i
      );

      const emptyExerciseName = "";
      const nameTextInput = await within(
        visibleScreenContainer
      ).findByPlaceholderText(/name/i);
      context.createdExerciseName = emptyExerciseName;
      fireEvent(nameTextInput, "focus");
      fireEvent.changeText(nameTextInput, emptyExerciseName);

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
        /exercise-creation-form-name-.*/i
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
        /exercise-creation-form-set-and-rep-.*/i
      );

      const setPicker = await within(visibleScreenContainer).findByTestId(
        /set-counter.*/
      );
      fireEvent(setPicker, "focus");
      fireEvent(setPicker, "onValueChange", {
        target: {
          value: 0,
        },
      });

      const repPicker = await within(visibleScreenContainer).findByTestId(
        /rep-counter.*/
      );
      fireEvent(repPicker, "focus");
      fireEvent(repPicker, "onValueChange", {
        target: {
          value: 0,
        },
      });

      context.createdExerciseRepCounter = 0;
      context.createdExerciseSetCounter = 0;
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
        /exercise-creation-form-set-and-rep-.*/i
      );

      const newSetCounterValue = faker.datatype.number({
        min: 1,
        max: 10,
      });
      const setCounterPicker = await within(
        visibleScreenContainer
      ).findByTestId(`set-counter-${context.createdExerciseSetCounter}`);

      fireEvent(setCounterPicker, "focus");
      fireEvent(setCounterPicker, "onValueChange", {
        target: {
          value: newSetCounterValue,
        },
      });
      await within(visibleScreenContainer).findByTestId(
        `set-counter-${newSetCounterValue}`
      );
      context.createdExerciseSetCounter = newSetCounterValue;

      const newRepCounterValue = faker.datatype.number({
        min: 1,
        max: 20,
      });
      const repCounterPicker = await within(
        visibleScreenContainer
      ).findByTestId(`rep-counter-${context.createdExerciseRepCounter}`);
      fireEvent(repCounterPicker, "focus");
      fireEvent(repCounterPicker, "onValueChange", {
        target: {
          value: newRepCounterValue,
        },
      });
      await within(visibleScreenContainer).findByTestId(
        `rep-counter-${newRepCounterValue}`
      );
      context.createdExerciseRepCounter = newRepCounterValue;

      const submitButton = await within(visibleScreenContainer).findByText(
        /submit/i
      );
      fireEvent.press(submitButton);
    },
  },

  "User submitted empty load value": {
    exec: async (context) => {
      const { screen } = context;

      const visibleScreenContainer = await screen.findByTestId(
        /exercise-creation-form-load-.*/i
      );

      const newLoadValue = 0;
      context.load.value = newLoadValue;

      const loadValueInput = await within(
        visibleScreenContainer
      ).findByPlaceholderText(/Load/);
      fireEvent(loadValueInput, "focus");
      fireEvent.changeText(loadValueInput, newLoadValue);

      const submitButton = await within(visibleScreenContainer).findByText(
        /submit/i
      );
      fireEvent.press(submitButton);
    },
  },

  "User submitted valid load an load unit": {
    exec: async (context) => {
      const { screen } = context;

      const visibleScreenContainer = await screen.findByTestId(
        /exercise-creation-form-load-.*/i
      );

      const newLoadUnit = LoadUnit.Values.lbs;
      const newLoadValue = faker.datatype.number({
        min: 1,
        max: 1000,
      });
      context.load = {
        unit: newLoadUnit,
        value: newLoadValue,
      };

      const loadValueInput = await within(
        visibleScreenContainer
      ).findByPlaceholderText(/Load/);
      fireEvent(loadValueInput, "focus");
      fireEvent.changeText(loadValueInput, newLoadValue);

      const loadUnitPicker = await within(visibleScreenContainer).findByTestId(
        /load-unit-.*/
      );
      fireEvent(loadUnitPicker, "focus");
      fireEvent(loadUnitPicker, "onValueChange", {
        target: {
          value: newLoadUnit,
        },
      });

      const submitButton = await within(visibleScreenContainer).findByText(
        /submit/i
      );
      fireEvent.press(submitButton);
    },
  },

  "User submitted valid rest minute and second value": {
    exec: async (context) => {
      const { screen } = context;

      const visibleScreenContainer = await screen.findByTestId(
        /exercise-creation-form-rest-.*/i
      );

      const newMinuteValue = getRandomMinuteSecondDuration();
      const restMinuePicker = await within(visibleScreenContainer).findByTestId(
        /rest-minute-.*/
      );
      fireEvent(restMinuePicker, "focus");
      fireEvent(restMinuePicker, "onValueChange", {
        target: {
          value: newMinuteValue,
        },
      });

      const newSecondValue = getRandomMinuteSecondDuration();
      const restSecondPicker = await within(
        visibleScreenContainer
      ).findByTestId(/rest-second-.*/);
      fireEvent(restSecondPicker, "focus");
      fireEvent(restSecondPicker, "onValueChange", {
        target: {
          value: newSecondValue,
        },
      });

      const submitButton = await within(visibleScreenContainer).findByText(
        /submit/i
      );
      fireEvent.press(submitButton);

      context.rest = {
        minute: newMinuteValue,
        second: newSecondValue,
      };
    },
  },

  "User navigates back": {
    exec: async (context) => {
      userNavigatesBackFromHeaderBackButton(context.screen);
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
              RetrieveUserProgramResponseBody
            >(`${SERVER_ENDPOINT}/retrieve-program`, (_req, res, ctx) => {
              return res(ctx.status(200), ctx.json(defaultBodyBuildingProgram));
            })
          );
          const screen = renderApp();

          await screen.findByTestId("home-screen-container");
          fireEvent.press(await getProgramBuilderTabIcon(screen))
          await screen.findByTestId("program-builder-screen-container");

          const firstTrainingSessionId =
            defaultBodyBuildingProgram.sessionList[0].uuid;
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
            createdExerciseName: "",
            createdExerciseRepCounter: 0,
            createdExerciseSetCounter: 0,
            load: {
              unit: "kg",
              value: 0,
            },
            rest: {
              minute: 0,
              second: 0,
            },
          });
        }, 10_000);
      });
    });
  });

  it("should have full coverage", () => {
    return programBuilderTestModel.testCoverage();
  });
});
