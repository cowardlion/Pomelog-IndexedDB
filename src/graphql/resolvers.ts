import { listBy, isCheckedInToday, checkIn, remove } from '../api/timeLogs';

const resolvers = {
  Query: {
    getTodayLogs: async (parent: any, args: any, context: any, info: any) => {
      const timeLogs = await listBy();
      return timeLogs;
    },
    isCheckedIn: async (parent: any, args: any, context: any, info: any) => {
      return await isCheckedInToday();
    },
  },
  Mutation: {
    CheckIn: async () => {
      return await checkIn();
    },
    RemoveLog: async (_: any, { id }: any) => {
      return await remove([id]);
    },
  },
};
export default resolvers;
