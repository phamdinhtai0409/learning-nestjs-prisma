import { Module } from "@nestjs/common";

import { CategoryRepo } from "modules/category/category.repo";
import { CategoryService } from "modules/category/category.service";
import { GarbageController } from "modules/garbage/garbage.controller";
import { GarbageRepo } from "modules/garbage/garbage.repo";
import { GarbageService } from "modules/garbage/garbage.service";
import { PrismaModule } from "services/prisma/prisma.module";
import { PrismaService } from "services/prisma/prisma.service";

@Module({
  imports: [PrismaModule],
  controllers: [GarbageController],
  providers: [GarbageService, PrismaService, GarbageRepo, CategoryService, CategoryRepo],
})
export class GarbageModule {}
