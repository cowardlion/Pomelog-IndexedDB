import styled from '@emotion/styled';
import { useRef, useState, MouseEvent } from 'react';
import { Button, Input, TimePicker } from 'antd';
import { SwapRightOutlined, EditOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import moment from 'moment';
import 'moment/locale/ko';
import type { TimeLog } from '../api/timeLog';
import { msToTime } from '../utils';
import { TIME_LOGS, useMutationRemoveLog, useMutationUpdateLog } from '../graphql/queries';
moment.locale('ko');
const TIME_FORMAT = 'A h:mm';

type RootQuery = {
  isCheckedIn: boolean;
  timeLogs: TimeLog[];
};

type Props = {
  dateStr: string;
  item: TimeLog;
  isEditing: boolean;
  onEdit: (id: number | null) => void;
};

export const TimeLogListItem = ({
  dateStr,
  item: { id, note, startAt, endAt, duration, category, isValid },
  isEditing = false,
  onEdit,
}: Props) => {
  const [startDateAt, setStartDateAt] = useState<Date>(startAt);
  const [endDateAt, setEndDateAt] = useState<Date>(endAt);

  const noteRef = useRef<Input | null>(null);

  const [removeLogMutation] = useMutationRemoveLog();
  const [updateLogMutation] = useMutationUpdateLog();

  const handleSave = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();

    const changes = {
      id,
      note: noteRef.current?.state.value,
      startAt: startDateAt,
      endAt: endDateAt,
    };

    updateLogMutation({
      variables: {
        changes,
      },
      optimisticResponse: true,
      update(cache, { data: { updateLog } }) {
        const data = cache.readQuery({ query: TIME_LOGS, variables: { dateStr } });
        const { timeLogs } = data as RootQuery;

        const newLogs = timeLogs.map((log) => {
          return log.id === id ? updateLog : log;
        });

        cache.modify({
          fields: {
            timeLogs() {
              return newLogs;
            },
          },
        });
      },
    });

    onEdit(null);
  };

  const handleDelete = () => {
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

  const containerClass = classnames('TimeLogList', {
    invalid: !isValid,
    editing: isEditing,
  });

  return (
    <ListItemStyled className={containerClass} onClick={(e) => onEdit(id)}>
      {isEditing ? (
        <div className="content">
          <div className="date-range">
            <div>
              <TimePicker
                value={moment(startDateAt)}
                bordered={false}
                format={TIME_FORMAT}
                placeholder="시작"
                clearIcon={false}
                suffixIcon={false}
                showNow={false}
                onChange={(time: moment.Moment | null, dateString: string) => {
                  if (time) {
                    setStartDateAt(time.toDate());
                  }
                }}
              />
              <span>부터</span>
              <SwapRightOutlined className="time-dash" />

              <TimePicker
                value={moment(endDateAt)}
                bordered={false}
                format={TIME_FORMAT}
                placeholder="종료"
                clearIcon={false}
                suffixIcon={false}
                showNow={false}
                onChange={(time: moment.Moment | null, dateString: string) => {
                  if (time) {
                    setEndDateAt(time.toDate());
                  }
                }}
              />

              <span>까지</span>
            </div>
          </div>

          <div className="body">
            <Input
              ref={noteRef}
              width={'100%'}
              name="note"
              size="large"
              placeholder="무슨일을 했나요?"
              defaultValue={note}
              bordered={false}
              autoFocus={true}
            />
            {!category && <small>카테고리 없음</small>}
          </div>

          <div className="btns">
            <Button shape="round" onClick={handleDelete} icon={<DeleteOutlined />}>
              삭제
            </Button>
            <Button type="primary" shape="round" onClick={handleSave} icon={<SaveOutlined />}>
              저장
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="content">
            <div className="date-range">
              <span>{moment(startAt).format('A h:mm')}</span>
              <SwapRightOutlined className="time-dash" />
              <span>{moment(endAt).format('A h:mm')}</span>
              {isValid ? <span className="duration">{msToTime(duration)}</span> : <span>시간이 겹칩니다.</span>}
            </div>
            <div className="note">{note}</div>
            {!category && <small>카테고리 없음</small>}
          </div>

          <div className="meta">
            <Button type="ghost" icon={<EditOutlined />} style={{ width: 60, border: 'none' }}></Button>
          </div>
        </>
      )}
    </ListItemStyled>
  );
};

const ListItemStyled = styled.li`
  background-color: cornsilk;
  border: 1px solid #aeaeae;
  display: flex;
  justify-content: space-between;
  padding: 10px;
  cursor: pointer;
  margin-bottom: 2px;
  border-radius: 4px;

  &.editing {
    flex-direction: column;
    border: 1px solid #333;
    margin: 5px 0;
    background-color: #fff;
    margin-left: -10px;

    :hover {
      background-color: #fff;
      /* transition: background-color 1s; */
    }

    small {
      padding-left: 10px;
    }

    .btns {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px dashed #aeaeae;
      padding-top: 10px;
    }
  }

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
    transition: margin 0.2s;
    background-color: aliceblue;
    margin-left: -10px;
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
