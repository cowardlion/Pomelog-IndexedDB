import { FormEvent } from 'react';
import { gql, useQuery } from '@apollo/client';
import styled from '@emotion/styled';

const CHECK_IN_OUT = gql`
  query {
    isCheckedIn @client
  }
`;

type FormElements = {
  note: HTMLInputElement;
  tag: HTMLInputElement;
};

export const TimeLogForm = () => {
  const { loading, data } = useQuery(CHECK_IN_OUT);

  const handleSubmit = (event: FormEvent) => {
    const elements = ((event.target as HTMLFormElement).elements as unknown) as FormElements;
    const { note } = elements;

    if (!note.value) {
      alert('필수 입력값이 없습니다.');
      return event.preventDefault();
    }
  };

  if (loading || !data.isCheckedIn) {
    return null;
  }

  return (
    <FormStyled onSubmit={handleSubmit}>
      <div className="left">
        <input name="note" type="text" placeholder="방금 무슨일을 했나요?" />
        <input name="tag" type="text" placeholder="태그를 입력하세요." />
      </div>
      <div className="right">
        <input type="submit" value="기록하기" />
      </div>
    </FormStyled>
  );
};

const FormStyled = styled.form`
  padding: 10px 0;
  display: flex;
  justify-content: space-between;

  .left {
    display: flex;
    width: 100%;
  }
  .right {
    width: 100px;
  }

  input[type='text'] {
    padding: 10px 0;
    border: none;
    border-bottom: 1px solid #222;
    margin-right: 10px;
    width: 100%;
  }

  input[name='tag'] {
    width: 35%;
  }

  input[type='submit'] {
    width: 100px;
    padding: 10px;
  }
`;
