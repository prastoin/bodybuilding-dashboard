import invariant from "invariant";
import { rest } from "msw";
import { server } from "../tests/mocks/server";
import {
  fireEvent,
  getAllTrainingSessionContainer,
  getBodyBuildingProgram,
  getProgramBuilderTabIcon,
  renderApp,
  SERVER_ENDPOINT,
  waitFor,
  within,
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

test.only("User can re-enter training session editor name", async () => {
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

  await screen.findByTestId("home-screen-container-visible");

  const programBuilderBottomTab = await getProgramBuilderTabIcon(screen);

  fireEvent.press(programBuilderBottomTab);

  await screen.findByTestId("program-builder-screen-container-visible");

  const firstTrainingSession = bodyBuildingProgram.trainingSessions[0];
  const firstTrainingSessionContainer = await waitFor(
    async () =>
      await screen.findByTestId(
        `training-session-container-${firstTrainingSession.uuid}`
      )
  );

  const firstTrainingSessionName = await within(
    firstTrainingSessionContainer
  ).findByText(firstTrainingSession.trainingSessionName);
  fireEvent.press(firstTrainingSessionName);

  await screen.findByTestId(
    `training-session-editor-form-name-${firstTrainingSession.uuid}-visible`
  );

  await waitFor(() => {
    const goBackButton = screen.queryAllByTestId("go-back-button").pop();
    expect(goBackButton).toBeTruthy();

    invariant(goBackButton !== undefined, "gobackButton is undefined");
    fireEvent.press(goBackButton);
  });

  await screen.findByTestId("program-builder-screen-container-visible");

  // Hitting training session name again
  fireEvent.press(
    await within(firstTrainingSessionContainer).findByText(
      firstTrainingSession.trainingSessionName
    )
  );

  await screen.findByTestId(
    `training-session-editor-form-name-${firstTrainingSession.uuid}-visible`
  );
});
