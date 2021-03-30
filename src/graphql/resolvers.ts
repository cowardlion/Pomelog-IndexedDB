import { listBy } from '../api/timeLogs';

const resolvers = {
  Query: {
    getTodayLogs: async (parent: any, args: any, context: any, info: any) => {
      const timeLogs = await listBy(new Date('2021-03-24'));
      return timeLogs;
    },
  },
};
export default resolvers;
