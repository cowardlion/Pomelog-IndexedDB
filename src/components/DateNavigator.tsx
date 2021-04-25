import styled from '@emotion/styled';
import cache from '../graphql/cache';
import { CURRENT_DATE_STR, TIME_LOGS } from '../graphql/queries';
import moment from 'moment';
import 'moment/locale/ko';
import { Button } from 'antd';
import { listByDate } from '../api/timeLog';
moment.locale('ko');

type Props = {
  dateStr: string;
  onChangeDate: (dateStr: string) => void;
};

export const DateNavigator = ({ dateStr: currentDateStr, onChangeDate }: Props) => {
  const disableNextDay = moment().format('YYYY-MM-DD') === currentDateStr;
  const currentDate = moment(new Date(currentDateStr));
  const dateStr = currentDate.format('MMM Do (dd)');

  const handleMoveToday = async () => {
    const date = new Date();

    updateCache(date);
  };

  const handleChangeDate = async (amount: -1 | 1) => {
    currentDate.add(amount, 'day');
    const date = currentDate.toDate();

    updateCache(date);
  };

  const updateCache = async (date: Date) => {
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
        dateStr: currentDateStr,
      },
    });

    onChangeDate(currentDateStr);
  };

  return (
    <NavigatorStyled>
      <div>
        <h1>{dateStr}</h1>
      </div>
      <div className="btn-group">
        <Button onClick={() => handleChangeDate(-1)}>이전</Button>
        <Button onClick={handleMoveToday}>오늘</Button>
        <Button disabled={disableNextDay} onClick={() => handleChangeDate(1)}>
          다음
        </Button>
      </div>
    </NavigatorStyled>
  );
};

const NavigatorStyled = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0 20px 0;

  h1 {
    font-size: 1.25em;
    font-weight: bold;
    line-height: 24px;
    letter-spacing: -0.3px;
  }

  .btn-group {
    button {
      padding: 4px 8px;
      margin-right: 5px;

      &:last-child {
        margin-right: 0;
      }
    }
  }
`;
