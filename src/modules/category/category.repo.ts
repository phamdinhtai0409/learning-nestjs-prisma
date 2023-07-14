import { Prisma, Category } from "@prisma/client";
import { Injectable } from "@nestjs/common";

import { PrismaService } from "services/prisma/prisma.service";
import { CategoryResponseDTO } from "modules/category/dtos/category-response.dto";

@Injectable()
export class CategoryRepo {
  constructor(private prisma: PrismaService) {}

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.CategoryWhereUniqueInput;
    where?: Prisma.CategoryWhereInput;
    orderBy?: Prisma.CategoryOrderByWithRelationInput;
  }): Promise<CategoryResponseDTO[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.category.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async findOne(id: Prisma.CategoryWhereUniqueInput): Promise<Category> {
    return this.prisma.category.findUnique({
      where: id,
    });
  }

  async count(where?: Prisma.CategoryWhereInput): Promise<number> {
    return this.prisma.category.count({ where });
  }

  async create(data: Prisma.CategoryCreateInput): Promise<Category> {
    return this.prisma.category.create({
      data,
    });
  }

  async update(params: { where: Prisma.CategoryWhereUniqueInput;data: Prisma.CategoryUpdateInput }): Promise<Category> {
    const { where, data } = params;
    return this.prisma.category.update({
      where,
      data,
    });
  }

  async delete(id: Prisma.CategoryWhereUniqueInput): Promise<Category> {
    return this.prisma.category.delete({
      where: id,
    });
  }
}
