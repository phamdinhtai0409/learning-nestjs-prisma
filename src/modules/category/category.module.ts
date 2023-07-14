import { Module } from "@nestjs/common";

import { CategoryController } from "modules/category/category.controller";
import { CategoryRepo } from "modules/category/category.repo";
import { CategoryService } from "modules/category/category.service";
import { PrismaModule } from "services/prisma/prisma.module";
import { PrismaService } from "services/prisma/prisma.service";

@Module({
  imports: [PrismaModule],
  controllers: [CategoryController],
  providers: [CategoryService, PrismaService, CategoryRepo],
})
export class CategoryModule {}
