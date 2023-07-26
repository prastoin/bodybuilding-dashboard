import { renderApp } from "../tests/test.utils";

test("Home page is the app landing page", async () => {
  const screen = renderApp();
  console.log(screen.debug())
  await screen.findByTestId("home-screen-container-visible");
});
