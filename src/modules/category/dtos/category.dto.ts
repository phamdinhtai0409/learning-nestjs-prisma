import { StringField } from "shared/decorators/dto.decorator";

export class CategoryDTO {
  @StringField()
  name: string;
}

