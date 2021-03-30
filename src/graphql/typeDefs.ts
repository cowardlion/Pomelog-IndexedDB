const typeDefs = `
type TimeLog {
  id: Int!
  date: Date!
  note: string!
  tags: string[]
  duration: number
}
type Query {
  getTodayLogs: [TimeLog]
}
`;

export default typeDefs;
