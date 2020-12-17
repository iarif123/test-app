import { Logger } from "node-logger";
import {
  Controller,
  Get,
  PathParams,
  Post,
  BodyParams,
  Res
} from "@tsed/common";
import {
  BadRequest,
  InternalServerError,
  UnprocessableEntity
} from "ts-httpexceptions";
import * as _ from "lodash";
import { getRepository } from "typeorm";
import { Merchant } from "../dao/entities";
import { MerchantDto } from "../types";

@Controller("/merchants")
export class MerchantController {
  private logger = new Logger("merchant-endpoint-logger");

  @Get("/")
  public async getMerchants(): Promise<MerchantDto[]> {
    const repository = getRepository(Merchant);

    const merchants = await repository.find();

    return merchants.map(merchant => {
      return {
        id: merchant.id,
        name: merchant.name
      };
    });
  }

  @Get("/:id")
  public async getMerchant(@PathParams("id") id: number): Promise<MerchantDto> {
    const repository = getRepository(Merchant);
    let merchant: Merchant;

    try {
      merchant = await repository.findOneOrFail(id);
    } catch (error) {
      this.logger.error(`Merchant with id ${id} does not exist`, error);

      throw new BadRequest(`Merchant with id ${id} does not exist`);
    }

    return {
      id: merchant.id,
      name: merchant.name
    };
  }

  @Post("/:id")
  public async updateMerchant(
    @PathParams("id") id: number,
    @BodyParams() body: any
  ): Promise<any> {
    const { merchantId, isDigital } = body;
    const repository = getRepository(Merchant);
    let merchant: Merchant;

    if (_.isNil(isDigital) || _.isNil(merchantId)) {
      throw new BadRequest("Your request is missing parameters.");
    }

    if (!_.isBoolean(isDigital)) {
      throw new BadRequest(
        "The value of isDigital property must be of type boolean."
      );
    }

    if (id !== merchantId) {
      throw new BadRequest(
        "Merchant id in path and request body do not match."
      );
    }

    try {
      merchant = await repository.findOneOrFail(merchantId);
    } catch (error) {
      this.logger.error(`Merchant with id ${merchantId} does not exist`, error);

      throw new UnprocessableEntity(
        `Merchant with id ${merchantId} does not exist`
      );
    }

    try {
      merchant.isDigital = isDigital;
      await repository.save(merchant);
    } catch (error) {
      this.logger.error(
        `Error trying to save merchant with id ${merchantId}`,
        error
      );

      throw new InternalServerError(
        `Error trying to save merchant with id ${merchantId}: ${error.message}`
      );
    }

    this.logger.info(`Merchant with ${merchantId} has been updated`);

    return {
      message: `Merchant with ${merchantId} has been updated`,
      data: merchant
    };
  }
}
