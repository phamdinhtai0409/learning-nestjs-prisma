import { Body, Controller, Post } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";

import { Role } from "shared/constants/global.constants";
import { HasRoles } from "modules/auth/auth.has-roles.decorator";
import { PostalCodeService } from "modules/postal-code/postal-code.service";
import { PostalCodeDTO } from "modules/postal-code/dtos/postal-code.dto";
import { PostalCodeResponseDTO } from "modules/postal-code/dtos/postal-code-response.dto";

@ApiTags("Postal code")
@Controller("/postal-code")
export class PostalCodeController {
  constructor(private postalCodeService: PostalCodeService) {
  }

  @Post("")
  @HasRoles(Role.PUBLIC)
  @ApiOkResponse({ type: PostalCodeResponseDTO })
  async getAddress(
    @Body() postalCodeDTO: PostalCodeDTO,
  ): Promise<PostalCodeResponseDTO> {
    return this.postalCodeService.getAddress(postalCodeDTO.postalCode);
  }
}
