import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { PrismaService } from "services/prisma/prisma.service";

@Injectable()
export class GarbageCollectionScheduleRepo {
  constructor(private prisma: PrismaService) {}

  async findUnique(scheduleWhereUniqueInput: Prisma.GarbageCollectionScheduleWhereUniqueInput) {
    return this.prisma.garbageCollectionSchedule.findUnique({
      where: scheduleWhereUniqueInput,
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.GarbageCollectionScheduleWhereUniqueInput;
    where?: Prisma.GarbageCollectionScheduleWhereInput;
    orderBy?: Prisma.GarbageCollectionScheduleOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.garbageCollectionSchedule.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async create(data: Prisma.GarbageCollectionScheduleCreateInput) {
    return this.prisma.garbageCollectionSchedule.create({
      data,
    });
  }

  async update(params: {
    where: Prisma.GarbageCollectionScheduleWhereUniqueInput;
    data: Prisma.GarbageCollectionScheduleUpdateInput;
  }) {
    const { where, data } = params;
    return this.prisma.garbageCollectionSchedule.update({
      data,
      where,
    });
  }

  async delete(where: Prisma.GarbageCollectionScheduleWhereUniqueInput) {
    return this.prisma.garbageCollectionSchedule.delete({
      where,
    });
  }

  async count(where?: Prisma.GarbageCollectionScheduleWhereInput): Promise<number> {
    return this.prisma.garbageCollectionSchedule.count({ where });
  }
}
