import { rest } from "msw";
import { server } from "../tests/mocks/server";
import {
  fireEvent,
  getBodyBuildingProgram,
  getProgramBuilderTabIcon,
  renderApp,
  SERVER_ENDPOINT,
  within,
} from "../tests/test.utils";
import { faker } from "@faker-js/faker";
import {
  LoadUnit,
  RetrieveUserBodyBuildingProgramResponseBody,
} from "../types";

test("User can edit an exercise name", async () => {
  const bodyBuildingProgram = getBodyBuildingProgram();
  server.use(
    rest.post<
      undefined,
      Record<string, never>,
      RetrieveUserBodyBuildingProgramResponseBody
    >(`${SERVER_ENDPOINT}/retrieve-program`, (_req, res, ctx) => {
      return res(ctx.status(200), ctx.json(bodyBuildingProgram));
    })
  );

  const screen = renderApp();

  await screen.findByTestId("home-screen-container-visible");

  const programBuilderBottomTab = await getProgramBuilderTabIcon(screen);

  fireEvent.press(programBuilderBottomTab);

  const programBuilderContainer = await screen.findByTestId(
    "program-builder-screen-container-visible"
  );

  const exerciseId = bodyBuildingProgram.trainingSessions[0].exercises[0].uuid;
  const firstTrainingSessionFirstExerciseContainer = await within(
    programBuilderContainer
  ).findByTestId(`training-session-exercise-container-${exerciseId}`);

  const editExerciseNameButton = await within(
    firstTrainingSessionFirstExerciseContainer
  ).findByTestId(`edit-exercise-name`);

  fireEvent.press(editExerciseNameButton);

  const exerciseNameEditorScreenContainer = await screen.findByTestId(
    `exercise-editor-form-name-${exerciseId}-visible`
  );

  const textInput = await within(
    exerciseNameEditorScreenContainer
  ).findByPlaceholderText("Name");

  fireEvent(textInput, "focus");
  const newName = faker.name.jobTitle();
  fireEvent.changeText(textInput, newName);

  const submitButton = await within(
    exerciseNameEditorScreenContainer
  ).findByText(/submit/i);

  fireEvent.press(submitButton);

  await screen.findByTestId("program-builder-screen-container-visible");

  await within(firstTrainingSessionFirstExerciseContainer).findByText(
    new RegExp(newName)
  );
});

test("User can edit an exercise set and rep fields", async () => {
  const bodyBuildingProgram = getBodyBuildingProgram();
  server.use(
    rest.post<
      undefined,
      Record<string, never>,
      RetrieveUserBodyBuildingProgramResponseBody
    >(`${SERVER_ENDPOINT}/retrieve-program`, (_req, res, ctx) => {
      return res(ctx.status(200), ctx.json(bodyBuildingProgram));
    })
  );

  const screen = renderApp();

  await screen.findByTestId("home-screen-container-visible");

  const programBuilderBottomTab = await getProgramBuilderTabIcon(screen);

  fireEvent.press(programBuilderBottomTab);

  const programBuilderContainer = await screen.findByTestId(
    "program-builder-screen-container-visible"
  );

  const exercise = bodyBuildingProgram.trainingSessions[0].exercises[0];
  const exerciseId = exercise.uuid;
  let firstTrainingSessionFirstExerciseContainer = await within(
    programBuilderContainer
  ).findByTestId(`training-session-exercise-container-${exerciseId}`);

  await within(firstTrainingSessionFirstExerciseContainer).findByText(
    new RegExp(`${exercise.setCounter}.*${exercise.repCounter}`)
  );

  const editExerciseSetAndRepButton = await within(
    firstTrainingSessionFirstExerciseContainer
  ).findByTestId(`edit-exercise-set-and-rep`);

  fireEvent.press(editExerciseSetAndRepButton);

  const exerciseSetAndRepEditorScreen = await screen.findByTestId(
    `exercise-editor-form-set-and-rep-${exerciseId}-visible`
  );

  const newSetCounterValue = faker.datatype.number({
    min: 1,
    max: 10,
  });
  const setCounterPicker = await within(
    exerciseSetAndRepEditorScreen
  ).findByTestId(`set-counter-${exercise.setCounter}`);

  fireEvent(setCounterPicker, "focus");
  fireEvent(setCounterPicker, "onValueChange", {
    target: {
      value: newSetCounterValue,
    },
  });

  await within(exerciseSetAndRepEditorScreen).findByTestId(
    `set-counter-${newSetCounterValue}`
  );

  const newRepCounterValue = faker.datatype.number({
    min: 1,
    max: 20,
  });
  const repCounterPicker = await within(
    exerciseSetAndRepEditorScreen
  ).findByTestId(`rep-counter-${exercise.repCounter}`);

  fireEvent(repCounterPicker, "focus");
  fireEvent(repCounterPicker, "onValueChange", {
    target: {
      value: newRepCounterValue,
    },
  });

  await within(exerciseSetAndRepEditorScreen).findByTestId(
    `rep-counter-${newRepCounterValue}`
  );

  const submitButton = await within(exerciseSetAndRepEditorScreen).findByText(
    /submit/i
  );
  fireEvent.press(submitButton);

  await screen.findByTestId("program-builder-screen-container-visible");

  firstTrainingSessionFirstExerciseContainer = await within(
    programBuilderContainer
  ).findByTestId(`training-session-exercise-container-${exerciseId}`);

  await within(firstTrainingSessionFirstExerciseContainer).findByText(
    new RegExp(`${newSetCounterValue}.*${newRepCounterValue}`)
  );
});

test("User can edit an exercise load field", async () => {
  const bodyBuildingProgram = getBodyBuildingProgram();
  server.use(
    rest.post<
      undefined,
      Record<string, never>,
      RetrieveUserBodyBuildingProgramResponseBody
    >(`${SERVER_ENDPOINT}/retrieve-program`, (_req, res, ctx) => {
      return res(ctx.status(200), ctx.json(bodyBuildingProgram));
    })
  );

  const screen = renderApp();

  await screen.findByTestId("home-screen-container-visible");

  const programBuilderBottomTab = await getProgramBuilderTabIcon(screen);

  fireEvent.press(programBuilderBottomTab);

  const programBuilderContainer = await screen.findByTestId(
    "program-builder-screen-container-visible"
  );

  const exercise = bodyBuildingProgram.trainingSessions[0].exercises[0];
  const exerciseId = exercise.uuid;
  let firstTrainingSessionFirstExerciseContainer = await within(
    programBuilderContainer
  ).findByTestId(`training-session-exercise-container-${exerciseId}`);

  await within(firstTrainingSessionFirstExerciseContainer).findByText(
    new RegExp(`${exercise.load.value}.*${exercise.load.unit}`)
  );

  const editLoadButton = await within(
    firstTrainingSessionFirstExerciseContainer
  ).findByTestId(`edit-exercise-load`);

  fireEvent.press(editLoadButton);

  const loadEditorScreenContainer = await screen.findByTestId(
    `exercise-editor-form-load-${exerciseId}-visible`
  );

  const laodValueTextInput = await within(
    loadEditorScreenContainer
  ).findByPlaceholderText("Load");
  const newLoad = faker.datatype.number({
    min: 1,
    max: 1000,
  });
  expect(laodValueTextInput.props.value).toBe(`${exercise.load.value}`);

  fireEvent(laodValueTextInput, "focus");
  fireEvent.changeText(laodValueTextInput, newLoad);

  const unitPicker = await within(loadEditorScreenContainer).findByTestId(
    `load-unit-${exercise.load.unit}`
  );
  const newUnit = LoadUnit.Values.lbs;
  fireEvent(unitPicker, "focus");
  fireEvent(unitPicker, "onValueChange", {
    target: {
      value: newUnit,
    },
  });
  await within(loadEditorScreenContainer).findByTestId(`load-unit-${newUnit}`);

  const submitButton = await within(loadEditorScreenContainer).findByText(
    /submit/i
  );
  fireEvent.press(submitButton);

  await screen.findByTestId("program-builder-screen-container-visible");

  firstTrainingSessionFirstExerciseContainer = await within(
    programBuilderContainer
  ).findByTestId(`training-session-exercise-container-${exerciseId}`);

  await within(firstTrainingSessionFirstExerciseContainer).findByText(
    new RegExp(`${newLoad}.*${newUnit}`)
  );
});
