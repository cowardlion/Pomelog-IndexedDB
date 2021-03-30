import { gql, useQuery } from '@apollo/client';
import type { TimeLog } from '../api/timeLogs';
import moment from 'moment';

const TODAY_LOGS = gql`
  query {
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

  const { getTodayLogs } = data;

  console.log('timeLogs', getTodayLogs);
  return (
    <div className="TimeLogList">
      <ul>
        {getTodayLogs.map(({ id, date, note }: TimeLog) => {
          return (
            <li key={id}>
              {moment(date).format('A h:mm')} {note}{' '}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
