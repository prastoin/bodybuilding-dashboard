import redaxios from "redaxios";
import {
  RetrieveUserProgramResponseBody, RetrieveUserSessionTrackerHistory, SERVER_ENDPOINT, SessionTracker
} from "../types";

export async function sendRetrieveUserBodyBuildingProgram(): Promise<RetrieveUserProgramResponseBody> {
  const response = await redaxios.post(`${SERVER_ENDPOINT}/retrieve-program`);
  return RetrieveUserProgramResponseBody.parse(response.data);
}


export async function retrieveUserSessionTrackerHistory(): Promise<RetrieveUserSessionTrackerHistory> {
  const response = await redaxios.get(`${SERVER_ENDPOINT}/retrieve-program`);
  return RetrieveUserSessionTrackerHistory.parse(response.data);
}