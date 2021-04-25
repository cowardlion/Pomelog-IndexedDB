import { db } from './database';

export type Category = {
  id: string;
  name: string;
  emoji: string;
  keywords: string[];
  order: number;
};

export const resetCategory = async () => {
  return db.table('categories').bulkAdd([
    {
      emoji: '1f4bb',
      name: '업무',
      keywords: ['업무', '작업'],
      order: 1,
    },
    {
      emoji: '1f4c5',
      name: '미팅',
      keywords: ['미팅', '회의'],
      order: 2,
    },
    {
      emoji: '2709',
      name: '메일',
      keywords: ['메일', '회신'],
      order: 3,
    },
    {
      emoji: '2615',
      name: '휴식',
      keywords: ['휴식', '화장실', '커피'],
      order: 4,
    },
    {
      emoji: '1f35a',
      name: '식사',
      keywords: ['식사', '아침', '점심', '저녁', '밥'],
      order: 5,
    },
  ]);
};

(() => {
  const isLoaded = localStorage.getItem('pomelo9-category-is-loaded');

  if (!isLoaded) {
    resetCategory();
    localStorage.setItem('pomelo9-category-is-loaded', 'yes');
  }
})();

export const list = async () => {
  const categories = await db.table('categories').orderBy('order').toArray();
  return categories;
};
