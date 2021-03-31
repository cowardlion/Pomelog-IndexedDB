import styled from '@emotion/styled';
import moment from 'moment';
import 'moment/locale/ko';
moment.locale('ko');

export const DateNavigator = () => {
  return (
    <NavigatorStyled>
      <h1>{moment().format('LL dddd')}</h1>
    </NavigatorStyled>
  );
};

const NavigatorStyled = styled.div`
  border-bottom: 1px solid #383838;
`;
