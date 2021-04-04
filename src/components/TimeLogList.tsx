import styled from '@emotion/styled';
import { Empty } from 'antd';
import type { TimeLog } from '../api/timeLogs';
import moment from 'moment';
import 'moment/locale/ko';
import { TimeLogListItem } from './TimeLogListItem';
moment.locale('ko');

type Props = {
  dateStr: string;
  isPast: boolean;
  isCheckedIn: boolean;
  items: TimeLog[];
};

export const TimeLogList = ({ isPast, isCheckedIn, items, dateStr }: Props) => {
  const isEmpty = items.length === 0;

  return (
    <ListStyled className="TimeLogList">
      {isEmpty ? (
        <div>
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="남겨진 기록이 없습니다." />
        </div>
      ) : (
        <ul>
          {items.map((item: TimeLog) => (
            <TimeLogListItem key={item.id} dateStr={dateStr} item={item} />
          ))}
        </ul>
      )}
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
