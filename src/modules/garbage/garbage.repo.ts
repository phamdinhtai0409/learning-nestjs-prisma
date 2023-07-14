import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { PrismaService } from "services/prisma/prisma.service";
import { Garbage } from "shared/types/entity.type";

@Injectable()
export class GarbageRepo {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.GarbageWhereUniqueInput;
    where?: Prisma.GarbageWhereInput;
    orderBy?: Prisma.GarbageOrderByWithRelationInput;
    include?: Prisma.GarbageInclude;
  }): Promise<Garbage[]> {
    const { skip, take, cursor, where, orderBy, include } = params;

    return await this.prisma.garbage.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include,
    });
  }

  async count(where?: Prisma.GarbageWhereInput): Promise<number> {
    return await this.prisma.garbage.count({ where });
  }

  async findUnique(where: Prisma.GarbageWhereUniqueInput, include?: Prisma.GarbageInclude): Promise<Garbage> {
    return await this.prisma.garbage.findUnique({
      where,
      include,
    });
  }

  async create(data: Prisma.GarbageCreateInput, include?: Prisma.GarbageInclude): Promise<Garbage> {
    return await this.prisma.garbage.create({
      data,
      include,
    });
  }

  async update(params: {
    where: Prisma.GarbageWhereUniqueInput;
    data: Prisma.GarbageUpdateInput;
    include?: Prisma.GarbageInclude;
  }): Promise<Garbage> {
    const { where, data, include } = params;

    return await this.prisma.garbage.update({ where, data, include });
  }

  async delete(id: Prisma.GarbageWhereUniqueInput, include?: Prisma.GarbageInclude): Promise<Garbage> {
    return await this.prisma.garbage.delete({
      where: id,
      include,
    });
  }
}
