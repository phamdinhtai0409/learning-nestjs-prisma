import { BadRequestException, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { CategoryService } from "modules/category/category.service";
import { GarbageListRequestDTO, CreateGarbageDTO, UpdateGarbageDTO } from "modules/garbage/dtos/garbage-request.dto";
import { GarbageResponseDTO } from "modules/garbage/dtos/garbage-response.dto";
import { GarbageRepo } from "modules/garbage/garbage.repo";
import { MESSAGES } from "shared/constants/messages.constants";
import { BasePaginationResponseDTO } from "shared/dtos/base-pagination-response.dto";
import { CommonHelpers } from "shared/helpers/common.helpers";
import { Garbage } from "shared/types/entity.type";

@Injectable()
export class GarbageService {
  constructor(private readonly garbageRepo: GarbageRepo, private readonly categoryService: CategoryService) {}

  async findAll(query: GarbageListRequestDTO): Promise<GarbageResponseDTO[]> {
    const { take, skip, sortByField } = CommonHelpers.transformPaginationQuery(query, Prisma.GarbageScalarFieldEnum);

    const filters: Prisma.Enumerable<Prisma.GarbageWhereInput> = [
      {
        name: {
          contains: query.search || undefined,
          mode: "insensitive",
        },
      },
    ];

    const garbages = await this.garbageRepo.findAll({
      take,
      skip,
      where: {
        OR: query.search ? filters : undefined,
      },
      orderBy: sortByField,
      include: { Category: true },
    });

    return garbages;
  }

  async count(): Promise<BasePaginationResponseDTO> {
    const total = await this.garbageRepo.count();

    return BasePaginationResponseDTO.convertToPaginationResponse(total);
  }

  async findOne(id: number): Promise<Garbage> {
    const checkExistingGarbage = await this.checkExistingGarbage(id);

    const garbage = await this.garbageRepo.findUnique({ id: checkExistingGarbage.id }, { Category: true });

    return garbage;
  }

  async create(data: CreateGarbageDTO): Promise<Garbage> {
    await this.categoryService.checkExistingCategory(data.categoryId);

    const garbage = await this.garbageRepo.create(data, { Category: true });

    return garbage;
  }

  async update(id: number, data: UpdateGarbageDTO): Promise<Garbage> {
    const garbage = await this.checkExistingGarbage(id);

    if (data.categoryId) {
      await this.categoryService.checkExistingCategory(data.categoryId);
    }

    return this.garbageRepo.update({ where: { id: garbage.id }, data, include: { Category: true } });
  }

  async delete(id: number): Promise<Garbage> {
    const garbage = await this.checkExistingGarbage(id);

    return this.garbageRepo.delete({ id: garbage.id });
  }

  private async checkExistingGarbage(id: number, include?: Prisma.GarbageInclude): Promise<Garbage> {
    const garbage = await this.garbageRepo.findUnique({ id }, include);

    if (!garbage) {
      throw new BadRequestException(MESSAGES.EGAR_0000001);
    }

    return garbage;
  }
}
