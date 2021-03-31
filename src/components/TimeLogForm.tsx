import { FormEvent } from 'react';
import styled from '@emotion/styled';

type FormElements = {
  note: HTMLInputElement;
  tag: HTMLInputElement;
};

export const TimeLogForm = () => {
  const handleSubmit = (event: FormEvent) => {
    const elements = ((event.target as HTMLFormElement).elements as unknown) as FormElements;
    const { note, tag } = elements;

    if (!note.value) {
      alert('필수 입력값이 없습니다.');
      return event.preventDefault();
    }

    console.log('검증할꺼야....', note, tag);
  };

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
  input[name='note'] {
    /* width: 70%; */
  }
  input[name='tag'] {
    width: 35%;
  }

  input[type='submit'] {
    width: 100px;
    padding: 10px;
  }
`;
