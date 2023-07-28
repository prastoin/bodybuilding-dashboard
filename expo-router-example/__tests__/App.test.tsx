import { renderApp } from "../tests/test.utils";

test("Home page is the app landing page", async () => {
  const screen = renderApp();
  await screen.findByTestId("home-screen-container-visible");
});
