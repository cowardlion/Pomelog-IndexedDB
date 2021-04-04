import { listByDate, isCheckedInByDate, checkIn, remove, add } from '../api/timeLogs';

const resolvers = {
  Query: {
    timeLogs: async (parent: any, { dateStr }: any, context: any, info: any) => {
      return await listByDate(new Date(dateStr));
    },
    isCheckedIn: async (parent: any, { dateStr }: any, context: any, info: any) => {
      return await isCheckedInByDate(new Date(dateStr));
    },
  },
  Mutation: {
    checkIn: async (_: any, { dateStr }: any) => {
      return await checkIn();
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
