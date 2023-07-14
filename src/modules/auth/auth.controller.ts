import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { User } from "@prisma/client";

import { HasRoles } from "modules/auth/auth.has-roles.decorator";
import { BLACK_LIST_FIELDS, Role } from "shared/constants/global.constants";
import { CommonHelpers } from "shared/helpers/common.helpers";

import { AuthService } from "./auth.service";
import {
  AdminResetPasswordDTO,
  AuthResponseDTO,
  ForgotPasswordDTO,
  LoginDTO,
  PhoneDTO,
  RegisterUserDTO,
  UserResetPasswordDTO,
  VerifyPhoneDTO,
} from "./auth.dto";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/user/login")
  @HasRoles(Role.PUBLIC)
  @ApiOperation({ description: "Login in user" })
  @ApiBody({ type: LoginDTO })
  @ApiResponse({ type: AuthResponseDTO })
  async loginUser(@Body() user: LoginDTO): Promise<AuthResponseDTO> {
    return this.authService.login(user, Role.USER);
  }

  @Post("/user/send-otp")
  @HasRoles(Role.PUBLIC)
  async sendOtp(@Body() data: PhoneDTO): Promise<void> {
    await this.authService.sendOtp(data, false);
  }

  @Post("/user/verify-otp")
  @HttpCode(200)
  @HasRoles(Role.PUBLIC)
  async verifyOtp(@Body() data: VerifyPhoneDTO): Promise<void> {
    await this.authService.verifyOtp(data);
  }

  @Post("/user/register")
  @HasRoles(Role.PUBLIC)
  async register(@Body() user: RegisterUserDTO): Promise<User> {
    const registeredUser = await this.authService.register(user);
    CommonHelpers.removeBlacklistFields(registeredUser, BLACK_LIST_FIELDS);
    return registeredUser;
  }

  @Post("/user/forgot-password")
  @HasRoles(Role.PUBLIC)
  @ApiBody({ type: PhoneDTO })
  forgotPasswordForUser(@Body() data: PhoneDTO): Promise<void> {
    return this.authService.sendOtp(data, true);
  }

  @Post("/user/reset-password")
  @HasRoles(Role.PUBLIC)
  @ApiBody({ type: UserResetPasswordDTO })
  async resetPasswordForUser(@Body() userResetPasswordDTO: UserResetPasswordDTO): Promise<void> {
    await this.authService.resetPasswordForUser(userResetPasswordDTO);
  }

  @Post("/admin/login")
  @HasRoles(Role.PUBLIC)
  @ApiOperation({ description: "Login in admin" })
  @ApiBody({ type: LoginDTO })
  @ApiResponse({ type: AuthResponseDTO })
  async loginAdmin(@Body() user: LoginDTO): Promise<AuthResponseDTO> {
    return this.authService.login(user, Role.ADMIN);
  }

  @Post("/admin/forgot-password")
  @HasRoles(Role.PUBLIC)
  @ApiBody({ type: ForgotPasswordDTO })
  forgotPasswordForAdmin(@Body() forgotPasswordDTO: ForgotPasswordDTO): Promise<void> {
    return this.authService.forgotPassword(forgotPasswordDTO);
  }

  @Get("/admin/verify/:token")
  @HasRoles(Role.PUBLIC)
  verifyToken(@Param("token") token: string): Promise<void> {
    return this.authService.verifyToken(token);
  }

  @Post("/admin/reset-password")
  @HasRoles(Role.PUBLIC)
  @ApiBody({ type: AdminResetPasswordDTO })
  async resetPasswordForAdmin(@Body() adminResetPasswordDTO: AdminResetPasswordDTO): Promise<void> {
    await this.authService.resetPasswordForAdmin(adminResetPasswordDTO);
  }
}
