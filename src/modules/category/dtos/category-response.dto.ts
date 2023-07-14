import { ResField } from "shared/decorators/dto.decorator";

export class CategoryResponseDTO {
  @ResField()
  id: number;

  @ResField()
  name: string;

  @ResField()
  createdAt: Date;

  @ResField()
  updatedAt: Date;
}

