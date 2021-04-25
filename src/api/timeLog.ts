import moment from 'moment-timezone';
import { db } from './database';
import { Category } from './category';

export type TimeLog = {
  id: number;
  startAt: Date;
  endAt: Date;
  note: string;
  category: Category;
  duration: number;
  isValid: boolean;
};

export type InputLog = {
  startAt: Date;
  endAt?: Date;
  note: String;
};

export type MatchLog = Partial<{
  id: number;
  startAt: Date;
  endAt: Date;
  note: string;
  category: string;
}>;

export type UpdateLog = Omit<MatchLog, 'id'>;

export const setupSampleDB = async () => {
  return db.table('timeLogs').bulkAdd([
    {
      startAt: new Date('2021-03-23T03:24:00z'),
      endAt: new Date('2021-03-23T03:24:00z'),
      note: 'test1',
    },
    { startAt: new Date('2021-03-23T03:24:00z'), endAt: new Date('2021-03-23T04:24:00z'), note: 'test2' },
    { startAt: new Date('2021-03-23T04:24:00z'), endAt: new Date('2021-03-23T05:24:00z'), note: 'test3' },
    { startAt: new Date('2021-03-23T05:24:00z'), endAt: new Date('2021-03-23T06:24:00z'), note: 'test4' },
    { startAt: new Date('2021-03-23T06:24:00z'), endAt: new Date('2021-03-23T07:24:00z'), note: 'test5' },
    {
      startAt: new Date('2021-03-23T08:24:00z'),
      endAt: new Date('2021-03-23T08:24:00z'),
      note: '테스트 체크아웃',
    },
    {
      startAt: new Date('2021-03-24T08:24:00z'),
      endAt: new Date('2021-03-24T08:24:00z'),
      note: 'test6',
    },
    { startAt: new Date('2021-03-24T08:24:00z'), endAt: new Date('2021-03-24T09:24:00z'), note: 'test7' },
    { startAt: new Date('2021-03-24T09:24:00z'), endAt: new Date('2021-03-24T10:24:00z'), note: 'test8' },
    { startAt: new Date('2021-03-24T10:24:00z'), endAt: new Date('2021-03-24T11:24:00z'), note: 'test9' },
    { startAt: new Date('2021-03-24T11:24:00z'), endAt: new Date('2021-03-24T12:24:00z'), note: 'test10' },
  ]);
};

const TIME_ZONE = 'YYYY-MM-DDT00:00:00Z';

export const listByDate = async (date = new Date()) => {
  const from = moment(date).format(TIME_ZONE);
  const to = moment(date).add(1, 'd').format(TIME_ZONE);
  const logs = await db.table('timeLogs').where('endAt').between(new Date(from), new Date(to)).sortBy('endAt');

  const timeLogs = logs.map((log: TimeLog, index: number, arr: TimeLog[]) => {
    const { ...rest } = log;
    let isValid = true;

    if (0 < index && arr[index - 1].endAt > log.startAt) {
      isValid = false;
    }

    return { ...rest, duration: log.endAt.valueOf() - log.startAt.valueOf(), isValid };
  });

  return timeLogs;
};

export const find = async (match: MatchLog): Promise<TimeLog> => {
  const { id, endAt, note } = match;
  const logs = (await listByDate(endAt)) as TimeLog[];

  for (let i = 0; i < logs.length; ++i) {
    const log = logs[i];
    if (log.id === id || log.endAt.valueOf() === endAt?.valueOf() || (note && 0 < log.note?.indexOf(note))) {
      return log;
    }
  }

  throw new Error('찾으려는 기록이 없습니다.');
};

export const add = async (input: InputLog) => {
  const { startAt, endAt = new Date(), note } = input;

  if (!startAt || !note) {
    throw new Error('기록을 위한 필수 데이터가 없습니다.');
  }

  return db.table('timeLogs').add({
    startAt,
    endAt,
    note,
  });
};

export const update = async (id: number, changes: UpdateLog): Promise<TimeLog> => {
  await db.table('timeLogs').update(id, changes);
  return db.table('timeLogs').get({ id });
};

export const remove = async (ids: number[]): Promise<void> => {
  return db.table('timeLogs').bulkDelete(ids);
};

export const checkPoint = async (date = new Date()) => {
  if (moment().format('YYYY-MM-DD') !== moment(date).format('YYYY-MM-DD')) {
    throw new Error('체크포인트 기능은 당일만 가능하다.');
  }

  const logValue = {
    startAt: date,
    endAt: date,
    note: '지금부터 무언가를 시작합니다. 일이 마무리되면 수정하세요.',
    duration: 0,
  };

  const id = await db.table('timeLogs').add(logValue);

  return { id, ...logValue, duration: 0 };
};
