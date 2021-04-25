import { listByDate, checkPoint, remove, add, update } from '../api/timeLog';
import { list } from '../api/category';

const resolvers = {
  Query: {
    timeLogs: async (parent: any, { dateStr }: any, context: any, info: any) => {
      return await listByDate(new Date(dateStr));
    },
    categories: async (parent: any, _: any, context: any, info: any) => {
      return await list();
    },
  },
  Mutation: {
    checkPoint: async (_: any, { dateStr }: any) => {
      return await checkPoint();
    },
    addLog: async (_: any, { input }: any) => {
      return await add({ ...input });
    },
    removeLog: async (_: any, { id }: any) => {
      return await remove([id]);
    },
    updateLog: async (_: any, { changes: { id, ...values } }: any) => {
      return await update(id, values);
    },
  },
};
export default resolvers;
