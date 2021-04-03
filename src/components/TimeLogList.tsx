import styled from '@emotion/styled';
import { gql, useQuery } from '@apollo/client';
import type { TimeLog } from '../api/timeLogs';
import moment from 'moment';
import 'moment/locale/ko';
import { TimeLogListItem } from './TimeLogListItem';
moment.locale('ko');

const TIME_LOGS = gql`
  query {
    isCheckedIn @client
    timeLogs @client {
      id
      date
      note
      duration
      tags
    }
  }
`;

export const TimeLogList = () => {
  const { loading, data } = useQuery(TIME_LOGS);

  if (loading) {
    return <div>Loading....</div>;
  }

  const { timeLogs, isCheckedIn } = data;

  if (!isCheckedIn) {
    return (
      <ListStyled>
        <div className="message">체크인을 먼저 하세요.</div>
      </ListStyled>
    );
  }

  return (
    <ListStyled className="TimeLogList">
      <ul>
        {timeLogs.map((timeLog: TimeLog) => (
          <TimeLogListItem key={timeLog.id} item={timeLog} />
        ))}
      </ul>
    </ListStyled>
  );
};

const ListStyled = styled.div`
  ul {
    list-style: none;
  }

  .message {
    padding: 20px 0 10px 0;
    text-align: center;
  }
`;
