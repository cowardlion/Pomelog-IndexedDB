import styled from '@emotion/styled';
import { useState } from 'react';
import { Button, Radio, Modal } from 'antd';
import { BarsOutlined, PicCenterOutlined, SettingOutlined } from '@ant-design/icons';

export const Configuration = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <ConfigStyled>
      <div className="display-style">
        <Radio.Group defaultValue="static" buttonStyle="solid">
          <Radio.Button value="static">
            <BarsOutlined />
          </Radio.Button>
          <Radio.Button value="dynamic">
            <PicCenterOutlined />
          </Radio.Button>
        </Radio.Group>
      </div>
      <div>
        <Button icon={<SettingOutlined />} onClick={showModal}>
          카테고리 설정
        </Button>
        <Modal title="카테고리 설정" width={700} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>
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
