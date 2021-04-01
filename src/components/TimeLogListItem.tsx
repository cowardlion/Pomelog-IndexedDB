import styled from '@emotion/styled';
import { gql, useMutation } from '@apollo/client';
import moment from 'moment';
import 'moment/locale/ko';
import type { TimeLog } from '../api/timeLogs';
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

const REMOVE_LOG = gql`
  mutation RemoveLog($input: Int!) {
    RemoveLog(id: $input) @client
  }
`;

type Props = {
  item: TimeLog;
};

type RootQuery = {
  isCheckedIn: boolean;
  getTodayLogs: TimeLog[];
};

export const TimeLogListItem = ({ item: { id, note, date } }: Props) => {
  const [removeLogMutation] = useMutation(REMOVE_LOG);
  const handleDeleteLog = () => {
    removeLogMutation({
      variables: { input: id },
      optimisticResponse: true,
      update(cache) {
        const data = cache.readQuery({ query: TODAY_LOGS });
        const { getTodayLogs } = data as RootQuery;
        const newLogs = getTodayLogs.filter((log) => log.id !== id);

        cache.modify({
          fields: {
            getTodayLogs() {
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
    <ListItemStyled className="TimeLogList">
      <div className="content">
        <strong>{moment(date).format('A h:mm')}</strong>
        <span>{note}</span>
      </div>

      <div className="action-btn-group">
        <button onClick={handleDeleteLog}>삭제</button>
      </div>
    </ListItemStyled>
  );
};

const ListItemStyled = styled.li`
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
`;
