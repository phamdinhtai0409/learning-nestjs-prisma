import { StringField } from "shared/decorators/dto.decorator";

export class PostalCodeDTO {
  @StringField()
  postalCode: string;
}
