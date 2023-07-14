import { BadRequestException, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { CategoryDTO } from "modules/category/dtos/category.dto";
import { CommonHelpers } from "shared/helpers/common.helpers";
import { CategoryRepo } from "modules/category/category.repo";
import { CategoryResponseDTO } from "modules/category/dtos/category-response.dto";
import { MESSAGES } from "shared/constants/messages.constants";
import { BasePaginationRequestDTO } from "shared/dtos/base-pagination-request.dto";
import { BasePaginationResponseDTO } from "shared/dtos/base-pagination-response.dto";

@Injectable()
export class CategoryService {
  constructor(private categoryRepo: CategoryRepo) {}

  async findAll(query: BasePaginationRequestDTO): Promise<CategoryResponseDTO[] | null> {
    const { take, skip, sortByField } = CommonHelpers.transformPaginationQuery(query, Prisma.CategoryScalarFieldEnum);

    return this.categoryRepo.findAll({
      take,
      skip,
      orderBy: sortByField,
    });
  }

  async findOne(id: number): Promise<CategoryResponseDTO | null> {
    const category = await this.checkExistingCategory(id);

    return category;
  }

  async count(): Promise<BasePaginationResponseDTO> {
    const countData = await this.categoryRepo.count();

    return BasePaginationResponseDTO.convertToPaginationResponse(countData);
  }

  async create(data: CategoryDTO): Promise<CategoryResponseDTO> {
    return this.categoryRepo.create(data);
  }

  async update(id: number, data: CategoryDTO): Promise<CategoryResponseDTO> {
    const category = await this.checkExistingCategory(id);

    const updateCategory = await this.categoryRepo.update({
      where: { id: category.id },
      data,
    });

    return updateCategory;
  }

  async delete(id: number): Promise<CategoryResponseDTO> {
    const category = await this.checkExistingCategory(id);

    const deleteCategory = await this.categoryRepo.delete({ id: category.id });

    return deleteCategory;
  }

  async checkExistingCategory(id: number): Promise<CategoryResponseDTO> {
    const category = await this.categoryRepo.findOne({ id });

    if (!category) {
      throw new BadRequestException(MESSAGES.ECAT_000001);
    }

    return category;
  }
}
