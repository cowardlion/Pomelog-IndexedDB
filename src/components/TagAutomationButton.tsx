import { Button } from 'antd';
import { TagOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';

const ButtonStyled = styled.span`
  margin-right: 5px;
`;

export const TagAutomationButton = () => {
  return (
    <ButtonStyled>
      <Button icon={<TagOutlined />}>태그 자동화</Button>
    </ButtonStyled>
  );
};
