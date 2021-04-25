import 'fake-indexeddb/auto';
import { db } from './database';
import { list, resetCategory } from './category';

describe('조회', () => {
  beforeAll(async () => {
    await db.table('categories').clear();
    await resetCategory();
  });

  afterAll(async () => {
    await db.table('categories').clear();
  });

  test('기본으로 5개의 카테고리를 제공한다', async () => {
    const categories = await list();

    expect.assertions(5);
    for (let i = 0; i < categories.length; ++i) {
      const category = categories[i];

      expect(category.name).not.toBeUndefined();
    }
  });
});
