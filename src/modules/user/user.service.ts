import { Prisma, Role, User } from "@prisma/client";
import { BadRequestException, Injectable } from "@nestjs/common";
import { plainToInstance } from "class-transformer";

import { UserRepo } from "modules/user/user.repo";
import { CommonHelpers } from "shared/helpers/common.helpers";
import { MESSAGES } from "shared/constants/messages.constants";
import { RegisterUserDTO } from "modules/auth/auth.dto";
import { AuthHelpers } from "shared/helpers/auth.helpers";
import { MailService } from "services/mail/mail.service";
import { GLOBAL_CONFIG } from "configs/global.config";
import { MAIL_TEMPLATES } from "services/mail/mail.constants";
import { BasePaginationResponseDTO } from "shared/dtos/base-pagination-response.dto";

import { UserListRequestDTO, UserUpdateRequestDTO } from "./dtos/user-request.dto";
import { UserDetailResponseDTO, UserListResponseDTO } from "./dtos/user-response.dto";

@Injectable()
export class UserService {
  constructor(private userRepo: UserRepo, private mailService: MailService) {}

  async findOne(userWhereUniqueInput: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return this.userRepo.findOne(userWhereUniqueInput);
  }

  async findById(id: number): Promise<UserDetailResponseDTO> {
    const user = await this.checkExistingUserById(id);

    return plainToInstance(UserDetailResponseDTO, user, { excludeExtraneousValues: true });
  }

  async findFirst(where: Prisma.UserWhereInput): Promise<User | null> {
    return this.userRepo.findFirst(where);
  }

  async findAll(query: UserListRequestDTO): Promise<UserListResponseDTO[]> {
    const { take, skip, sortByField } = CommonHelpers.transformPaginationQuery(query, Prisma.UserScalarFieldEnum);
    const filters: Prisma.Enumerable<Prisma.UserWhereInput> = [
      {
        name: {
          contains: query.search || undefined,
          mode: "insensitive",
        },
      },
      {
        furiganaName: {
          contains: query.search || undefined,
          mode: "insensitive",
        },
      },
    ];

    const data = await this.userRepo.findAll({
      take,
      skip,
      where: {
        role: Role.User,
        OR: query.search ? filters : undefined,
      },
      orderBy: sortByField,
    });

    const userList = plainToInstance(UserListResponseDTO, data, { excludeExtraneousValues: true });

    return userList;
  }

  async count(): Promise<BasePaginationResponseDTO> {
    const countData = await this.userRepo.count({ role: Role.User });

    return BasePaginationResponseDTO.convertToPaginationResponse(countData);
  }

  async create(user: RegisterUserDTO, isSystem: boolean): Promise<User> {
    if (await this.isExistingEmail(user.email)) {
      throw new BadRequestException(MESSAGES.EU_0000002);
    }

    if (await this.isExistingPhone(user.phone)) {
      throw new BadRequestException(MESSAGES.EU_0000007);
    }

    const token = AuthHelpers.generateToken();
    const newUser = {
      ...user,
      token,
      emailVerifiedAt: isSystem ? new Date() : undefined,
    };

    const createdUser = await this.userRepo.create(newUser);

    if (!isSystem) {
      this.mailService.sendEmail(user.email, MAIL_TEMPLATES.VERIFY_ACCOUNT, {
        name: user.name,
        link: `${GLOBAL_CONFIG.external.frontend_url}/verify/${token}`,
      });
    }

    return createdUser;
  }

  async update(params: { where: Prisma.UserWhereUniqueInput; data: Prisma.UserUpdateInput }): Promise<User> {
    const { where, data } = params;
    return this.userRepo.update({
      data,
      where,
    });
  }

  async updateUserById(id: number, data: UserUpdateRequestDTO): Promise<User> {
    const user = await this.checkExistingUserById(id);

    const existingEmailUser = await this.userRepo.findFirst({
      AND: [
        {
          NOT: {
            id: user.id,
          },
        },
        {
          email: data.email,
        },
      ],
    });

    if (existingEmailUser) {
      throw new BadRequestException(MESSAGES.EU_0000002);
    }

    const existingPhoneUser = await this.userRepo.findFirst({
      AND: [
        {
          NOT: {
            id: user.id,
          },
        },
        {
          phone: data.phone,
        },
      ],
    });

    if (existingPhoneUser) {
      throw new BadRequestException(MESSAGES.EU_0000007);
    }

    return this.update({ where: { id: user.id }, data: data });
  }

  async delete(id: number): Promise<void> {
    const user = await this.checkExistingUserById(id);

    await this.userRepo.delete({ id: user.id });
  }

  private async checkExistingUserById(id: number): Promise<User> {
    const user = await this.findOne({ id });

    if (!user) {
      throw new BadRequestException(MESSAGES.EU_0000015);
    }

    return user;
  }

  async isExistingEmail(email: string): Promise<boolean> {
    const user = await this.findOne({ email });
    return !!user;
  }

  async isExistingPhone(phone: string): Promise<boolean> {
    const user = await this.findOne({ phone });
    return !!user;
  }

  async isExistingToken(token: string): Promise<boolean> {
    const user = await this.findOne({ token });
    return !!user;
  }
}
