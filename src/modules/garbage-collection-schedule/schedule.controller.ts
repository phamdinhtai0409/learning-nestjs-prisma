import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";

import { HasRoles } from "modules/auth/auth.has-roles.decorator";
import {
  ScheduleDTO,
  ScheduleListRequestDTO,
  ScheduleResponseDTO,
} from "modules/garbage-collection-schedule/schedule.dto";
import { GarbageCollectionScheduleService } from "modules/garbage-collection-schedule/schedule.service";
import { Role } from "shared/constants/global.constants";
import { IdParamDTO } from "shared/dtos/base-pagination-request.dto";
import { BasePaginationResponseDTO } from "shared/dtos/base-pagination-response.dto";

@ApiTags("garbage collection schedules")
@Controller("/garbage-collection-schedules")
export class GarbageCollectionScheduleController {
  constructor(private garbageCollectionScheduleService: GarbageCollectionScheduleService) {}

  @Get()
  @ApiOkResponse({ type: [ScheduleResponseDTO] })
  async getAll(@Query() query: ScheduleListRequestDTO) {
    return this.garbageCollectionScheduleService.findAll(query);
  }

  @Get("/count")
  @ApiOkResponse({ type: BasePaginationResponseDTO })
  async count() {
    return this.garbageCollectionScheduleService.count();
  }

  @Get("/:id")
  @ApiOkResponse({ type: ScheduleResponseDTO })
  async getById(@Param() params: IdParamDTO) {
    return this.garbageCollectionScheduleService.findById(params.id);
  }

  @Post()
  @HasRoles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOkResponse({ type: ScheduleResponseDTO })
  async create(@Body() payload: ScheduleDTO) {
    return this.garbageCollectionScheduleService.create(payload);
  }

  @Put("/:id")
  @HasRoles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOkResponse({ type: ScheduleResponseDTO })
  async update(@Param() params: IdParamDTO, @Body() payload: ScheduleDTO) {
    return this.garbageCollectionScheduleService.update(params.id, payload);
  }

  @Delete("/:id")
  @HasRoles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOkResponse({ type: ScheduleResponseDTO })
  async delete(@Param() params: IdParamDTO) {
    return this.garbageCollectionScheduleService.delete(params.id);
  }
}
