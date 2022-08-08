import { rest } from "msw";
import { server } from "../tests/mocks/server";
import {
  fireEvent,
  getAllTrainingSessionContainer,
  getBodyBuildingProgram,
  renderApp,
  SERVER_ENDPOINT,
  waitFor,
} from "../tests/test.utils";
import { RetrieveUserBodyBuildingProgramResponseBody } from "../types";

test("On app start user program is retrieved", async () => {
  const bodyBuildingProgram = getBodyBuildingProgram();
  server.use(
    rest.post<
      undefined,
      Record<string, never>,
      RetrieveUserBodyBuildingProgramResponseBody
    >(`${SERVER_ENDPOINT}/retrieve-program`, (_req, res, ctx) => {
      return res(ctx.status(200), ctx.json(bodyBuildingProgram));
    })
  );

  const screen = renderApp();

  await screen.findByTestId(/home-screen-container/i);

  const programBuilderBottomTab = await screen.findByTestId(
    `program-builder-bottom-tab`
  );

  fireEvent.press(programBuilderBottomTab);

  await screen.findByTestId("program-builder-screen-container");

  await waitFor(() => {
    const allTrainingSessionContainer = getAllTrainingSessionContainer(screen);
    expect(allTrainingSessionContainer.length).toBe(
      bodyBuildingProgram.trainingSessions.length
    );
  });
});
