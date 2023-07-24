import redaxios from "redaxios";
import {
  RetrieveUserBodyBuildingProgramResponseBody,
  SERVER_ENDPOINT
} from "../types";

export async function sendRetrieveUserBodyBuildingProgram(): Promise<RetrieveUserBodyBuildingProgramResponseBody> {
  const response = await redaxios.post(`${SERVER_ENDPOINT}/retrieve-program`);
  const responseBody = response.data;
  const parsedResponseBody =
    RetrieveUserBodyBuildingProgramResponseBody.parse(responseBody);

  return parsedResponseBody;
}
