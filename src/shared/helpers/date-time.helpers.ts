import moment from "moment";

import { Schedule } from "shared/types/common.type";

export const newDateKeepLocalTime = (date?: Date | string): Date => {
  if (!date) return null;
  return moment(date).utc(true).toDate();
};

export function isBeforeDay(date: string | Date, value: string | Date): boolean {
  return moment(date).isBefore(moment(value), "day");
}

export function isAfterDay(date: string | Date, value: string | Date): boolean {
  return moment(date).isAfter(moment(value), "day");
}

export function isSameDay(date: string | Date, value: string | Date): boolean {
  return moment(date).isSame(moment(value), "day");
}

export function isSameOrBeforeDay(date: string | Date, value: string | Date): boolean {
  return moment(date).isSameOrBefore(moment(value), "day");
}

export function isSameOrAfterDay(date: string | Date, value: string | Date): boolean {
  return moment(date).isSameOrAfter(moment(value), "day");
}

/**
 * Check range date valid:
 * Invalid cases:
 * - dateFrom > dateTo
 * - dateFrom = dateTo = [dateFrom, dateTo] of existing frames
 * - [dateFrom -> dateTo] is overlap with [dateFrom -> dateTo] of existing frames
 * @param currentFrame
 * @param existingFrames
 * @returns isValid true or false
 */
export const checkIsOverlapRangeDates = (schedule: Schedule, schedules: Schedule[]) => {
  const { dateFrom, dateTo } = schedule;
  if (isAfterDay(dateFrom, dateTo)) {
    return false;
  }

  for (const scheduleItem of schedules) {
    if (isSameOrBeforeDay(dateFrom, scheduleItem.dateTo) && isSameOrAfterDay(dateTo, scheduleItem.dateFrom)) {
      return false;
    }

    if (isSameDay(dateFrom, dateTo)) {
      if (isSameDay(dateFrom, scheduleItem.dateFrom) && isSameDay(dateTo, scheduleItem.dateTo)) {
        return false;
      }
      continue;
    }
  }

  return true;
};
