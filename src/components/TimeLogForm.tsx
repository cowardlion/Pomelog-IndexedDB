import { FormEvent, useRef } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import styled from '@emotion/styled';
import { Button, Input } from 'antd';

const CHECK_IN_OUT = gql`
  query {
    isCheckedIn @client
  }
`;

const ADD_TIME_LOG = gql`
  mutation AddLog($input: InputLog!) {
    AddLog(input: $input) @client
  }
`;

type FormElements = {
  note: HTMLInputElement;
  tag: HTMLInputElement;
};

export const TimeLogForm = () => {
  const { loading, data } = useQuery(CHECK_IN_OUT);
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

    const newLog = { date: new Date(), note: note.value, tag: tag.value.split(',') };

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

  if (loading || !data.isCheckedIn) {
    return null;
  }

  return (
    <FormStyled onSubmit={handleSubmit}>
      <div className="left">
        <Input ref={noteRef} name="note" size={'middle'} placeholder="방금 무슨일을 했나요?" bordered={false} />
        <Input ref={tagRef} name="tag" size={'small'} placeholder="태그를 입력하세요." bordered={false} />
      </div>
      <div className="right">
        <Button type="primary" htmlType="submit">
          기록하기
        </Button>
      </div>
    </FormStyled>
  );
};

const FormStyled = styled.form`
  padding: 5px;
  border: 1px solid #dedede;
  border-radius: 3px;
  margin-bottom: 10px;
  display: flex;

  .left {
    flex: 1;

    input[name='note'] {
      padding: 5px;
      border: none;
      border-bottom: 1px solid #ededed;
      width: 100%;
    }

    input[name='tag'] {
      border: none;
      padding: 5px;

      :focus {
        border: none;
      }
    }
  }

  .right {
    width: 100px;
    display: flex;
    justify-content: center;
    align-items: center;

    button {
      height: 50px;
    }
  }
`;
