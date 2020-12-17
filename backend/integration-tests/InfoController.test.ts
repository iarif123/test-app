import { agent, Response, SuperTest, Test } from "supertest";
import * as Config from "../src/config";

const RUNNING_SERVER_URL = `http://localhost:${Config.applicationServer.port}`;

describe("Health Tests", () => {
  describe("GIVEN: the AppServer is up AND running", () => {
    let request: SuperTest<Test>;
    beforeAll(() => {
      request = agent(RUNNING_SERVER_URL);
    });

    describe("WHEN: pinging the Server", () => {
      let response: Response;
      let responseMessage: object;
      beforeAll(async () => {
        response = await request.get("/whoami");
        responseMessage = JSON.parse(response.text);
      });

      it("THEN: it responds with a success API message", () => {
        expect(response.status).toBe(200);
        expect(responseMessage).toHaveProperty(
          "message",
          "I am test-app-backend"
        );
      });
    });

    describe("WHEN: requesting an inexisting route", () => {
      let response: Response;
      beforeAll(async () => {
        response = await request.get("/inexistingRoute");
      });

      it("THEN: it responds with an error API message", () => {
        expect(response.status).toBe(404);
        expect(response.error).toMatchObject({
          message: "cannot GET /inexistingRoute (404)"
        });
      });
    });
  });
});
