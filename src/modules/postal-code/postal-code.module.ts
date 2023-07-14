import { Module } from "@nestjs/common";

import { PostalCodeController } from "modules/postal-code/postal-code.controller";
import { PostalCodeService } from "modules/postal-code/postal-code.service";

@Module({
  controllers: [PostalCodeController],
  providers: [PostalCodeService],
  exports: [PostalCodeService],
})
export class PostalCodeModule {
}
