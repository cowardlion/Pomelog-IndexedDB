import styled from '@emotion/styled';
import { useState } from 'react';
import { Button, Radio, Modal } from 'antd';
import { BarsOutlined, PicCenterOutlined, SettingOutlined, PlusCircleOutlined } from '@ant-design/icons';
import Picker, { IEmojiData } from 'emoji-picker-react';
import { SortableTable } from './Sortable/SortableTable';
import { Category } from '../api/category';

type Props = {
  items: Category[];
};

export const Configuration = ({ items }: Props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [chosenEmoji, setChosenEmoji] = useState<any>(null);

  console.log('---->', items);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onEmojiClick = (event: React.MouseEvent, emojiObject: IEmojiData) => {
    setChosenEmoji(emojiObject);
    console.log(emojiObject);
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
        <Modal
          title="카테고리 설정"
          width={700}
          maskClosable={false}
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <SortableTable categories={items} />
          <Button type="primary" icon={<PlusCircleOutlined />} style={{ width: '100%', height: 50, fontSize: '1.2em' }}>
            추가
          </Button>
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
