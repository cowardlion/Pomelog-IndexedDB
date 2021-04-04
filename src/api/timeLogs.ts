import Dexie from 'dexie';
import moment from 'moment-timezone';

export type TimeLog = {
  id: number;
  startAt: Date;
  endAt: Date;
  note: string;
  tags: string[];
  duration: number;
  isValid: boolean;
};

export type InputLog = {
  startAt: Date;
  endAt?: Date;
  note: String;
  tag?: String;
};

export type MatchLog = Partial<{
  id: number;
  startAt: Date;
  endAt: Date;
  note: string;
  tag: string;
}>;

export type UpdateLog = Omit<MatchLog, 'id'>;

export const setupSampleDB = async () => {
  return db.table('timeLogs').bulkAdd([
    {
      startAt: new Date('2021-03-23T03:24:00z'),
      endAt: new Date('2021-03-23T03:24:00z'),
      note: 'test1',
      tags: ['CHECK-IN'],
    },
    { startAt: new Date('2021-03-23T03:24:00z'), endAt: new Date('2021-03-23T04:24:00z'), note: 'test2', tags: [] },
    { startAt: new Date('2021-03-23T04:24:00z'), endAt: new Date('2021-03-23T05:24:00z'), note: 'test3' },
    { startAt: new Date('2021-03-23T05:24:00z'), endAt: new Date('2021-03-23T06:24:00z'), note: 'test4' },
    { startAt: new Date('2021-03-23T06:24:00z'), endAt: new Date('2021-03-23T07:24:00z'), note: 'test5' },
    {
      startAt: new Date('2021-03-23T08:24:00z'),
      endAt: new Date('2021-03-23T08:24:00z'),
      note: '테스트 체크아웃',
      tags: ['CHECK-OUT'],
    },
    {
      startAt: new Date('2021-03-24T08:24:00z'),
      endAt: new Date('2021-03-24T08:24:00z'),
      note: 'test6',
      tags: ['CHECK-IN'],
    },
    { startAt: new Date('2021-03-24T08:24:00z'), endAt: new Date('2021-03-24T09:24:00z'), note: 'test7' },
    { startAt: new Date('2021-03-24T09:24:00z'), endAt: new Date('2021-03-24T10:24:00z'), note: 'test8' },
    { startAt: new Date('2021-03-24T10:24:00z'), endAt: new Date('2021-03-24T11:24:00z'), note: 'test9' },
    { startAt: new Date('2021-03-24T11:24:00z'), endAt: new Date('2021-03-24T12:24:00z'), note: 'test10' },
  ]);
};

export const db = new Dexie('Pomelog');
db.version(1).stores({
  timeLogs: '++id, &endAt',
});

const TIME_ZONE = 'YYYY-MM-DDT00:00:00Z';
export const isCheckedInByDate = async (date = new Date()) => {
  const mt = moment(date);
  const today = mt.format(TIME_ZONE);
  const tomorrow = mt.add(1, 'd').format(TIME_ZONE);

  try {
    const log = await db.table('timeLogs').where('endAt').between(new Date(today), new Date(tomorrow)).first();
    return !!(log && log.tags?.includes('CHECK-IN'));
  } catch (ex) {
    return false;
  }
};

export const listByDate = async (date = new Date()) => {
  const from = moment(date).format(TIME_ZONE);
  const to = moment(date).add(1, 'd').format(TIME_ZONE);
  const logs = await db.table('timeLogs').where('endAt').between(new Date(from), new Date(to)).sortBy('endAt');

  const timeLogs = logs.map((log: TimeLog, index: number, arr: TimeLog[]) => {
    const { tags = [], ...rest } = log;
    let isValid = true;

    if (0 < index && arr[index - 1].endAt > log.startAt) {
      isValid = false;
    }

    return { ...rest, tags, duration: log.endAt.valueOf() - log.startAt.valueOf(), isValid };
  });

  return timeLogs;
};

export const find = async (match: MatchLog): Promise<TimeLog> => {
  const { id, endAt, note, tag } = match;
  const logs = (await listByDate(endAt)) as TimeLog[];

  for (let i = 0; i < logs.length; ++i) {
    const log = logs[i];
    if (
      log.id === id ||
      log.endAt.valueOf() === endAt?.valueOf() ||
      (note && 0 < log.note?.indexOf(note)) ||
      (tag && log.tags?.includes(tag))
    ) {
      return log;
    }
  }

  throw new Error('찾으려는 기록이 없습니다.');
};

export const add = async (input: InputLog) => {
  const { startAt, endAt = new Date(), note, tag = '' } = input;

  if (!startAt || !note) {
    throw new Error('기록을 위한 필수 데이터가 없습니다.');
  }

  return db.table('timeLogs').add({
    startAt,
    endAt,
    note,
    tags: tag ? tag.split(',').map((s) => s.trim()) : [],
  });
};

export const update = async (id: number, changes: UpdateLog): Promise<TimeLog> => {
  await db.table('timeLogs').update(id, changes);
  return db.table('timeLogs').get({ id });
};

export const remove = async (ids: number[]): Promise<void> => {
  return db.table('timeLogs').bulkDelete(ids);
};

export const checkIn = async (date = new Date()) => {
  const isAlready = await isCheckedInByDate(date);

  if (isAlready) {
    throw new Error('같은 날짜에 체크인을 두번할 수 없다.');
  }

  if (moment().format('YYYY-MM-DD') !== moment(date).format('YYYY-MM-DD')) {
    throw new Error('간편 체크인 기능은 오늘만 가능하다.');
  }

  const logValue = {
    startAt: date,
    endAt: date,
    note: 'Check-In',
    tags: ['CHECK-IN'],
    duration: 0,
  };

  const id = await db.table('timeLogs').add(logValue);

  return { id, ...logValue, duration: 0 };
};
