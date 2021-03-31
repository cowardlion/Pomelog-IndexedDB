import { listBy, isCheckedInToday, checkIn } from '../api/timeLogs';

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
  },
};
export default resolvers;
