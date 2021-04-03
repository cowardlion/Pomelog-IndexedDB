import styled from '@emotion/styled';
import { gql, useMutation } from '@apollo/client';
import { Button } from 'antd';
import moment from 'moment';
import 'moment/locale/ko';
import type { TimeLog } from '../api/timeLogs';
import { msToTime } from '../utils';
import { TIME_LOGS } from '../graphql/queries';

moment.locale('ko');

const REMOVE_LOG = gql`
  mutation RemoveLog($id: ID!) {
    removeLog(id: $id) @client
  }
`;

type Props = {
  dateStr: string;
  item: TimeLog;
};

type RootQuery = {
  isCheckedIn: boolean;
  timeLogs: TimeLog[];
};

export const TimeLogListItem = ({ dateStr, item: { id, note, date, duration } }: Props) => {
  const [removeLogMutation] = useMutation(REMOVE_LOG);

  const handleDeleteLog = () => {
    removeLogMutation({
      variables: { id },
      optimisticResponse: true,
      update(cache) {
        const data = cache.readQuery({ query: TIME_LOGS, variables: { dateStr } });
        const { timeLogs } = data as RootQuery;
        const newLogs = timeLogs.filter((log) => log.id !== id);

        cache.modify({
          fields: {
            timeLogs() {
              return newLogs;
            },
            isCheckedIn() {
              return newLogs.length === 0 ? false : true;
            },
          },
        });
      },
    });
  };

  return (
    <ListItemStyled>
      <div className="content">
        <div className="date">
          <strong>{moment(date).format('A h:mm')}</strong>
        </div>
        <div className="note">
          <div>{note}</div>
        </div>
      </div>
      <div className="meta">
        <span className="duration">{msToTime(duration)}</span>
        <Button onClick={handleDeleteLog}>삭제</Button>
      </div>
    </ListItemStyled>
  );
};

const ListItemStyled = styled.li`
  border-bottom: 1px dashed #aeaeae;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  height: 50px;

  :hover {
    background-color: aliceblue;
  }

  .content {
    display: flex;
    align-items: center;
    flex: 1;

    .date {
      width: 90px;
    }

    .note {
      flex: 1;
    }
  }

  .meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 110px;
    text-align: right;

    .duration {
      font-size: 0.8em;
    }

    button {
      padding: 4px 8px;
    }
  }
`;
