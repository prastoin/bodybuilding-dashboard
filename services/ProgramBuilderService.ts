import { faker } from "@faker-js/faker";
import redaxios from "redaxios";
import {
  ExerciseTracker,
  Program,
  RetrieveUserProgramResponseBody, RetrieveUserSessionTrackerHistory, SERVER_ENDPOINT, SessionTracker, SetTracker
} from "../types";

const sessionIdList = Array.from({ length: 3 }, () => faker.string.uuid())

export const getBodyBuildingProgram = (): Program => {
  return {
    name: faker.person.jobDescriptor(),
    sessionList: [
      {
        uuid: sessionIdList[0],
        name: faker.person.jobArea(),
        exerciseList: [
          {
            uuid: faker.string.uuid(),
            name: faker.person.jobTitle(),
            rep: faker.datatype.number({
              max: 20,
              min: 1,
            }),
            set: faker.datatype.number({
              max: 10,
              min: 1,
            }),
            load: faker.number.int({ min: 0, max: 100 }),
            rest: faker.number.int({ min: 0, max: 300 })
          },
          {
            uuid: faker.string.uuid(),
            name: faker.person.jobTitle(),
            rep: faker.datatype.number({
              max: 20,
              min: 1,
            }),
            set: faker.datatype.number({
              max: 10,
              min: 1,
            }),
            load: faker.number.int({ min: 0, max: 100 }),
            rest: faker.number.int({ min: 0, max: 300 })
          },
          {
            uuid: faker.string.uuid(),
            name: faker.person.jobTitle(),
            rep: faker.datatype.number({
              max: 20,
              min: 1,
            }),
            set: faker.datatype.number({
              max: 10,
              min: 1,
            }),
            load: faker.number.int({ min: 0, max: 100 }),
            rest: faker.number.int({ min: 0, max: 300 })
          },
        ],
      },
      {
        uuid: sessionIdList[1],
        name: faker.person.jobArea(),
        exerciseList: [
          {
            uuid: faker.string.uuid(),
            name: faker.person.jobTitle(),
            rep: faker.datatype.number({
              max: 20,
              min: 1,
            }),
            set: faker.datatype.number({
              max: 10,
              min: 1,
            }),
            load: faker.number.int({ min: 0, max: 100 }),
            rest: faker.number.int({ min: 0, max: 300 })
          },
          {
            uuid: faker.string.uuid(),
            name: faker.person.jobTitle(),
            rep: faker.datatype.number({
              max: 20,
              min: 1,
            }),
            set: faker.datatype.number({
              max: 10,
              min: 1,
            }),
            load: faker.number.int({ min: 0, max: 100 }),
            rest: faker.number.int({ min: 0, max: 300 })
          },
        ],
      },
      {
        uuid: sessionIdList[2],
        name: faker.person.jobArea(),
        exerciseList: [],
      },
    ],
    uuid: faker.string.uuid(),
  };
};

function getSetTracker(index: number): SetTracker {
  return {
    index,
    load: faker.number.int({
      max: 100,
      min: 10,
    }),
    rep: faker.number.int({
      max: 100,
      min: 10,
    }),
    rest: faker.number.int({
      max: 100,
      min: 10,
    }),
    rir: faker.number.int({
      max: 100,
      min: 10,
    })
  }
}

function getExerciseTracker(exerciseId: string): ExerciseTracker {
  const setList = Array.from({ length: 4 }, (_value, index) => getSetTracker(index))

  return {
    exerciseId,
    expectedMetrics: {
      rep: faker.number.int({
        max: 20,
        min: 1,
      }),
      set: faker.number.int({
        max: 10,
        min: 1,
      }),
      load: 120,
      rest: 230,
    },
    name: faker.person.firstName(),
    setList
  }
}

function getSessionTracker(): SessionTracker {
  return {
    createdOn: faker.number.int(),
    exerciseTrackerList: [getExerciseTracker(faker.string.uuid())],
    name: faker.word.words(2),
    sessionId: sessionIdList[0],
    uuid: faker.string.uuid(),
  }
}

export async function sendRetrieveUserBodyBuildingProgram(): Promise<RetrieveUserProgramResponseBody> {
  const response = await redaxios.post(`${SERVER_ENDPOINT}/retrieve-program`);
  return RetrieveUserProgramResponseBody.parse(response.data);
  // return getBodyBuildingProgram()
}

export async function retrieveUserSessionTrackerHistory(): Promise<RetrieveUserSessionTrackerHistory> {
  // return [getSessionTracker()];
  const response = await redaxios.get(`${SERVER_ENDPOINT}/retrieve-program`);
  return RetrieveUserSessionTrackerHistory.parse(response.data);
}