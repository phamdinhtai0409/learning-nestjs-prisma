import { Module } from "@nestjs/common";
import { MiddlewareConsumer } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { MulterModule } from "@nestjs/platform-express";

import { UserModule } from "modules/user/user.module";
import { AuthModule } from "modules/auth/auth.module";
import { PrismaModule } from "services/prisma/prisma.module";
import { CategoryModule } from "modules/category/category.module";
import { GLOBAL_CONFIG } from "configs/global.config";
import { LoggerModule } from "services/logger/logger.module";
import { LoggerMiddleware } from "middlewares/logger.middleware";
import { AppService } from "modules/app/app.service";
import { AppController } from "modules/app/app.controller";
import { ErrorReportModule } from "modules/error-report/error-report.module";
import { JwtAuthGuard } from "modules/auth/auth.jwt.guard";
import { GarbageCollectionScheduleModule } from "modules/garbage-collection-schedule/schedule.module";
import { PostalCodeModule } from "modules/postal-code/postal-code.module";
import { GarbageModule } from "modules/garbage/garbage.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [() => GLOBAL_CONFIG] }),
    MulterModule.register({
      dest: "uploads/",
    }),
    LoggerModule,
    PrismaModule,
    AuthModule,
    UserModule,
    GarbageCollectionScheduleModule,
    ErrorReportModule,
    CategoryModule,
    PostalCodeModule,
    GarbageModule,
    ConfigModule.forRoot({ isGlobal: true, load: [() => GLOBAL_CONFIG] }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
