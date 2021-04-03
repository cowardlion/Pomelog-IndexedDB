import { gql } from '@apollo/client';

export const CURRENT_DATE_STR = gql`
  query {
    currentDateStr @client
  }
`;

export const TIME_LOGS = gql`
  query GetTimeLogs($dateStr: String!) {
    isCheckedIn(dateStr: $dateStr) @client
    timeLogs(dateStr: $dateStr) @client {
      id
      date
      note
      duration
      tags
    }
  }
`;
