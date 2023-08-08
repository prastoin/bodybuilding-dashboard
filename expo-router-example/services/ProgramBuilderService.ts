import redaxios from "redaxios";
import {
  RetrieveUserProgramResponseBody, SERVER_ENDPOINT
} from "../types";

export async function sendRetrieveUserBodyBuildingProgram(): Promise<RetrieveUserProgramResponseBody> {
  const response = await redaxios.post(`${SERVER_ENDPOINT}/retrieve-program`);
  const responseBody = response.data;
  const parsedResponseBody =
    RetrieveUserProgramResponseBody.parse(responseBody);

  return parsedResponseBody;
}
