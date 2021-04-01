const typeDefs = `
type Scalars = {
  ID: number
  String: string
  Boolean: boolean
  Int: number
  Float: number
  /** An ISO-8601 encoded date string. */
  Date: string
  /** Any type value. Be careful to handling this type data. */
  Any: any
}

type TimeLog {
  id: ID!
  date: Date!
  note: String!
  tags: String[]
  duration: Int
}

type InputLog {
  date: Date
  note: String!
  tag: String
} 

type Query {
  timeLogs(input: Date): [TimeLog]!
  isCheckedIn: Boolean!
}

type Mutation {
  CheckIn: TimeLog!
  AddLog(input: InputLog!)
  RemoveLog(input: Int!): Boolean!
}
`;

export default typeDefs;
