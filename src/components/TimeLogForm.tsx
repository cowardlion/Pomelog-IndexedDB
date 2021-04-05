import { FormEvent, useRef, useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import styled from '@emotion/styled';
import { Button, Input, TimePicker, Switch, Tooltip } from 'antd';
import { SwapRightOutlined, FormOutlined } from '@ant-design/icons';
import moment from 'moment';
import 'moment/locale/ko';
import { getEndAtFromtStartAt } from '../utils';
import { CheckPointButton } from './CheckPointButton';
moment.locale('ko');

const TIME_FORMAT = 'A h:mm';

const ADD_TIME_LOG = gql`
  mutation AddLog($input: InputLog!) {
    addLog(input: $input) @client
  }
`;

type FormElements = {
  note: HTMLInputElement;
  tag: HTMLInputElement;
};

type Props = {
  dateStr: string;
  startAt: Date;
  disableAutoSelect: boolean;
};

export const TimeLogForm = ({ dateStr, startAt, disableAutoSelect = false }: Props) => {
  const [addLogMutation] = useMutation(ADD_TIME_LOG);
  const noteRef = useRef<Input | null>(null);
  const tagRef = useRef<Input | null>(null);
  const [startDateAt, setStartDateAt] = useState<Date>(startAt);
  const [endDateAt, setEndDateAt] = useState<Date>(() => getEndAtFromtStartAt(startDateAt, dateStr, disableAutoSelect));
  const [isAutoTimePick, setAutoTimePick] = useState(() => {
    if (disableAutoSelect) {
      return false;
    }
    return true;
  });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const elements = ((event.target as HTMLFormElement).elements as unknown) as FormElements;
    const { note, tag } = elements;

    if (!note.value) {
      alert('필수 입력값이 없습니다.');
      return;
    }

    const newLog = {
      startAt: startDateAt,
      endAt: isAutoTimePick ? new Date() : endDateAt,
      note: note.value,
      tag: tag.value,
    };

    addLogMutation({
      variables: {
        input: newLog,
      },
      update(cache, { data }) {
        const logId = data.AddLog;

        cache.modify({
          fields: {
            timeLogs(existingLogs) {
              return [...existingLogs, { id: logId, ...newLog }];
            },
            isCheckedIn() {
              return true;
            },
          },
        });

        noteRef.current?.setValue('');
        tagRef.current?.setValue('');
        setStartDateAt(newLog.endAt);
        setEndDateAt(getEndAtFromtStartAt(newLog.endAt, dateStr, disableAutoSelect));
      },
    });
  };

  return (
    <FormStyled>
      <form onSubmit={handleSubmit}>
        <div className="header">
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

            {isAutoTimePick ? (
              <strong>현재</strong>
            ) : (
              <TimePicker
                value={moment(endDateAt)}
                bordered={false}
                format={TIME_FORMAT}
                placeholder="종료"
                clearIcon={false}
                suffixIcon={false}
                showNow={!disableAutoSelect}
                onChange={(time: moment.Moment | null, dateString: string) => {
                  if (time) {
                    setEndDateAt(time.toDate());
                  }
                }}
              />
            )}
            <span>까지</span>
          </div>
          <div className="picker-switch">
            <Tooltip
              placement="topRight"
              title={isAutoTimePick ? '종료 시간을 현재 시간으로 입력합니다' : '종료 시간을 수동 입력합니다'}
            >
              <Switch
                disabled={disableAutoSelect}
                checked={isAutoTimePick}
                onChange={(value) => setAutoTimePick(value)}
              />
            </Tooltip>
          </div>
        </div>
        <div className="body">
          <Input
            ref={noteRef}
            width={'100%'}
            name="note"
            size="large"
            placeholder="무슨일을 했나요?"
            bordered={false}
            autoFocus={true}
          />
          <Input ref={tagRef} name="tag" placeholder="태그를 입력하세요." bordered={false} />
        </div>
        <div className="footer">
          <div>
            {!disableAutoSelect && (
              <CheckPointButton
                dateStr={dateStr}
                onClick={() => {
                  setStartDateAt(new Date());
                }}
              />
            )}
          </div>
          <div className="right">
            <Button type="primary" icon={<FormOutlined />} htmlType="submit">
              기록하기
            </Button>
          </div>
        </div>
      </form>
    </FormStyled>
  );
};

const FormStyled = styled.div`
  background-color: aliceblue;

  form {
    border: 1px solid #cdcdcd;
    border-radius: 3px;
    display: flex;

    flex-direction: column;
    margin-bottom: 10px;

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      font-size: 0.8em;
      border-bottom: 1px solid #dedede;
      color: gray;
      height: 50px;

      .ant-picker {
        padding: 4px 0;

        input {
          font-weight: bold;
          color: gray;
          width: 70px;
        }
      }

      .time-dash {
        padding: 0 5px;
      }

      .picker-switch {
        .message {
          margin-right: 8px;
        }
      }
    }

    .body {
      flex: 1;
      padding: 0 10px;
      background-color: #fff;
      border-bottom: 1px solid #dedede;

      input[name='note'] {
        border-bottom: 1px dashed #dedede;
        padding: 10px;
      }

      input[name='tag'] {
        padding: 10px;
      }
    }

    .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.8em;
      color: gray;
      padding: 5px;

      .right {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
`;
