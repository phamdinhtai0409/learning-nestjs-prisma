import { Module } from "@nestjs/common";

import { GarbageCollectionScheduleController } from "modules/garbage-collection-schedule/schedule.controller";
import { GarbageCollectionScheduleRepo } from "modules/garbage-collection-schedule/schedule.repo";
import { GarbageCollectionScheduleService } from "modules/garbage-collection-schedule/schedule.service";
import { PrismaModule } from "services/prisma/prisma.module";
import { PrismaService } from "services/prisma/prisma.service";

@Module({
  imports: [PrismaModule],
  controllers: [GarbageCollectionScheduleController],
  providers: [GarbageCollectionScheduleService, PrismaService, GarbageCollectionScheduleRepo],
  exports: [],
})
export class GarbageCollectionScheduleModule {}
