import './App.less';

import { useState } from 'react';
import { useQuery } from '@apollo/client';
import cache, { LocalCache } from './graphql/cache';
import { CURRENT_DATE_STR, TIME_LOGS } from './graphql/queries';

import { TimeLogList } from './components/TimeLogList';
import { TimeLogForm } from './components/TimeLogForm';
import { DateNavigator } from './components/DateNavigator';
import { Configuration } from './components/Configuration';
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
      <Configuration />
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

export default App;
