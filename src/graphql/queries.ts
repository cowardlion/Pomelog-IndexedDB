import { gql, useMutation } from '@apollo/client';

export const CURRENT_DATE_STR = gql`
  query {
    currentDateStr @client
  }
`;

export const APP_STATES = gql`
  query appState($dateStr: String!) {
    timeLogs(dateStr: $dateStr) @client {
      id
      startAt
      endAt
      note
      duration
      isValid
    }
    categories @client {
      id
      name
      emoji
      keywords
      order
    }
  }
`;

export const TIME_LOGS = gql`
  query getTimeLogs($dateStr: String!) {
    timeLogs(dateStr: $dateStr) @client {
      id
      startAt
      endAt
      note
      duration
      isValid
    }
  }
`;

const CREATE_LOG = gql`
  mutation AddLog($input: InputLog!) {
    addLog(input: $input) @client
  }
`;

const REMOVE_LOG = gql`
  mutation RemoveLog($id: ID!) {
    removeLog(id: $id) @client
  }
`;

const UPDATE_LOG = gql`
  mutation UpdateLog($changes: UpdateLog!) {
    updateLog(changes: $changes) @client
  }
`;

export const useMutationRemoveLog = () => useMutation(REMOVE_LOG);
export const useMutationUpdateLog = () => useMutation(UPDATE_LOG);
export const useMutationCreateLog = () => useMutation(CREATE_LOG);
