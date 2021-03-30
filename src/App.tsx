import './App.css';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';

import { TimeLogList } from './components/TimeLogList';

const client = new ApolloClient({
  cache: new InMemoryCache(),
  typeDefs,
  resolvers,
});

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <TimeLogList />
      </div>
    </ApolloProvider>
  );
}

export default App;
