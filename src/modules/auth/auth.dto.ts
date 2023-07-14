import { ApiProperty } from "@nestjs/swagger";
import { HouseType, User } from "@prisma/client";
import { Transform } from "class-transformer";
import { Matches } from "class-validator";

import {
  FURIGANA_REGEX,
  NAME_REGEX,
  OTP_REGEX,
  PASSWORD_REGEX,
  POSTCODE_REGEX,
} from "shared/constants/global.constants";
import { MESSAGES } from "shared/constants/messages.constants";
import { EmailField, EnumField, StringField } from "shared/decorators/dto.decorator";
import { ToPhone } from "shared/decorators/phone.decorator";

export class AuthResponseDTO {
  @ApiProperty()
  user: Partial<User>;
  accessToken: string;
}

export class PhoneDTO {
  @ToPhone
  @StringField()
  phone: string;
}

export class VerifyPhoneDTO extends PhoneDTO {
  @Matches(OTP_REGEX, { message: MESSAGES.EU_0000012 })
  @StringField()
  otp: string;
}

export class RegisterUserDTO extends PhoneDTO {
  @Transform(({ value }: { value: string }) => value?.trim())
  @EmailField({}, { min: 1, max: 256 })
  email: string;

  @Matches(PASSWORD_REGEX, { message: MESSAGES.EU_0000010 })
  @StringField()
  password: string;

  @Matches(NAME_REGEX, { message: MESSAGES.EU_0000014 })
  @StringField()
  name: string;

  @Transform(({ value }: { value: string }) => value?.trim())
  @Matches(FURIGANA_REGEX)
  @StringField()
  furiganaName: string;

  @Matches(POSTCODE_REGEX, { message: MESSAGES.EU_0000011 })
  @StringField()
  postCode: string;

  @StringField()
  address: string;

  @StringField({}, { min: 1, max: 256 })
  streetAddress: string;

  @StringField({ optional: true }, { min: 1, max: 256 })
  apartmentName: string;

  @StringField({ optional: true })
  roomNumber: string;

  @EnumField(HouseType)
  houseType: HouseType;
}

export class LoginDTO {
  @EmailField({}, { min: 1, max: 256 })
  email: string;

  @Matches(PASSWORD_REGEX, { message: MESSAGES.EU_0000010 })
  @StringField()
  password: string;
}

export class ForgotPasswordDTO {
  @EmailField({}, { min: 1, max: 256 })
  email: string;
}

export class UserResetPasswordDTO extends VerifyPhoneDTO {
  @Matches(PASSWORD_REGEX, { message: MESSAGES.EU_0000010 })
  @StringField()
  password: string;
}

export class AdminResetPasswordDTO {
  @StringField()
  token: string;

  @Matches(PASSWORD_REGEX, { message: MESSAGES.EU_0000010 })
  @StringField()
  password: string;
}

