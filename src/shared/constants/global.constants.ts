// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

export const JWT_SECRET = process.env.JWT_SIGNATURE;

export enum Role {
  PUBLIC = "Public",
  USER = "User",
  ADMIN = "Admin",
  SUPER_ADMIN = "SuperAdmin",
}

export const API_PREFIX = "/api/v1";

export const DEFAULT_PAGE_LIMIT = 10;
export const MAX_PAGE_LIMIT = 100;

export const DEFAULT_SORT_BY = "id";

export const JP_LONG_LOCALE = "ja-JP";
export const JP_PHONE_LOCALE = "+81";
export const VN_LONG_LOCALE = "vi-VN";
export const VN_PHONE_LOCALE = "+84";

export const JP_PHONE_DIGITS = 11;
export const VN_PHONE_DIGITS = 10;

//Regex
export const PHONE_REGEX = /^[0-9\s+-.()]+$/;
export const OTP_REGEX = /^[0-9]{6}$/;
export const NAME_REGEX = /^[一-龥ぁ-んa-zA-Z]+$/;
export const FURIGANA_REGEX = /^[ぁ-んァ-ン|ー]+$/;
export const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])[a-z\d]{8,16}$/;
export const POSTCODE_REGEX = /^\d{7}$/;

export const SLUG_SEPARATOR = "-";

export const BLACK_LIST_FIELDS = ["password", "token"];

export enum Environment {
  Development = "development",
  Test = "test",
  Production = "production",
}
