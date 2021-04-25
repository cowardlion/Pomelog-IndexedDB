import Dexie from 'dexie';

export const db = new Dexie('Pomelog');
db.version(1).stores({
  timeLogs: '++id, &endAt',
  categories: '++id, &name, &order, &keywords',
});
