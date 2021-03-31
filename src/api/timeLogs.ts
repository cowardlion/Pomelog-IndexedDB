import Dexie from 'dexie';
import moment from 'moment-timezone';

export type TimeLog = {
  id: number;
  date: Date;
  note: string;
  tags?: string[];
  duration?: number;
};

export type InputLog = Partial<Omit<TimeLog, 'id' | 'duration'>>;
export type MatchLog = Partial<{
  id: number;
  date: Date;
  note: string;
  tag: string;
}>;

export const setupSampleDB = async () => {
  return db.table('timeLogs').bulkAdd([
    { date: new Date('2021-03-23T03:24:00z'), note: 'test1', tags: ['CHECK-IN'] },
    { date: new Date('2021-03-23T04:24:00z'), note: 'test2' },
    { date: new Date('2021-03-23T05:24:00z'), note: 'test3' },
    { date: new Date('2021-03-23T06:24:00z'), note: 'test4' },
    { date: new Date('2021-03-23T07:24:00z'), note: 'test5' },
    { date: new Date('2021-03-23T08:24:00z'), note: '테스트 체크아웃', tags: ['CHECK-OUT'] },
    { date: new Date('2021-03-24T08:24:00z'), note: 'test6', tags: ['CHECK-IN'] },
    { date: new Date('2021-03-24T09:24:00z'), note: 'test7' },
    { date: new Date('2021-03-24T10:24:00z'), note: 'test8' },
    { date: new Date('2021-03-24T11:24:00z'), note: 'test9' },
    { date: new Date('2021-03-24T12:24:00z'), note: 'test10' },
    { date: new Date('2021-03-24T13:24:00z'), note: 'test11' },
    { date: new Date('2021-03-24T14:24:00z'), note: 'test12' },
    { date: new Date('2021-03-24T14:59:59z'), note: '테스트 체크아웃', tags: ['CHECK-OUT'] },
    { date: new Date('2021-03-24T15:24:00z'), note: 'test13', tags: ['CHECK-IN'] },
    { date: new Date('2021-03-24T16:24:00z'), note: 'test14' },
    { date: new Date('2021-03-24T17:24:00z'), note: 'test15' },
    { date: new Date('2021-03-24T18:24:00z'), note: 'test16' },
    { date: new Date('2021-03-24T19:24:00z'), note: 'test17' },
    { date: new Date('2021-03-25T07:24:00z'), note: 'test29' },
    { date: new Date('2021-03-24T20:24:00z'), note: 'test18' },
    { date: new Date('2021-03-24T21:24:00z'), note: 'test19' },
    { date: new Date('2021-03-24T22:24:00z'), note: 'test20' },
    { date: new Date('2021-03-24T23:24:00z'), note: 'test21' },
    { date: new Date('2021-03-25T03:24:00z'), note: 'test25' },
    { date: new Date('2021-03-25T00:24:00z'), note: 'test22' },
    { date: new Date('2021-03-25T14:59:59z'), note: '테스트 체크아웃', tags: ['CHECK-OUT'] },
    { date: new Date('2021-03-25T01:24:00z'), note: 'test23' },
    { date: new Date('2021-03-25T02:24:00z'), note: 'test24' },
    { date: new Date('2021-03-25T04:24:00z'), note: 'test26' },
    { date: new Date('2021-03-25T05:24:00z'), note: 'test27' },
    { date: new Date('2021-03-25T14:24:00z'), note: 'test36' },
    { date: new Date('2021-03-25T11:24:00z'), note: 'test33' },
    { date: new Date('2021-03-25T06:24:00z'), note: 'test28' },
    { date: new Date('2021-03-25T13:24:00z'), note: 'test35' },
    { date: new Date('2021-03-25T20:24:00z'), note: '체크인', tags: ['CHECK-IN'] },
    { date: new Date('2021-03-26T01:20:00z'), note: 'test37' },
    { date: new Date('2021-03-26T03:20:00z'), note: '체크아웃', tags: ['CHECK-OUT'] },
    { date: new Date('2021-03-25T08:24:00z'), note: 'test30' },
    { date: new Date('2021-03-25T09:24:00z'), note: 'test31' },
    { date: new Date('2021-03-25T10:24:00z'), note: 'test32' },
    { date: new Date('2021-03-25T12:24:00z'), note: 'test34' },
  ]);
};

export const db = new Dexie('Pomelog');
db.version(1).stores({
  timeLogs: '++id, &date',
});

const TIME_ZONE = 'YYYY-MM-DDT00:00:00Z';
export const isCheckedInToday = async (mt = moment()) => {
  const today = mt.format(TIME_ZONE);
  const tomorrow = mt.add(1, 'd').format(TIME_ZONE);

  try {
    const log = await db.table('timeLogs').where('date').between(new Date(today), new Date(tomorrow)).first();
    return !!(log && log.tags?.includes('CHECK-IN'));
  } catch (ex) {
    return false;
  }
};

export const listBy = async (today = new Date()) => {
  const from = moment(today).format(TIME_ZONE);
  const to = moment(today).add(1, 'd').format(TIME_ZONE);
  const logs = await db.table('timeLogs').where('date').between(new Date(from), new Date(to)).sortBy('date');

  const timeLogs = logs.map((log: TimeLog, index: number, arr: TimeLog[]) => {
    // 체크인 제외
    if (index === 0) {
      return log;
    }

    // 체크아웃 제외
    if (index === arr.length - 1 && log.tags?.includes('CHECK-OUT')) {
      return log;
    }

    return { ...log, duration: log.date.valueOf() - arr[index - 1].date.valueOf() };
  });

  return timeLogs;
};

export const find = async (match: MatchLog): Promise<TimeLog> => {
  const { id, date, note, tag } = match;
  const logs = (await listBy(date)) as TimeLog[];

  for (let i = 0; i < logs.length; ++i) {
    const log = logs[i];
    if (
      log.id === id ||
      log.date.valueOf() === date?.valueOf() ||
      (note && 0 < log.note?.indexOf(note)) ||
      (tag && log.tags?.includes(tag))
    ) {
      return log;
    }
  }

  throw new Error('찾으려는 기록이 없습니다.');
};

export const add = async (input: InputLog) => {
  const isCheckedIn = await isCheckedInToday();

  if (!isCheckedIn) {
    throw new Error('체크인 하기 전에는 기록할 수 없다.');
  }

  const { date = new Date(), note, tags } = input;

  return db.table('timeLogs').add({
    date,
    note,
    tags,
  });
};

export const update = async (id: number, changes: InputLog): Promise<TimeLog> => {
  await db.table('timeLogs').update(id, changes);
  return db.table('timeLogs').get({ id });
};

export const remove = async (ids: number[]): Promise<void> => {
  return db.table('timeLogs').bulkDelete(ids);
};

export const checkIn = async (date = new Date()) => {
  const isCheckedIn = await isCheckedInToday(moment(date));

  if (isCheckedIn) {
    throw new Error('같은 날짜에 체크인을 두번할 수 없다.');
  }

  const logValue = {
    date,
    note: 'Check-In',
    tags: ['CHECK-IN'],
  };

  const id = await db.table('timeLogs').add(logValue);

  return { id, ...logValue };
};
