import {
  fireEvent,
  getProgramBuilderTabIcon,
  renderApp,
  userNavigatesBackFromHeaderBackButton
} from "../tests/test.utils";

test("Focused page has visible suffix in its testID", async () => {
  const screen = renderApp();

  expect(screen.queryByTestId("program-builder-screen-container")).toBeNull();
  await screen.findByTestId("home-screen-container");

  const programBuilderTabIcon = await getProgramBuilderTabIcon(screen);
  fireEvent.press(programBuilderTabIcon);

  expect(screen.queryByTestId("home-screen-container")).toBeNull();
  await screen.findByTestId("program-builder-screen-container");
});

test("User should be able to navigate back to previous screen", async () => {
  const screen = renderApp();

  await screen.findByTestId("home-screen-container");

  const programBuilderTabIcon = await getProgramBuilderTabIcon(screen);
  fireEvent.press(programBuilderTabIcon);

  await screen.findByTestId("program-builder-screen-container");

  await screen.findByText(/default.*msw.*bodybuilding.*program/i);

  const addTrainingSessionButton = await screen.findByTestId(
    "add-training-session-button"
  );

  fireEvent.press(addTrainingSessionButton);

  await screen.findByTestId(
    "training-session-creation-form-name-step"
  );

  userNavigatesBackFromHeaderBackButton(screen);
  userNavigatesBackFromHeaderBackButton(screen);

  await screen.findByTestId("home-screen-container");
});
