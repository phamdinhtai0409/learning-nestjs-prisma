import { Garbage as PrismaGarbage, Category as PrismaCategory } from "@prisma/client";

export type Garbage = PrismaGarbage & {
  Category?: PrismaCategory;
};
