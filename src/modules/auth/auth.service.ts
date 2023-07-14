import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Role, User } from "@prisma/client";

import { MESSAGES } from "shared/constants/messages.constants";
import { UserService } from "modules/user/user.service";
import { PrismaService } from "services/prisma/prisma.service";
import { AuthHelpers } from "shared/helpers/auth.helpers";
import { GLOBAL_CONFIG } from "configs/global.config";
import { MailService } from "services/mail/mail.service";
import { MAIL_TEMPLATES } from "services/mail/mail.constants";
import {
  AdminResetPasswordDTO,
  AuthResponseDTO,
  ForgotPasswordDTO,
  LoginDTO,
  UserResetPasswordDTO,
} from "modules/auth/auth.dto";
import { MINUTE } from "shared/constants/time.constants";
import { SMSService } from "services/sms/sms.service";
import { PhoneVerificationRepo } from "modules/phone-verification/phone-verification.repo";
import { CommonHelpers } from "shared/helpers/common.helpers";

import { PhoneDTO, RegisterUserDTO, VerifyPhoneDTO } from "./auth.dto";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private phoneVerificationRepo: PhoneVerificationRepo,
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
    private smsService: SMSService
  ) {}

  public async login(loginUserDTO: LoginDTO, role: Role): Promise<AuthResponseDTO> {
    const userData = await this.userService.findFirst({
      email: loginUserDTO.email,
      role,
    });

    if (!userData) {
      throw new UnauthorizedException(MESSAGES.EU_0000001);
    }

    const isMatch = await AuthHelpers.verify(loginUserDTO.password, userData.password);

    if (!isMatch) {
      throw new UnauthorizedException(MESSAGES.EU_0000001);
    }

    const payload = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: GLOBAL_CONFIG.security.expiresIn,
    });

    return {
      user: payload,
      accessToken: accessToken,
    };
  }

  public async sendOtp(data: PhoneDTO, isForgotPassword: boolean): Promise<void> {
    const { phone } = data;

    if (isForgotPassword) {
      const isExistingPhone = await this.userService.isExistingPhone(phone);
      if (!isExistingPhone) {
        throw new BadRequestException(MESSAGES.EU_0000008);
      }
    } else {
      if (await this.userService.isExistingPhone(phone)) {
        throw new BadRequestException(MESSAGES.EU_0000007);
      }
    }

    const otp = AuthHelpers.generateOtp();
    const newPhoneVerification = {
      ...data,
      otp,
      expiredAt: new Date(Date.now() + MINUTE),
    };

    await this.phoneVerificationRepo.create(newPhoneVerification);

    await this.smsService.sendSMS(data.phone, CommonHelpers.formatMessageString(MESSAGES.IU_0000002, otp));
  }

  public async verifyOtp(data: VerifyPhoneDTO): Promise<void> {
    const phoneData = await this.prisma.phoneVerification.findFirst({
      where: {
        phone: data.phone,
        otp: data.otp,
        verifiedAt: null,
        expiredAt: {
          gte: new Date(),
        },
      },
    });

    if (!phoneData) {
      throw new BadRequestException(MESSAGES.EU_0000013);
    }

    await this.phoneVerificationRepo.update({
      where: { id: phoneData.id },
      data: { verifiedAt: new Date() },
    });
  }

  public async register(user: RegisterUserDTO): Promise<User> {
    const createdUser = await this.userService.create(user, false);
    return createdUser;
  }

  public async forgotPassword(dto: ForgotPasswordDTO): Promise<void> {
    const { email } = dto;
    const admin = await this.userService.findFirst({ email, role: Role.Admin });
    if (!admin) {
      throw new BadRequestException(MESSAGES.EU_0000003);
    }

    this.mailService.sendEmail(email, MAIL_TEMPLATES.RESET_PASSWORD, {
      link: `${GLOBAL_CONFIG.external.frontend_url}/reset-password/${admin.token}`,
    });

    return;
  }

  public async resetPasswordForUser(dto: UserResetPasswordDTO): Promise<void> {
    const { phone, otp, password } = dto;

    const phoneVerified = await this.phoneVerificationRepo.findFirst({
      phone,
      otp,
      verifiedAt: {
        not: null,
      },
      expiredAt: {
        gte: new Date(),
      },
    });

    if (!phoneVerified) {
      throw new BadRequestException(MESSAGES.EU_0000015);
    }

    const encryptedPass = await AuthHelpers.hash(password);

    await this.userService.update({
      where: { phone },
      data: { password: encryptedPass },
    });
  }

  public async verifyToken(token: string): Promise<void> {
    const isExisting = await this.userService.isExistingToken(token);
    if (!isExisting) {
      throw new BadRequestException(MESSAGES.EU_0000005);
    } else {
      await this.userService.update({
        where: { token },
        data: { emailVerifiedAt: new Date(), token: AuthHelpers.generateToken() },
      });
    }
  }

  public async resetPasswordForAdmin(dto: AdminResetPasswordDTO): Promise<User> {
    const { token, password } = dto;
    const isExisting = await this.userService.isExistingToken(token);
    if (!isExisting) {
      throw new BadRequestException(MESSAGES.EU_0000005);
    }

    const encryptedPass = await AuthHelpers.hash(password);
    const user = await this.userService.update({
      where: { token },
      data: { password: encryptedPass, token: AuthHelpers.generateToken() },
    });

    return user;
  }
}
