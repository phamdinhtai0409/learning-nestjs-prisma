import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";

import { HasRoles } from "modules/auth/auth.has-roles.decorator";
import { CategoryDTO } from "modules/category/dtos/category.dto";
import { CategoryService } from "modules/category/category.service";
import { CategoryResponseDTO } from "modules/category/dtos/category-response.dto";
import { Role } from "shared/constants/global.constants";
import { BasePaginationRequestDTO, IdParamDTO } from "shared/dtos/base-pagination-request.dto";
import { BasePaginationResponseDTO } from "shared/dtos/base-pagination-response.dto";

@ApiTags("categories")
@Controller("categories")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ApiOkResponse({ type: [CategoryResponseDTO] })
  async getAll(@Query() query: BasePaginationRequestDTO): Promise<CategoryResponseDTO[]> {
    return this.categoryService.findAll(query);
  }

  @Get("/count")
  @ApiOkResponse({ type: BasePaginationResponseDTO })
  async count(): Promise<BasePaginationResponseDTO> {
    return await this.categoryService.count();
  }

  @Get(":id")
  @ApiOkResponse({ type: CategoryResponseDTO })
  async getById(@Param() params: IdParamDTO): Promise<CategoryResponseDTO> {
    return this.categoryService.findOne(params.id);
  }

  @Post()
  @HasRoles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOkResponse({ type: CategoryResponseDTO })
  async create(@Body() data: CategoryDTO): Promise<CategoryResponseDTO> {
    return await this.categoryService.create(data);
  }

  @Put(":id")
  @HasRoles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOkResponse({ type: CategoryResponseDTO })
  async update(@Param() params: IdParamDTO, @Body() updateCategory: CategoryDTO): Promise<CategoryResponseDTO> {
    return this.categoryService.update(params.id, updateCategory);
  }

  @Delete(":id")
  @HasRoles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOkResponse({ type: CategoryResponseDTO })
  async delete(@Param() params: IdParamDTO): Promise<CategoryResponseDTO> {
    return this.categoryService.delete(params.id);
  }
}
