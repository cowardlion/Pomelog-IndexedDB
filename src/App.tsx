import './App.less';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';

import { TimeLogList } from './components/TimeLogList';
import { CheckInOutButton } from './components/CheckInOutButton';
import { TagAutomationButton } from './components/TagAutomationButton';
import { TimeLogForm } from './components/TimeLogForm';
import { DateNavigator } from './components/DateNavigator';

const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      State: {
        fields: {
          currentDate: {
            read(_, { variables }) {
              return new Date();
            },
          },
        },
      },
    },
  }),
  typeDefs,
  resolvers,
});

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <DateNavigator />
        <TimeLogList />
        <TimeLogForm />
        <TagAutomationButton />
        <CheckInOutButton />
      </div>
    </ApolloProvider>
  );
}

export default App;
