import supertest from "supertest";
import { SERVER_ENDPOINT } from "../tests/test.utils";

test("allows user to log in", async () => {
  await supertest(SERVER_ENDPOINT)
    .post("/ping")
    .expect("Content-Type", /json/)
    .expect(200, {
      answer: "pong",
    });
});
