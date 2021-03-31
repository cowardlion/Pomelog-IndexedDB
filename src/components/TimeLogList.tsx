import styled from '@emotion/styled';
import { gql, useQuery } from '@apollo/client';
import type { TimeLog } from '../api/timeLogs';
import moment from 'moment';
import 'moment/locale/ko';
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
    return <div>체크인을 먼저 하세요.</div>;
  }

  console.log('timeLogs', getTodayLogs);
  return (
    <ListStyled className="TimeLogList">
      <ul>
        {getTodayLogs.map(({ id, date, note }: TimeLog) => {
          return (
            <li key={id}>
              <div className="content">
                <strong>{moment(date).format('A h:mm')}</strong>
                <span>{note}</span>
              </div>

              <div className="action-btn-group">
                <button>삭제</button>
              </div>
            </li>
          );
        })}
      </ul>
    </ListStyled>
  );
};

const ListStyled = styled.div`
  ul {
    list-style: none;

    li {
      padding: 10px 0;
      border-bottom: 1px dashed #aeaeae;
      display: flex;
      justify-content: space-between;

      .content {
        display: flex;
        align-items: center;

        strong {
          margin-right: 20px;
        }
      }

      .action-btn-group {
        width: 100px;
        text-align: right;

        button {
          padding: 4px 8px;
        }
      }
    }
  }
`;
