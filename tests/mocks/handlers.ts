import { rest } from "msw";
import { SERVER_ENDPOINT } from "../test.utils";

export const handlers = [
  // Handles a POST /login request
  rest.post(`${SERVER_ENDPOINT}/ping`, (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ answer: "pong" }));
  }),
  // Handles a GET /user request
];
