import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider, ApolloClient } from '@apollo/client';
import { ConfigProvider } from 'antd';
import resolvers from './graphql/resolvers';
import cache from './graphql/cache';

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import 'moment/locale/ko';
import locale from 'antd/lib/locale/ko_KR';

const client = new ApolloClient({
  cache,
  resolvers,
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <ConfigProvider locale={locale}>
        <App />
      </ConfigProvider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
