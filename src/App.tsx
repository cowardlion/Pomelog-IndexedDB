import './App.css';
import styled from '@emotion/styled';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';

import { TimeLogList } from './components/TimeLogList';
import { CheckInOutButton } from './components/CheckInOutButton';
import { TagAutomationButton } from './components/TagAutomationButton';
import { TimeLogForm } from './components/TimeLogForm';
import { DateNavigator } from './components/DateNavigator';

const client = new ApolloClient({
  cache: new InMemoryCache(),
  typeDefs,
  resolvers,
});

function App() {
  return (
    <ApolloProvider client={client}>
      <AppStyled className="App">
        <DateNavigator />
        <TimeLogList />
        <TimeLogForm />
        <TagAutomationButton />
        <CheckInOutButton />
      </AppStyled>
    </ApolloProvider>
  );
}

const AppStyled = styled.div`
  padding: 20px;
`;

export default App;
