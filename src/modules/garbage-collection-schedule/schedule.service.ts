import { BadRequestException, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { plainToInstance } from "class-transformer";
import _ from "lodash";

import {
  ScheduleDTO,
  ScheduleListRequestDTO,
  ScheduleResponseDTO,
} from "modules/garbage-collection-schedule/schedule.dto";
import { GarbageCollectionScheduleRepo } from "modules/garbage-collection-schedule/schedule.repo";
import { MESSAGES } from "shared/constants/messages.constants";
import { BasePaginationResponseDTO } from "shared/dtos/base-pagination-response.dto";
import { CommonHelpers } from "shared/helpers/common.helpers";
import { checkIsOverlapRangeDates, newDateKeepLocalTime } from "shared/helpers/date-time.helpers";

@Injectable()
export class GarbageCollectionScheduleService {
  constructor(private garbageCollectionScheduleRepo: GarbageCollectionScheduleRepo) {}

  async findById(id: number) {
    const schedule = await this.checkExistingScheduleById(id);
    return plainToInstance(ScheduleResponseDTO, schedule, { excludeExtraneousValues: true });
  }

  async findAll(query: ScheduleListRequestDTO) {
    const { take, skip } = CommonHelpers.transformPaginationQuery(query);
    const filters: Prisma.GarbageCollectionScheduleWhereInput = {
      dateFrom: {
        gte: newDateKeepLocalTime(query.dateFrom) || undefined,
      },
    };

    const data = await this.garbageCollectionScheduleRepo.findAll({
      take,
      skip,
      where: filters,
      orderBy: { dateFrom: "asc" }, // todo: implement when has specific requirement
    });

    return data;
  }

  async count(): Promise<BasePaginationResponseDTO> {
    const total = await this.garbageCollectionScheduleRepo.count();
    return BasePaginationResponseDTO.convertToPaginationResponse(total);
  }

  async create(data: ScheduleDTO) {
    const schedule = _.mapValues(data, (value) => newDateKeepLocalTime(value));

    const schedules = await this.garbageCollectionScheduleRepo.findAll({
      where: { dateTo: { gte: schedule.dateFrom } },
    });

    const isValid = checkIsOverlapRangeDates(schedule, schedules);
    if (!isValid) {
      throw new BadRequestException(MESSAGES.EGCS_0000002);
    }

    return this.garbageCollectionScheduleRepo.create(schedule);
  }

  async update(id: number, data: ScheduleDTO) {
    await this.checkExistingScheduleById(id);

    const schedule = _.mapValues(data, (value) => newDateKeepLocalTime(value));

    const schedules = await this.garbageCollectionScheduleRepo.findAll({
      where: {
        id: { not: id },
        dateTo: { gte: schedule.dateFrom },
      },
    });

    const isValid = checkIsOverlapRangeDates(schedule, schedules);
    if (!isValid) {
      throw new BadRequestException(MESSAGES.EGCS_0000002);
    }

    return this.garbageCollectionScheduleRepo.update({
      where: { id },
      data: schedule,
    });
  }

  async delete(id: number) {
    await this.checkExistingScheduleById(id);
    return this.garbageCollectionScheduleRepo.delete({ id });
  }

  async checkExistingScheduleById(id: number) {
    const schedule = await this.garbageCollectionScheduleRepo.findUnique({ id });

    if (!schedule) {
      throw new BadRequestException(MESSAGES.EGCS_0000001);
    }

    return schedule;
  }
}
