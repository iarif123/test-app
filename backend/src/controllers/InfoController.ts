import { Controller, Get } from "@tsed/common";
import { commitHash } from "../config";

@Controller("")
export class InfoController {
  @Get("/whoami")
  public whoAmI(): any {
    return {
      message: "I am test-app-backend",
      commit: commitHash
    };
  }
}
