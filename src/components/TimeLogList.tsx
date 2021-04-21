import styled from '@emotion/styled';
import { Empty } from 'antd';
import { useState } from 'react';
import classnames from 'classnames';
import type { TimeLog } from '../api/timeLogs';
import moment from 'moment';
import 'moment/locale/ko';
import { TimeLogListItem } from './TimeLogListItem';
moment.locale('ko');

type Props = {
  dateStr: string;
  items: TimeLog[];
};

export const TimeLogList = ({ items, dateStr }: Props) => {
  const isEmpty = items.length === 0;
  const noBottomBorder = 3 < items.length;
  const containerClass = classnames('TimeLogList', {
    'empty-list': isEmpty,
  });

  const [curEditItem, setEditItem] = useState<number | null>(null);

  const handleEditItem = (id: number | null) => {
    setEditItem(id);
  };

  return (
    <ListStyled className={containerClass}>
      {isEmpty ? (
        <div>
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="남겨진 기록이 없습니다." />
        </div>
      ) : (
        <ul className={noBottomBorder ? 'bottom-border-line' : ''}>
          {items.map((item: TimeLog) => (
            <TimeLogListItem
              key={item.id}
              dateStr={dateStr}
              item={item}
              onEdit={handleEditItem}
              isEditing={curEditItem === item.id}
            />
          ))}
        </ul>
      )}
    </ListStyled>
  );
};

const ListStyled = styled.div`
  /* background-color: cornsilk; */
  /* border: 1px solid #383838; */
  min-height: 200px;
  border-radius: 3px;
  margin-bottom: 10px;
  padding: 0;

  &.empty-list {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  ul {
    list-style: none;

    /* &.bottom-border-line li:last-child {
      border: none;
    } */
  }

  .message {
    padding: 20px 0 10px 0;
    text-align: center;
  }
`;
