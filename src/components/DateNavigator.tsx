import styled from '@emotion/styled';
import cache from '../graphql/cache';
import { CURRENT_DATE_STR, TIME_LOGS } from '../graphql/queries';
import moment from 'moment';
import 'moment/locale/ko';
import { Button } from 'antd';
import { listByDate } from '../api/timeLogs';
moment.locale('ko');

type Props = {
  dateStr: string;
  onChangeDate: (dateStr: string) => void;
};

export const DateNavigator = ({ dateStr: currentDateStr, onChangeDate }: Props) => {
  const currentDate = moment(new Date(currentDateStr));
  const dateStr = currentDate.format('LL dddd');

  const handleChangeDate = async (amount: -1 | 1) => {
    currentDate.add(amount, 'day');
    const date = currentDate.toDate();
    const timeLogs = await listByDate(date);
    const currentDateStr = moment(date).format('YYYY-MM-DD');

    cache.writeQuery({
      query: CURRENT_DATE_STR,
      data: {
        currentDateStr,
      },
    });

    cache.writeQuery({
      query: TIME_LOGS,
      data: {
        timeLogs,
      },
      variables: {
        date,
      },
    });

    onChangeDate(currentDateStr);
  };

  return (
    <NavigatorStyled>
      <div className="btn-group">
        <Button onClick={() => handleChangeDate(-1)}>이전</Button>
      </div>
      <div>
        <h1>{dateStr}</h1>
      </div>
      <div className="btn-group">
        <Button onClick={() => handleChangeDate(1)}>다음</Button>
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
