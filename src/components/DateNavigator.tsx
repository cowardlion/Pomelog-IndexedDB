import styled from '@emotion/styled';
import moment from 'moment';
import 'moment/locale/ko';
import { Button } from 'antd';
moment.locale('ko');

export const DateNavigator = () => {
  return (
    <NavigatorStyled>
      <div className="btn-group">
        <Button>이전</Button>
      </div>
      <div>
        <h1>{moment().format('LL dddd')}</h1>
      </div>
      <div className="btn-group">
        <Button>다음</Button>
      </div>
    </NavigatorStyled>
  );
};

const NavigatorStyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  border-bottom: 1px solid #383838;

  .btn-group {
    padding: 0 20px;
    button {
      padding: 4px 8px;
    }
  }
`;
