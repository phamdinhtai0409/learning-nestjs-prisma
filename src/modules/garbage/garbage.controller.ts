import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";

import { GarbageService } from "modules/garbage/garbage.service";
import { GarbageResponseDTO } from "modules/garbage/dtos/garbage-response.dto";
import { IdParamDTO } from "shared/dtos/base-pagination-request.dto";
import { BasePaginationResponseDTO } from "shared/dtos/base-pagination-response.dto";
import { GarbageListRequestDTO, CreateGarbageDTO, UpdateGarbageDTO } from "modules/garbage/dtos/garbage-request.dto";
import { HasRoles } from "modules/auth/auth.has-roles.decorator";
import { Role } from "shared/constants/global.constants";

@ApiTags("garbages")
@Controller("garbages")
export class GarbageController {
  constructor(private readonly garbageService: GarbageService) {}

  @Get()
  @ApiOkResponse({ type: [GarbageResponseDTO] })
  async getAll(@Query() query: GarbageListRequestDTO): Promise<GarbageResponseDTO[]> {
    return this.garbageService.findAll(query);
  }

  @Get("/count")
  @ApiOkResponse({ type: BasePaginationResponseDTO })
  async count(): Promise<BasePaginationResponseDTO> {
    return await this.garbageService.count();
  }

  @Get(":id")
  @ApiOkResponse({ type: GarbageResponseDTO })
  async getById(@Param() params: IdParamDTO): Promise<GarbageResponseDTO | null> {
    return this.garbageService.findOne(params.id);
  }

  @Post()
  @HasRoles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOkResponse({ type: GarbageResponseDTO })
  async create(@Body() data: CreateGarbageDTO): Promise<GarbageResponseDTO> {
    return this.garbageService.create(data);
  }

  @Put(":id")
  @HasRoles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOkResponse({ type: GarbageResponseDTO })
  async update(@Param() params: IdParamDTO, @Body() data: UpdateGarbageDTO): Promise<GarbageResponseDTO> {
    return this.garbageService.update(params.id, data);
  }

  @Delete(":id")
  @HasRoles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOkResponse({ type: GarbageResponseDTO })
  async delete(@Param() params: IdParamDTO): Promise<GarbageResponseDTO> {
    return this.garbageService.delete(params.id);
  }
}
