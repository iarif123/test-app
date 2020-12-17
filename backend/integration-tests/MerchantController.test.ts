import * as _ from "lodash";
import { agent, Response, SuperTest, Test } from "supertest";
import { applicationServer, database } from "../src/config";
import { Merchant } from "../src/dao/entities";
import * as TypeORM from "typeorm";
import { MerchantDto } from "../src/types";

const RUNNING_SERVER_URL = `http://localhost:${applicationServer.port}`;

describe("Merchants controller tests", () => {
  let request: SuperTest<Test>;
  let db: TypeORM.Connection;
  let repository: TypeORM.Repository<Merchant>;

  beforeAll(async () => {
    db = await TypeORM.createConnection({
      ...database,
      migrationsRun: false
    });
    repository = db.getRepository(Merchant);
    request = agent(RUNNING_SERVER_URL);
  });

  afterAll(async () => {
    db.close();
  });

  describe("GIVEN: digital merchants exist", () => {
    let response: Response;
    let responseMessage;
    const merchants: Merchant[] = _.times(4, i => {
      const merchant = new Merchant();
      merchant.id = i + 1;
      merchant.isDigital = true;
      return merchant;
    });

    beforeAll(async () => {
      await repository.save(merchants);
    });

    afterAll(async () => {
      await repository.clear();
    });

    describe("WHEN: request made to merchants endpoint", () => {
      beforeAll(async () => {
        response = await request.get(`/merchants`);
        responseMessage = JSON.parse(response.text) as MerchantDto[];
      });

      it("THEN: all the digital merchants are returned", async () => {
        expect.assertions(2);
        expect(responseMessage.length).toEqual(4);
        expect(responseMessage).toMatchObject([
          {
            id: 1
          },
          {
            id: 2
          },
          {
            id: 3
          },
          {
            id: 4
          }
        ]);
      });
    });

    describe("WHEN: request made to merchants/:id endpoint with existing merchant id", () => {
      beforeAll(async () => {
        response = await request.get(`/merchants/${1}`);
        responseMessage = JSON.parse(response.text) as MerchantDto;
      });

      it("THEN: the digital merchant is returned", async () => {
        expect(responseMessage).toMatchObject({
          id: 1
        });
      });
    });

    describe("WHEN: request made to merchants/:id endpoint with non existing merchant id", () => {
      beforeAll(async () => {
        response = await request.get(`/merchants/${5}`);
      });

      it("THEN: the digital merchant is returned", async () => {
        expect.assertions(2);
        expect(response.status).toBe(400);
        expect(response.error).toMatchObject({
          text: "Merchant with id 5 does not exist"
        });
      });
    });
  });

  describe("GIVEN: a valid merchant is provided", () => {
    let response: Response;
    let responseMessage: object;
    const merchant: Merchant = new Merchant();
    merchant.id = 123;

    beforeAll(async () => {
      await repository.save(merchant);
      response = await request.post(`/merchants/${merchant.id}`).send({
        merchantId: 123,
        isDigital: true
      });
      responseMessage = JSON.parse(response.text);
    });

    afterAll(async () => {
      await repository.clear();
    });

    describe("WHEN: request made to merchants/:id endpoint", () => {
      it("THEN: merchant is updated and a success API message is returned", async () => {
        expect.assertions(3);

        const updatedMerchant = await repository.findOneOrFail(123);

        expect(updatedMerchant).toHaveProperty("isDigital", true);
        expect(response.status).toBe(200);
        expect(responseMessage).toHaveProperty(
          "message",
          `Merchant with ${merchant.id} has been updated`
        );
      });
    });
  });

  describe("GIVEN: invalid merchant provided", () => {
    let response: Response;

    beforeAll(async () => {
      response = await request.post(`/merchants/${124}`).send({
        merchantId: 124,
        isDigital: true
      });
    });

    describe("WHEN: request made to merchants/:id endpoint", () => {
      it("THEN: it responds with an unprocessable entity error API message", () => {
        expect.assertions(2);
        expect(response.status).toBe(422);
        expect(response.error).toMatchObject({
          text: `Merchant with id ${124} does not exist`
        });
      });
    });
  });

  describe("GIVEN: request body parameters missing", () => {
    let response: Response;

    beforeAll(async () => {
      response = await request.post(`/merchants/${124}`).send({});
    });

    describe("WHEN: request made to merchants/:id endpoint", () => {
      it("THEN: it responds with an bad request error API message", () => {
        expect.assertions(2);
        expect(response.status).toBe(400);
        expect(response.error).toMatchObject({
          text: "Your request is missing parameters."
        });
      });
    });
  });

  describe("GIVEN: invalid type is sent in request body", () => {
    let response: Response;

    beforeAll(async () => {
      response = await request.post(`/merchants/${123}`).send({
        merchantId: 124,
        isDigital: "string"
      });
    });
    describe("WHEN: request made to merchants/:id endpoint", () => {
      it("THEN: it responds with an bad request error API message", () => {
        expect.assertions(2);
        expect(response.status).toBe(400);
        expect(response.error).toMatchObject({
          text: "The value of isDigital property must be of type boolean."
        });
      });
    });
  });

  describe("Given: merchant id in request and path do not match", () => {
    let response: Response;

    beforeAll(async () => {
      response = await request.post(`/merchants/${123}`).send({
        merchantId: 124,
        isDigital: true
      });
    });

    describe("WHEN: request made to merchants/:id endpoint", () => {
      it("THEN: it responds with an bad request error API message", () => {
        expect.assertions(2);
        expect(response.status).toBe(400);
        expect(response.error).toMatchObject({
          text: "Merchant id in path and request body do not match."
        });
      });
    });
  });
});
