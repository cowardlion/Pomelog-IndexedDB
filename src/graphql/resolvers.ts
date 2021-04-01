import { listBy, isCheckedInToday, checkIn, remove, add } from '../api/timeLogs';

const resolvers = {
  Query: {
    timeLogs: async (parent: any, args: any, context: any, info: any) => {
      return await listBy();
    },
    isCheckedIn: async (parent: any, args: any, context: any, info: any) => {
      return await isCheckedInToday();
    },
  },
  Mutation: {
    CheckIn: async () => {
      return await checkIn();
    },
    AddLog: async (_: any, { input }: any) => {
      return await add({ ...input });
    },
    RemoveLog: async (_: any, { id }: any) => {
      return await remove([id]);
    },
  },
};
export default resolvers;
