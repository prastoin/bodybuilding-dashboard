import { faker } from "@faker-js/faker";
import { rest } from "msw";
import { server } from "../tests/mocks/server";
import {
  fireEvent,
  getBodyBuildingProgram,
  getProgramBuilderTabIcon,
  renderApp,
  within
} from "../tests/test.utils";
import {
  LoadUnit, RetrieveUserProgramResponseBody, SERVER_ENDPOINT
} from "../types";

test("User can edit an exercise name", async () => {
  const bodyBuildingProgram = getBodyBuildingProgram();
  server.use(
    rest.post<
      undefined,
      Record<string, never>,
      RetrieveUserProgramResponseBody
    >(`${SERVER_ENDPOINT}/retrieve-program`, (_req, res, ctx) => {
      return res(ctx.status(200), ctx.json(bodyBuildingProgram));
    })
  );

  const screen = renderApp();

  await screen.findByTestId("home-screen-container");

  const programBuilderBottomTab = await getProgramBuilderTabIcon(screen);

  fireEvent.press(programBuilderBottomTab);

  const programBuilderContainer = await screen.findByTestId(
    "program-builder-screen-container"
  );

  const exerciseId = bodyBuildingProgram.sessionList[0].exerciseList[0].uuid;
  const firstTrainingSessionFirstExerciseContainer = await within(
    programBuilderContainer
  ).findByTestId(`training-session-exercise-container-${exerciseId}`);

  const editExerciseNameButton = await within(
    firstTrainingSessionFirstExerciseContainer
  ).findByTestId(`edit-exercise-name`);

  fireEvent.press(editExerciseNameButton);

  const exerciseNameEditorScreenContainer = await screen.findByTestId(
    `exercise-editor-form-name-${exerciseId}`
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

  await screen.findByTestId("program-builder-screen-container");

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
      RetrieveUserProgramResponseBody
    >(`${SERVER_ENDPOINT}/retrieve-program`, (_req, res, ctx) => {
      return res(ctx.status(200), ctx.json(bodyBuildingProgram));
    })
  );

  const screen = renderApp();

  await screen.findByTestId("home-screen-container");

  const programBuilderBottomTab = await getProgramBuilderTabIcon(screen);

  fireEvent.press(programBuilderBottomTab);

  const programBuilderContainer = await screen.findByTestId(
    "program-builder-screen-container"
  );

  const exercise = bodyBuildingProgram.sessionList[0].exerciseList[0];
  const exerciseId = exercise.uuid;
  let firstTrainingSessionFirstExerciseContainer = await within(
    programBuilderContainer
  ).findByTestId(`training-session-exercise-container-${exerciseId}`);

  let setAndRepContainer = await within(
    firstTrainingSessionFirstExerciseContainer
  ).findByTestId("exercise-set-and-rep");
  await within(setAndRepContainer).findByText(
    new RegExp(`${exercise.setCounter}.*${exercise.repCounter}`)
  );

  const editExerciseSetAndRepButton = await within(
    firstTrainingSessionFirstExerciseContainer
  ).findByTestId(`edit-exercise-set-and-rep`);

  fireEvent.press(editExerciseSetAndRepButton);

  const exerciseSetAndRepEditorScreen = await screen.findByTestId(
    `exercise-editor-form-set-and-rep-${exerciseId}`
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

  await screen.findByTestId("program-builder-screen-container");

  firstTrainingSessionFirstExerciseContainer = await within(
    programBuilderContainer
  ).findByTestId(`training-session-exercise-container-${exerciseId}`);

  setAndRepContainer = await within(
    firstTrainingSessionFirstExerciseContainer
  ).findByTestId("exercise-set-and-rep");
  await within(setAndRepContainer).findByText(
    new RegExp(`${newSetCounterValue}.*${newRepCounterValue}`)
  );
});

test("User can edit an exercise load field", async () => {
  const bodyBuildingProgram = getBodyBuildingProgram();
  server.use(
    rest.post<
      undefined,
      Record<string, never>,
      RetrieveUserProgramResponseBody
    >(`${SERVER_ENDPOINT}/retrieve-program`, (_req, res, ctx) => {
      return res(ctx.status(200), ctx.json(bodyBuildingProgram));
    })
  );

  const screen = renderApp();

  await screen.findByTestId("home-screen-container");

  const programBuilderBottomTab = await getProgramBuilderTabIcon(screen);

  fireEvent.press(programBuilderBottomTab);

  const programBuilderContainer = await screen.findByTestId(
    "program-builder-screen-container"
  );

  const exercise = bodyBuildingProgram.sessionList[0].exerciseList[0];
  const exerciseId = exercise.uuid;
  let firstTrainingSessionFirstExerciseContainer = await within(
    programBuilderContainer
  ).findByTestId(`training-session-exercise-container-${exerciseId}`);
  let loadContainer = await within(
    firstTrainingSessionFirstExerciseContainer
  ).findByTestId(`exercise-load`);
  await within(loadContainer).findByText(
    new RegExp(`${exercise.load.value}.*${exercise.load.unit}`)
  );

  const editLoadButton = await within(
    firstTrainingSessionFirstExerciseContainer
  ).findByTestId(`edit-exercise-load`);

  fireEvent.press(editLoadButton);

  const loadEditorScreenContainer = await screen.findByTestId(
    `exercise-editor-form-load-${exerciseId}`
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

  await screen.findByTestId("program-builder-screen-container");

  firstTrainingSessionFirstExerciseContainer = await within(
    programBuilderContainer
  ).findByTestId(`training-session-exercise-container-${exerciseId}`);
  loadContainer = await within(
    firstTrainingSessionFirstExerciseContainer
  ).findByTestId(`exercise-load`);
  await within(loadContainer).findByText(new RegExp(`${newLoad}.*${newUnit}`));
});

test("User can edit an exercise rest field", async () => {
  const bodyBuildingProgram = getBodyBuildingProgram();
  server.use(
    rest.post<
      undefined,
      Record<string, never>,
      RetrieveUserProgramResponseBody
    >(`${SERVER_ENDPOINT}/retrieve-program`, (_req, res, ctx) => {
      return res(ctx.status(200), ctx.json(bodyBuildingProgram));
    })
  );

  const screen = renderApp();

  await screen.findByTestId("home-screen-container");

  const programBuilderBottomTab = await getProgramBuilderTabIcon(screen);

  fireEvent.press(programBuilderBottomTab);

  const programBuilderContainer = await screen.findByTestId(
    "program-builder-screen-container"
  );

  const exercise = bodyBuildingProgram.sessionList[0].exerciseList[0];
  const exerciseId = exercise.uuid;
  let firstTrainingSessionFirstExerciseContainer = await within(
    programBuilderContainer
  ).findByTestId(`training-session-exercise-container-${exerciseId}`);
  let restContainer = await within(
    firstTrainingSessionFirstExerciseContainer
  ).findByTestId(`exercise-rest`);
  await within(restContainer).findByText(
    new RegExp(`${exercise.rest.minute}.*min`)
  );
  await within(restContainer).findByText(
    new RegExp(`${exercise.rest.second}.*sec`)
  );

  const editRestButton = await within(
    firstTrainingSessionFirstExerciseContainer
  ).findByTestId(`edit-exercise-rest`);

  fireEvent.press(editRestButton);

  const restEditorScreenContainer = await screen.findByTestId(
    `exercise-editor-form-rest-${exerciseId}`
  );

  const minuteRestPicker = await within(restEditorScreenContainer).findByTestId(
    `rest-minute-${exercise.rest.minute}`
  );
  const newMinuteValue = faker.datatype.number({
    min: 0,
    max: 60,
  });
  fireEvent(minuteRestPicker, "focus");
  fireEvent(minuteRestPicker, "onValueChange", {
    target: {
      value: newMinuteValue,
    },
  });

  const secondRestPicker = await within(restEditorScreenContainer).findByTestId(
    `rest-second-${exercise.rest.second}`
  );
  const newSecondValue = faker.datatype.number({
    min: 0,
    max: 60,
  });
  fireEvent(secondRestPicker, "focus");
  fireEvent(secondRestPicker, "onValueChange", {
    target: {
      value: newSecondValue,
    },
  });

  const submitButton = await within(restEditorScreenContainer).findByText(
    /Submit/i
  );
  fireEvent.press(submitButton);

  await screen.findByTestId("program-builder-screen-container");

  await within(restContainer).findByText(new RegExp(`${newMinuteValue}.*min`));
  await within(restContainer).findByText(new RegExp(`${newSecondValue}.*sec`));
});
