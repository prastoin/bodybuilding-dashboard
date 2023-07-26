import { renderApp } from "../tests/test.utils";

test("Home page is the app landing page", async () => {
  console.log("salut")
  const screen = renderApp();
  console.log(screen.debug())
  await screen.findByTestId("home-screen-container-visible");
});
