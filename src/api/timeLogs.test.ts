import 'fake-indexeddb/auto';
import { db, checkIn, add, find, listBy, update, remove, setupSampleDB } from './timeLogs';

const delay = (second: number) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve('');
    }, second * 1000);
  });

describe('체크인', () => {
  beforeEach(async () => {
    await setupSampleDB();
  });

  afterEach(async () => {
    await db.table('timeLogs').clear();
  });

  test('체크인 하면 날짜와 시간이 기록되지만 기간(duration)은 없다.', async () => {
    const date = new Date();
    await checkIn(date);
    const log = await db.table('timeLogs').get({ date });
    expect(log.date).toEqual(date);
    expect(log.duration).toBeUndefined();
  });

  test('체크인 하기 전에는 기록할 수 없다.', async () => {
    expect.assertions(1);

    try {
      await add({});
    } catch (ex) {
      expect(ex).toEqual(Error('체크인 하기 전에는 기록할 수 없다.'));
    }
  });

  test('같은 날짜에 체크인을 두번할 수 없다.', async () => {
    expect.assertions(1);
    await checkIn(new Date('2021-03-28T15:24:00+0900'));

    try {
      await checkIn(new Date('2021-03-28T16:24:00+0900'));
    } catch (ex) {
      expect(ex).toEqual(Error('같은 날짜에 체크인을 두번할 수 없다.'));
    }
  });

  test('서로 다른 날짜에 체크인은 가능하다.', async () => {
    expect.assertions(0);
    await checkIn(new Date('2021-03-28T15:24:00+0900'));
    await checkIn(new Date('2021-03-28T24:00:00+0900'));
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
    const logs = await listBy(date);
    const [year, month, days] = [date.getFullYear(), date.getMonth(), date.getDate()];

    expect.assertions(7 * 3);
    for (let i = 1; i < logs.length; ++i) {
      const current = logs[i].date;

      expect(current.getFullYear()).toBe(year);
      expect(current.getMonth()).toBe(month);
      expect(current.getDate()).toBe(days);
    }
  });

  test('시간순으로 기록하지 않더라도 날짜순으로 정렬해서 보여진다.', async () => {
    const date = new Date('2021-03-25');
    const logs = await listBy(date);

    for (let i = 1; i < logs.length; ++i) {
      const prev = logs[i - 1];
      const current = logs[i];

      expect(prev.date.valueOf()).toBeLessThan(current.date.valueOf());
    }
  });
});

describe('기록', () => {
  beforeAll(async () => {
    await checkIn();
  });

  afterAll(async () => {
    await db.table('timeLogs').clear();
  });

  test('바로 직전에 했던 일을 기록하면 그 일을 했던 시간(duration)이 자동으로 계산된다.', async () => {
    await delay(1);
    const date = new Date();
    await add({ date, note: '테스트' });

    const log = await find({ date });
    expect(log?.note).toEqual('테스트');
    expect(log?.duration).not.toBeUndefined();
    expect(log?.duration).toBeGreaterThan(1000);
    expect(log?.duration).toBeLessThan(1100);
  });
});

describe('데이터 검증', () => {
  beforeAll(async () => {
    await setupSampleDB();
  });

  afterAll(async () => {
    await db.table('timeLogs').clear();
  });
  test('지정된 날짜의 최초 기록은 항상 체크인으로 시작해야한다.', async () => {
    const date = new Date('2021-03-23');
    const logs = await listBy(date);

    expect(logs[0].duration).toBeUndefined();
    expect(logs[0].tags).toContain('CHECK-IN');
  });

  test('지정된 날짜의 체크인은 유일해야한다.', async () => {
    const date = new Date('2021-03-24');
    const logs = await listBy(date);
    const checkIns = logs.filter(({ tags }) => tags?.includes('CHECK-IN'));
    expect(checkIns.length).toBe(1);
  });

  test('체크인과 체크아웃을 제외한 모든 기록은 duration을 가져야한다.', async () => {
    const date = new Date('2021-03-24');
    const logs = await listBy(date);

    for (let i = 1; i < logs.length - 1; ++i) {
      const log = logs[i];

      expect(log.duration).not.toBeUndefined();
    }
  });

  test('지난 기록에는 반드시 체크아웃이 있어야한다.', async () => {
    let date = new Date('2021-03-23');
    let logs = await listBy(date);
    let checkOut = logs[logs.length - 1];

    expect(checkOut.tags).toContain('CHECK-OUT');
    expect(checkOut.duration).toBeUndefined();

    date = new Date('2021-03-24');
    logs = await listBy(date);
    checkOut = logs[logs.length - 1];

    expect(checkOut.tags).toContain('CHECK-OUT');
    expect(checkOut.duration).toBeUndefined();

    date = new Date('2021-03-25');
    logs = await listBy(date);
    checkOut = logs[logs.length - 1];

    expect(checkOut.tags).toContain('CHECK-OUT');
    expect(checkOut.duration).toBeUndefined();

    date = new Date('2021-03-26');
    logs = await listBy(date);
    checkOut = logs[logs.length - 1];

    expect(checkOut.tags).toContain('CHECK-OUT');
    expect(checkOut.duration).toBeUndefined();
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
    const logs = await listBy(date);
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
    const logs = await listBy(date);

    await remove(logs.map(({ id }) => id));
    const results = await listBy(date);

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
    const logs = await listBy(date);
    const log = logs[0];

    const updatedLog = await update(log.id, { note: '체크인 수정' });

    expect(log.note).not.toBe('체크인 수정');
    expect(updatedLog.note).toBe('체크인 수정');
  });
});

describe('통계', () => {
  test.todo('모든 기록의 평균 작업 속도를 알수있다.');
});
