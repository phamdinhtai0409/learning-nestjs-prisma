import { ResField } from "shared/decorators/dto.decorator";

export class PostalCodeResponseDTO {
  @ResField()
  code: string;

  @ResField()
  address: string;
}
