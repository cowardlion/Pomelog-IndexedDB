import { FormEvent, useRef } from 'react';
import { gql, useMutation } from '@apollo/client';

import styled from '@emotion/styled';
import { Button, Input } from 'antd';
import moment from 'moment';
import 'moment/locale/ko';
moment.locale('ko');

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
  startAt: Date;
};

export const TimeLogForm = ({ startAt }: Props) => {
  const [addLogMutation] = useMutation(ADD_TIME_LOG);
  const noteRef = useRef<Input | null>(null);
  const tagRef = useRef<Input | null>(null);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const elements = ((event.target as HTMLFormElement).elements as unknown) as FormElements;
    const { note, tag } = elements;

    if (!note.value) {
      alert('필수 입력값이 없습니다.');
      return;
    }

    const newLog = { date: new Date(), note: note.value, tag: tag.value };

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
      },
    });
  };

  return (
    <FormStyled>
      <form onSubmit={handleSubmit}>
        <div className="inputs">
          <Input ref={noteRef} width={'100%'} name="note" placeholder="무슨일을 했나요?" bordered={false} />
          <Input ref={tagRef} name="tag" placeholder="태그를 입력하세요." bordered={false} />
        </div>
        <div className="meta">
          <div>
            <span>{moment(startAt).format('A h:mm')} 부터</span>
            <span> ~ </span>
            <span>{moment().format('A h:mm')} 까지</span>
          </div>
          <div className="right">
            <Button type="primary" htmlType="submit">
              기록하기
            </Button>
          </div>
        </div>
      </form>
    </FormStyled>
  );
};

const FormStyled = styled.div`
  form {
    padding: 5px;
    border: 1px solid #dedede;
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;

    .inputs {
      flex: 1;
      border-bottom: 1px dashed #dedede;
    }

    .meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.8em;
      color: gray;
      padding: 5px 0 0 10px;

      .right {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
`;
