import {
  fireEvent,
  getProgramBuilderTabIcon,
  renderApp
} from "../tests/test.utils";

test("Focused page has visible suffix in its testID", async () => {
  const screen = renderApp();

  expect(screen.queryByTestId("program-builder-screen-container")).toBeNull();
  await screen.findByTestId("home-screen-container-visible");

  const programBuilderTabIcon = await getProgramBuilderTabIcon(screen);
  fireEvent.press(programBuilderTabIcon);

  expect(screen.queryByTestId("home-screen-container")).toBeNull();
  await screen.findByTestId("program-builder-screen-container-visible");
});
