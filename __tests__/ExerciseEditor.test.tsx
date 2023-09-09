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
    new RegExp(`${exercise.set}.*${exercise.rep}`)
  );

  const editExerciseSetAndRepButton = await within(
    firstTrainingSessionFirstExerciseContainer
  ).findByTestId(`edit-exercise-set-and-rep`);

  fireEvent.press(editExerciseSetAndRepButton);

  const exerciseSetAndRepEditorScreen = await screen.findByTestId(
    `exercise-editor-form-set-and-rep-${exerciseId}`
  );

  const newsetValue = faker.datatype.number({
    min: 1,
    max: 10,
  });
  const setPicker = await within(
    exerciseSetAndRepEditorScreen
  ).findByTestId(`set-counter-${exercise.set}`);

  fireEvent(setPicker, "focus");
  fireEvent(setPicker, "onValueChange", {
    target: {
      value: newsetValue,
    },
  });

  await within(exerciseSetAndRepEditorScreen).findByTestId(
    `set-counter-${newsetValue}`
  );

  const newrepValue = faker.datatype.number({
    min: 1,
    max: 20,
  });
  const repPicker = await within(
    exerciseSetAndRepEditorScreen
  ).findByTestId(`rep-counter-${exercise.rep}`);

  fireEvent(repPicker, "focus");
  fireEvent(repPicker, "onValueChange", {
    target: {
      value: newrepValue,
    },
  });

  await within(exerciseSetAndRepEditorScreen).findByTestId(
    `rep-counter-${newrepValue}`
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
    new RegExp(`${newsetValue}.*${newrepValue}`)
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
    new RegExp(`${exercise.load}.*KG`)
  );

  const editLoadButton = await within(
    firstTrainingSessionFirstExerciseContainer
  ).findByTestId(`edit-exercise-load`);

  fireEvent.press(editLoadButton);

  const loadEditorScreenContainer = await screen.findByTestId(
    `exercise-editor-form-load-${exerciseId}`
  );

  const loadValueTextInput = await within(
    loadEditorScreenContainer
  ).findByPlaceholderText("Load");
  const newLoad = faker.datatype.number({
    min: 1,
    max: 1000,
  });
  expect(loadValueTextInput.props.value).toBe(`${exercise.load}`);

  fireEvent(loadValueTextInput, "focus");
  fireEvent.changeText(loadValueTextInput, newLoad);

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
  await within(loadContainer).findByText(new RegExp(`${newLoad}.*KG`));
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
    new RegExp(`${exercise.rest}.*seconds`)
  );

  const editRestButton = await within(
    firstTrainingSessionFirstExerciseContainer
  ).findByTestId(`edit-exercise-rest`);

  fireEvent.press(editRestButton);

  const restEditorScreenContainer = await screen.findByTestId(
    `exercise-editor-form-rest-${exerciseId}`
  );

  const minuteRestInput = await within(restEditorScreenContainer).findByTestId(
    `rest-minute-${exercise.rest}`
  );
  const newMinuteValue = faker.datatype.number({
    min: 0,
    max: 60,
  });
  fireEvent(minuteRestInput, "focus");
  fireEvent.changeText(minuteRestInput, newMinuteValue);

  const submitButton = await within(restEditorScreenContainer).findByText(
    /Submit/i
  );
  fireEvent.press(submitButton);

  await screen.findByTestId("program-builder-screen-container");

  await within(restContainer).findByText(new RegExp(`${newMinuteValue}.*seconds`));
});
