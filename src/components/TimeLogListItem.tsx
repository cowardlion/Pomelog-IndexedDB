import styled from '@emotion/styled';
import { gql, useMutation } from '@apollo/client';
import { Button } from 'antd';
import moment from 'moment';
import 'moment/locale/ko';
import type { TimeLog } from '../api/timeLogs';
moment.locale('ko');

const TODAY_LOGS = gql`
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
  timeLogs: TimeLog[];
};

const msToTime = (s: number) => {
  if (s === 0) {
    return null;
  }

  const ms = s % 1000;
  s = (s - ms) / 1000;
  const secs = s % 60;
  s = (s - secs) / 60;
  const mins = s % 60;
  const hrs = (s - mins) / 60;

  let timeStr = '';
  if (hrs) {
    timeStr += hrs + '시간 ';
  }

  if (mins) {
    timeStr += mins + '분 ';
  }

  return timeStr;
};

export const TimeLogListItem = ({ item: { id, note, date, duration, tags } }: Props) => {
  const [removeLogMutation] = useMutation(REMOVE_LOG);
  const handleDeleteLog = () => {
    removeLogMutation({
      variables: { input: id },
      optimisticResponse: true,
      update(cache) {
        const data = cache.readQuery({ query: TODAY_LOGS });
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

  console.log('tags', tags);

  return (
    <ListItemStyled className="TimeLogList">
      <div className="content">
        <strong>{moment(date).format('A h:mm')}</strong>
        <span>{note}</span>
      </div>

      <div className="meta">
        <span className="duration">{msToTime(duration)}</span>
        <Button onClick={handleDeleteLog}>삭제</Button>
      </div>
    </ListItemStyled>
  );
};

const ListItemStyled = styled.li`
  padding: 10px 0;
  border-bottom: 1px dashed #aeaeae;
  display: flex;
  justify-content: space-between;
  cursor: pointer;

  :hover {
    background-color: aliceblue;
  }

  .content {
    display: flex;
    align-items: center;

    strong {
      margin-right: 20px;
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
