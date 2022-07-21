import { fireEvent, renderApp } from "../tests/test.utils";

test("User goes to program builder screen from home", async () => {
  const screen = renderApp();

  const goToProgramBuilderButton = screen.getByText(/.*Program.*Builder.*/i);
  fireEvent.press(goToProgramBuilderButton);
  screen.findByTestId(`program-builder-screen-container`);
});
