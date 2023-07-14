import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMinSize, ValidateNested } from "class-validator";

import { DateToValidation } from "shared/decorators/date-to-validation.decorator";
import { DateStringField, ResField } from "shared/decorators/dto.decorator";
import { BasePaginationRequestDTO } from "shared/dtos/base-pagination-request.dto";

export class ScheduleDTO {
  @ApiProperty({
    example: "2023-01-01",
    required: true,
  })
  @DateStringField()
  dateFrom: string;

  @ApiProperty({
    example: "2023-01-01",
    required: true,
  })
  @DateStringField()
  @DateToValidation("dateFrom")
  dateTo: string;
}

export class CreateSchedulesDTO {
  @ApiProperty({ type: [ScheduleDTO] })
  @Type(() => ScheduleDTO)
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  schedules: ScheduleDTO[];
}

export class ScheduleResponseDTO {
  @ResField()
  id: number;

  @ResField()
  dateFrom: string;

  @ResField()
  dateTo: string;

  @ResField()
  createdAt: string;

  @ResField()
  updatedAt: string;
}

export class ScheduleListRequestDTO extends BasePaginationRequestDTO {
  @DateStringField({ optional: true })
  @ApiProperty({
    required: false,
  })
  dateFrom: string;
}
