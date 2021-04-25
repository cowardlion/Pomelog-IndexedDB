import 'fake-indexeddb/auto';
import moment from 'moment';
import { db } from './database';
import { checkPoint, add, find, listByDate, update, remove, setupSampleDB } from './timeLog';

const delay = (second: number) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve('');
    }, second * 1000);
  });

describe('체크포인트: 현재 시간을 기점으로 어떤 일을 시작할때 마킹하는 용도로 사용한다', () => {
  beforeEach(async () => {
    await setupSampleDB();
  });

  afterEach(async () => {
    await db.table('timeLogs').clear();
  });

  test('시작과 종료에 현재 시간을 기록한다.', async () => {
    const date = new Date();
    await checkPoint(date);
    const log = await db.table('timeLogs').get({ endAt: date });
    expect(log.startAt).toEqual(date);
    expect(log.endAt).toEqual(date);
    expect(log.duration).toBe(0);
  });

  test('체크포인트 기능은 당일만 가능하다.', async () => {
    expect.assertions(2);

    try {
      await checkPoint(new Date('2021-03-28T16:24:00+0900'));
    } catch (ex) {
      expect(ex).toEqual(Error('체크포인트 기능은 당일만 가능하다.'));
    }

    try {
      await checkPoint(new Date('2022-03-28T16:24:00+0900'));
    } catch (ex) {
      expect(ex).toEqual(Error('체크포인트 기능은 당일만 가능하다.'));
    }

    await checkPoint(new Date());
  });
});

describe('조회', () => {
  beforeAll(async () => {
    await setupSampleDB();
  });

  afterAll(async () => {
    await db.table('timeLogs').clear();
  });

  test('지정된 날짜에 해당하는 모두 로그를 조회한다.', async () => {
    const date = new Date('2021-03-24');
    const logs = await listByDate(date);
    const [year, month, days] = [date.getFullYear(), date.getMonth(), date.getDate()];

    expect.assertions(4 * 3);
    for (let i = 1; i < logs.length; ++i) {
      const current = logs[i].endAt;

      expect(current.getFullYear()).toBe(year);
      expect(current.getMonth()).toBe(month);
      expect(current.getDate()).toBe(days);
    }
  });

  test('시간순으로 기록하지 않더라도 날짜순으로 정렬해서 보여진다.', async () => {
    const date = new Date('2021-03-24');
    const logs = await listByDate(date);

    expect.hasAssertions();
    for (let i = 1; i < logs.length; ++i) {
      const prev = logs[i - 1];
      const current = logs[i];

      expect(prev.endAt.valueOf()).toBeLessThan(current.endAt.valueOf());
    }
  });
});

describe('기록', () => {
  beforeAll(async () => {
    await checkPoint();
  });

  afterAll(async () => {
    await db.table('timeLogs').clear();
  });

  test('기록을 위해서는 startAt, note 정보가 필요하다.', async () => {
    expect.assertions(1);

    try {
      await add({ startAt: new Date(), note: '' });
    } catch (ex) {
      expect(ex).toEqual(Error('기록을 위한 필수 데이터가 없습니다.'));
    }
  });

  test('바로 직전에 했던 일을 기록하면 그 일을 했던 시간(duration)이 ms으로 자동 계산된다.', async () => {
    const mtNow = moment();
    const endAt = new Date();
    const startAt = mtNow.add(-1, 'hour').toDate();

    await add({ startAt, endAt, note: '테스트' });

    const log = await find({ endAt });
    expect(log.note).toEqual('테스트');
    expect(log.duration).toBe(3600000);
  });
});

describe('데이터 검증', () => {
  beforeAll(async () => {
    await setupSampleDB();
  });

  afterAll(async () => {
    await db.table('timeLogs').clear();
  });
  test('모든 기록은 id, startAt, endAt, note, category, duration, isValid 필드 값이 항상 존재해야한다.', async () => {
    const date = new Date('2021-03-23');
    const logs = await listByDate(date);

    logs.forEach((log) => {
      expect(log.id).not.toBeUndefined();
      expect(log.startAt).not.toBeUndefined();
      expect(log.endAt).not.toBeUndefined();
      expect(log.note).not.toBeUndefined();
      // expect(log.category).not.toBeUndefined();
      expect(log.isValid).not.toBeUndefined();
    });
  });

  test('모든 기록은 duration을 가져야한다.', async () => {
    const date = new Date('2021-03-24');
    const logs = await listByDate(date);

    for (let i = 0; i < logs.length; ++i) {
      const log = logs[i];

      expect(log.duration).not.toBeUndefined();
    }
  });
});

describe('체크아웃', () => {});

describe('삭제', () => {
  beforeAll(async () => {
    await setupSampleDB();
  });

  afterAll(async () => {
    await db.table('timeLogs').clear();
  });

  test('ID를 기준으로 단건을 삭제할수있다.', async () => {
    const date = new Date('2021-03-23');
    const logs = await listByDate(date);
    const log = logs[0];

    await remove([log.id]);

    expect.assertions(1);
    try {
      await find({ id: log.id });
    } catch (ex) {
      expect(ex).toEqual(Error('찾으려는 기록이 없습니다.'));
    }
  });
  test('ID를 기준으로 여러건을 삭제할수있다.', async () => {
    const date = new Date('2021-03-23');
    const logs = await listByDate(date);

    await remove(logs.map(({ id }) => id));
    const results = await listByDate(date);

    expect(results.length).toBe(0);
  });
  test.todo('날짜를 기준으로 여러건을 삭제할수있다.');
});

describe('수정', () => {
  beforeAll(async () => {
    await setupSampleDB();
  });

  afterAll(async () => {
    await db.table('timeLogs').clear();
  });
  test('ID를 기준으로 기록을 수정할수있다.', async () => {
    const date = new Date('2021-03-23');
    const logs = await listByDate(date);
    const log = logs[0];

    const updatedLog = await update(log.id, { note: '체크인 수정' });

    expect(log.note).not.toBe('체크인 수정');
    expect(updatedLog.note).toBe('체크인 수정');
  });
});

describe('통계', () => {
  test.todo('모든 기록의 평균 작업 속도를 알수있다.');
});
