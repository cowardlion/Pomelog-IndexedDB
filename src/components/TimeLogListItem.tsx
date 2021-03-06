import styled from '@emotion/styled';
import { useRef, useState, MouseEvent } from 'react';
import { Button, Input, TimePicker } from 'antd';
import { SwapRightOutlined, EditOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import moment from 'moment';
import 'moment/locale/ko';
import type { TimeLog } from '../api/timeLog';
import { msToTime } from '../utils';
import { APP_STATES, useMutationRemoveLog, useMutationUpdateLog } from '../graphql/queries';
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
        const data = cache.readQuery({ query: APP_STATES, variables: { dateStr } });
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
        const data = cache.readQuery({ query: APP_STATES, variables: { dateStr } });
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
    invalid: !isValid || !category,
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
                placeholder="??????"
                clearIcon={false}
                suffixIcon={false}
                showNow={false}
                onChange={(time: moment.Moment | null, dateString: string) => {
                  if (time) {
                    setStartDateAt(time.toDate());
                  }
                }}
              />
              <span>??????</span>
              <SwapRightOutlined className="time-dash" />

              <TimePicker
                value={moment(endDateAt)}
                bordered={false}
                format={TIME_FORMAT}
                placeholder="??????"
                clearIcon={false}
                suffixIcon={false}
                showNow={false}
                onChange={(time: moment.Moment | null, dateString: string) => {
                  if (time) {
                    setEndDateAt(time.toDate());
                  }
                }}
              />

              <span>??????</span>
            </div>
          </div>

          <div className="body">
            <Input
              ref={noteRef}
              width={'100%'}
              name="note"
              size="large"
              placeholder="???????????? ??????????"
              defaultValue={note}
              bordered={false}
              autoFocus={true}
            />
          </div>

          <div className="btns">
            <Button shape="round" onClick={handleDelete} icon={<DeleteOutlined />}>
              ??????
            </Button>
            <Button type="primary" shape="round" onClick={handleSave} icon={<SaveOutlined />}>
              ??????
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
              {isValid ? (
                <span className="duration">{msToTime(duration)}</span>
              ) : (
                <span className="time-overlap">????????? ????????????.</span>
              )}
            </div>
            <div className="note">{note}</div>
            {category ? (
              <>
                <span className="emoji" dangerouslySetInnerHTML={{ __html: `&#x${category.emoji};` }} />
                <small>{category.name}</small>
              </>
            ) : (
              <small>???????????? ??????</small>
            )}
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
    background-color: #e7ddc7;

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
    /* background-color: aliceblue; */
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

    .emoji {
      display: inline-block;
      width: 25px;
    }

    .time-overlap {
      color: #c70d0d;
      margin-left: 10px;
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
