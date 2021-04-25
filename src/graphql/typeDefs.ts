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
  startAt: Date!
  endAt: Date!
  note: String!
  category: String
  duration: Int
  isValid: Boolean
}

type Category {
  name: String!
  emoji: String!
  keywords: [String]!
  order: Int
}

type InputLog {
  startAt: Date
  endAt: Date
  note: String!
} 

type UpdateLog {
  startAt: Date!
  endAt: Date!
  note: String!
} 

type AppState {
  timeLogs(date: Date!): [TimeLog]!
  categories: [Category]!
}


type Mutation {
  checkPoint(dateStr: String!): TimeLog!
  addLog(input: InputLog!): ID
  removeLog(id: ID!): ID
  updateLog(id: ID!, changes: UpdateLog): ID
}
`;

export default typeDefs;
