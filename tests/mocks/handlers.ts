import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { rest } from "msw";
import {
  BodybuildingProgram,
  RetrieveUserBodyBuildingProgramResponseBody,
} from "../../types";
import { SERVER_ENDPOINT } from "../test.utils";

export const handlers = [
  // Handles a POST /login request
  rest.post(`${SERVER_ENDPOINT}/ping`, (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ answer: "pong" }));
  }),

  rest.post<
    undefined,
    Record<string, never>,
    RetrieveUserBodyBuildingProgramResponseBody
  >(`${SERVER_ENDPOINT}/retrieve-program`, (req, res, ctx) => {
    const BodybuildingProgram: BodybuildingProgram = {
      programName: "Bodybuilding Program 1",
      trainingSessions: [
        {
          uuid: uuidv4(),
          trainingSessionName: "Training session A",
          exercises: [
            {
              uuid: uuidv4(),
              exerciseName: "Exercise A1",
            },
            {
              uuid: uuidv4(),
              exerciseName: "Exercise A2",
            },
            {
              uuid: uuidv4(),
              exerciseName: "Exercise A3",
            },
          ],
        },
        {
          uuid: uuidv4(),
          trainingSessionName: "Training session B",
          exercises: [
            {
              uuid: uuidv4(),
              exerciseName: "Exercise B1",
            },
            {
              uuid: uuidv4(),
              exerciseName: "Exercise B2",
            },
          ],
        },
        {
          uuid: uuidv4(),
          trainingSessionName: "Training session C",
          exercises: [],
        },
      ],
      uuid: uuidv4(),
    };
    return res(ctx.status(200), ctx.json(BodybuildingProgram));
  }),
  // Handles a GET /user request
];
