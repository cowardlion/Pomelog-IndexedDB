import styled from '@emotion/styled';
import { Button } from 'antd';
import { BarsOutlined, PicCenterOutlined, SettingOutlined } from '@ant-design/icons';

export const Configuration = () => {
  return (
    <ConfigStyled>
      <div className="display-style">
        <Button type="primary" icon={<BarsOutlined />} />
        <Button icon={<PicCenterOutlined />} />
      </div>
      <div>
        <Button icon={<SettingOutlined />}>설정</Button>
      </div>
    </ConfigStyled>
  );
};

const ConfigStyled = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 5px 0;

  .display-style {
    button {
      width: 50px;
    }
  }
`;
