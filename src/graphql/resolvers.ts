import { listByDate, checkPoint, remove, add } from '../api/timeLogs';

const resolvers = {
  Query: {
    timeLogs: async (parent: any, { dateStr }: any, context: any, info: any) => {
      return await listByDate(new Date(dateStr));
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
  },
};
export default resolvers;
