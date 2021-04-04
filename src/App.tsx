import './App.less';
import styled from '@emotion/styled';
import { Button } from 'antd';
import { BarsOutlined, PicCenterOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useQuery } from '@apollo/client';
import cache, { LocalCache } from './graphql/cache';
import { CURRENT_DATE_STR, TIME_LOGS } from './graphql/queries';

import { TimeLogList } from './components/TimeLogList';
import { TagAutomationButton } from './components/TagAutomationButton';
import { TimeLogForm } from './components/TimeLogForm';
import { DateNavigator } from './components/DateNavigator';
import { getStartAtFromTimeLogs } from './utils';
import moment from 'moment';

function App() {
  const [currentDateStr, setCurrentDateStr] = useState(() => {
    const { currentDateStr } = cache.readQuery({
      query: CURRENT_DATE_STR,
    }) as LocalCache;
    return currentDateStr;
  });

  const { loading, data } = useQuery(TIME_LOGS, { variables: { dateStr: currentDateStr } });

  if (loading) {
    return null;
  }

  const { timeLogs } = data;
  const isSameDateStr = moment(currentDateStr).format('YYYY-MM-DD') === moment(new Date()).format('YYYY-MM-DD');

  const startAt = getStartAtFromTimeLogs(timeLogs, currentDateStr);

  return (
    <div className="App">
      <DateNavigator
        key={currentDateStr}
        dateStr={currentDateStr}
        onChangeDate={(dateStr) => setCurrentDateStr(dateStr)}
      />
      <ConfigStyled>
        <div className="display-style">
          <Button type="primary" icon={<BarsOutlined />} />
          <Button icon={<PicCenterOutlined />} />
        </div>
        <div>
          <TagAutomationButton />
        </div>
      </ConfigStyled>
      <TimeLogList dateStr={currentDateStr} items={timeLogs} />
      <TimeLogForm
        key={`${currentDateStr}-${timeLogs.length}`}
        dateStr={currentDateStr}
        disableAutoSelect={!isSameDateStr}
        startAt={startAt}
      />
    </div>
  );
}

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

export default App;
