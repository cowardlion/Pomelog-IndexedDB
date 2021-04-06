import styled from '@emotion/styled';
import { gql, useMutation } from '@apollo/client';
import { Button } from 'antd';
import { SwapRightOutlined } from '@ant-design/icons';
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

export const TimeLogListItem = ({ dateStr, item: { id, note, startAt, endAt, duration, isValid } }: Props) => {
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
          },
        });
      },
    });
  };

  return (
    <ListItemStyled className={isValid ? '' : 'invalid'}>
      <div className="content">
        <div className="date-range">
          <span>{moment(startAt).format('A h:mm')}</span>
          <SwapRightOutlined className="time-dash" />
          <span>{moment(endAt).format('A h:mm')}</span>
          {isValid ? <span className="duration">{msToTime(duration)}</span> : <span>시간이 겹칩니다.</span>}
        </div>
        <div className="note">{note}</div>
        <div className="tag"></div>
      </div>
      <div className="meta">
        <Button onClick={handleDeleteLog}>삭제</Button>
      </div>
    </ListItemStyled>
  );
};

const ListItemStyled = styled.li`
  border-bottom: 1px dashed #aeaeae;
  display: flex;
  justify-content: space-between;
  padding: 10px;
  cursor: pointer;

  &.invalid {
    background-color: goldenrod;

    .meta {
      width: auto;
      color: #d12323;
      font-size: 0.9em;

      > span {
        margin-right: 10px;
      }
    }
  }

  :hover {
    background-color: aliceblue;
  }

  .content {
    .date-range {
      font-size: 0.875em;
      color: #333;
      line-height: 130%;

      .duration {
        margin-left: 5px;
      }
    }

    .note {
      flex: 1;
    }
  }

  .meta {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;

    button {
      padding: 4px 8px;
    }
  }
`;
