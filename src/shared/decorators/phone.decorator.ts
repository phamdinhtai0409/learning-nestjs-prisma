import { BadRequestException } from "@nestjs/common";
import { Transform } from "class-transformer";
import { parsePhoneNumberFromString } from "libphonenumber-js";

import { CommonHelpers } from "shared/helpers/common.helpers";
import { JP_PHONE_LOCALE } from "shared/constants/global.constants";
import { MESSAGES } from "shared/constants/messages.constants";
import { isProd } from "shared/helpers/env.helpers";

export const ToPhone = Transform(
  ({ value }: { value: string }) => {
    const args = isProd() ? [JP_PHONE_LOCALE] : [];
    const phoneNumber = CommonHelpers.parseToPhoneNumberWithLocale(value, ...args);

    const parsedPhoneNumber = parsePhoneNumberFromString(phoneNumber);

    if (!parsedPhoneNumber) throw new BadRequestException([MESSAGES.EU_0000009]);

    if (!parsedPhoneNumber.isValid()) {
      throw new BadRequestException([MESSAGES.EU_0000009]);
    }

    return parsedPhoneNumber.number;
  },
  { toClassOnly: true }
);
