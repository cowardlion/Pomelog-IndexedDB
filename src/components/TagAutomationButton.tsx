import { Button } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';

const ButtonStyled = styled.span``;

export const TagAutomationButton = () => {
  return (
    <ButtonStyled>
      <Button icon={<SettingOutlined />}>태그 자동화</Button>
    </ButtonStyled>
  );
};
