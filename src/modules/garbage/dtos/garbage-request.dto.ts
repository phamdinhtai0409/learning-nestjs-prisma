import { ApiProperty } from "@nestjs/swagger";

import { IntField, NumberField, StringField } from "shared/decorators/dto.decorator";
import { BasePaginationRequestDTO } from "shared/dtos/base-pagination-request.dto";

export class GarbageListRequestDTO extends BasePaginationRequestDTO {
  @StringField({ optional: true })
  search: string;
}

export class CreateGarbageDTO {
  @ApiProperty()
  @IntField()
  categoryId: number;

  @ApiProperty()
  @StringField()
  name: string;

  @ApiProperty()
  @NumberField({ optional: true })
  price: number;

  @ApiProperty()
  @NumberField({ optional: true })
  point: number;
}

export class UpdateGarbageDTO {
  @ApiProperty()
  @IntField({ optional: true })
  categoryId?: number;

  @ApiProperty()
  @StringField({ optional: true })
  name: string;

  @ApiProperty()
  @NumberField({ optional: true })
  price?: number;

  @ApiProperty()
  @NumberField({ optional: true })
  point?: number;
}
