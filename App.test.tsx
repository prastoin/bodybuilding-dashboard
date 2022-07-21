import { fireEvent, renderApp } from "./tests/test.utils";

test("Home page has a button to details page", async () => {
  const screen = renderApp();

  screen.getByText(/Home/i);
  const goToDetailsButton = screen.getByText(/Go.*Details/i);

  fireEvent.press(goToDetailsButton);

  await screen.findByText(/Details.*screen/i);
});
