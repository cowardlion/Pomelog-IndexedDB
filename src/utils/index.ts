import moment from 'moment';
import { TimeLog } from '../api/timeLogs';

export const msToTime = (s: number) => {
  if (s === 0) {
    return null;
  }

  const ms = s % 1000;
  s = (s - ms) / 1000;
  const secs = s % 60;
  s = (s - secs) / 60;
  const mins = s % 60;
  const hrs = (s - mins) / 60;

  let timeStr = '';
  if (hrs) {
    timeStr += hrs + 'h ';
  }

  if (mins) {
    timeStr += mins + 'm';
  }

  if (mins === 0 && secs) {
    timeStr += 1 + 'm';
  }

  return `(${timeStr})`;
};

/**
 * 마지막 로그의 종료시간을 반환한다. 만약 로그가 없다면 기준 날짜의 오전 9시를 반환한다.
 * @param timeLogs 로그 배열
 * @param dateStr 기준 날짜
 * @returns
 */
export const getStartAtFromTimeLogs = (timeLogs: TimeLog[], dateStr: string, isSameDateStr: boolean): Date => {
  if (timeLogs.length === 0) {
    if (isSameDateStr) {
      return new Date(`${dateStr}T00:00:00`); // 오전 00시
    }
    return new Date(`${dateStr}T00:00:00z`); // 오전 9시
  }

  return timeLogs[timeLogs.length - 1].endAt;
};

/**
 * 자동 선택 유무에 따라서 종료시간을 반환한다. 
 * 
 * @param startAt 시작 시간, 기준 날짜 안에 포함된다. 
 * @param dateStr 기준 날짜
 * @param disableAutoSelect 자동 선택 유무

 * @returns 
 */
export const getEndAtFromtStartAt = (startAt: Date, dateStr: string, disableAutoSelect: boolean): Date => {
  if (disableAutoSelect) {
    const tmpEndDate = moment(startAt).add(1, 'hour');

    if (dateStr === tmpEndDate.format('YYYY-MM-DD')) {
      return tmpEndDate.toDate();
    }
    return moment(`${dateStr}T23:59:00`).toDate();
  }

  return new Date();
};
