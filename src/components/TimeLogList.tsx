import styled from '@emotion/styled';
import { gql, useQuery } from '@apollo/client';
import type { TimeLog } from '../api/timeLogs';
import moment from 'moment';
import 'moment/locale/ko';
import { TimeLogListItem } from './TimeLogListItem';
moment.locale('ko');

const TODAY_LOGS = gql`
  query {
    isCheckedIn @client
    getTodayLogs @client {
      id
      date
      note
    }
  }
`;

export const TimeLogList = () => {
  const { loading, data } = useQuery(TODAY_LOGS);

  if (loading) {
    return <div>Loading....</div>;
  }

  const { getTodayLogs, isCheckedIn } = data;

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
        {getTodayLogs.map((timeLog: TimeLog) => (
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
