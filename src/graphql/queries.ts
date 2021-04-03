import { gql } from '@apollo/client';

export const CURRENT_DATE_STR = gql`
  query {
    currentDateStr @client
  }
`;

export const TIME_LOGS = gql`
  query GetTimeLogs($date: Date!) {
    isCheckedIn(date: $date) @client
    timeLogs(date: $date) @client {
      id
      date
      note
      duration
      tags
    }
  }
`;
