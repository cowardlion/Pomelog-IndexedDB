import { listByDate, isCheckedInByDate, checkIn, remove, add } from '../api/timeLogs';

const resolvers = {
  Query: {
    timeLogs: async (parent: any, args: any, context: any, info: any) => {
      return await listByDate(new Date(args.date));
    },
    isCheckedIn: async (parent: any, args: any, context: any, info: any) => {
      return await isCheckedInByDate(new Date(args.date));
    },
  },
  Mutation: {
    checkIn: async () => {
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
