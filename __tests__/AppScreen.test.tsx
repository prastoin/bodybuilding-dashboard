import {
  fireEvent,
  getProgramBuilderTabIcon,
  renderApp,
} from "../tests/test.utils";

test("Focused page has visible sufix in its testID", async () => {
  const screen = renderApp();

  await screen.findByTestId("home-screen-container-visible");

  const programBuilderTabIcon = await getProgramBuilderTabIcon(screen);
  fireEvent.press(programBuilderTabIcon);

  await screen.findByTestId("home-screen-container");
  await screen.findByTestId("program-builder-screen-container-visible");
});
