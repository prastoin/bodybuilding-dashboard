import { rest } from "msw";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import {
  RetrieveUserProgramResponseBody,
  SERVER_ENDPOINT
} from "../../types";

export const handlers = [
  // Handles a POST /login request
  rest.post(`${SERVER_ENDPOINT}/ping`, (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ answer: "pong" }));
  }),

  rest.post<
    undefined,
    Record<string, never>,
    RetrieveUserProgramResponseBody
  >(`${SERVER_ENDPOINT}/retrieve-program`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        name: "Default msw bodybuilding program",
        sessionList: [],
        uuid: uuidv4(),
      })
    );
  }),
  // Handles a GET /user request
];
