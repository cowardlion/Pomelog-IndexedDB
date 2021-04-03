import styled from '@emotion/styled';
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
  return (
    <ListStyled className="TimeLogList">
      {isCheckedIn ? (
        <ul>
          {items.map((item: TimeLog) => (
            <TimeLogListItem key={item.id} dateStr={dateStr} item={item} />
          ))}
        </ul>
      ) : (
        <div className="message">{isPast ? '남긴 기록이 없습니다.' : '체크인을 먼저 하세요.'}</div>
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
