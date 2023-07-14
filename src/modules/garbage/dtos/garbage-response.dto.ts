import { Category, Prisma } from "@prisma/client";

import { ResField } from "shared/decorators/dto.decorator";

export class GarbageResponseDTO {
  @ResField()
  id: number;

  @ResField()
  Category?: Category;

  @ResField()
  name: string;

  @ResField()
  price: Prisma.Decimal | null;

  @ResField()
  point: Prisma.Decimal | null;

  @ResField()
  createdAt: Date;

  @ResField()
  updatedAt: Date;
}
