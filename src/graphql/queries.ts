import { gql } from '@apollo/client';

export const CURRENT_DATE_STR = gql`
  query {
    currentDateStr @client
  }
`;

export const TIME_LOGS = gql`
  query GetTimeLogs($dateStr: String!) {
    timeLogs(dateStr: $dateStr) @client {
      id
      startAt
      endAt
      note
      duration
      tags
      isValid
    }
  }
`;
