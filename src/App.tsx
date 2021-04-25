import './App.less';

import { useState } from 'react';
import { useQuery } from '@apollo/client';
import cache, { LocalCache } from './graphql/cache';
import { CURRENT_DATE_STR, TIME_LOGS, APP_STATES } from './graphql/queries';

import { TimeLogList } from './components/TimeLogList';
import { TimeLogForm } from './components/TimeLogForm';
import { DateNavigator } from './components/DateNavigator';
import { Configuration } from './components/Configuration';
// import { Statics } from './components/Statics';
import { getStartAtFromTimeLogs } from './utils';
import moment from 'moment';

function App() {
  const [currentDateStr, setCurrentDateStr] = useState(() => {
    const { currentDateStr } = cache.readQuery({
      query: CURRENT_DATE_STR,
    }) as LocalCache;
    return currentDateStr;
  });

  const { loading, data, error } = useQuery(APP_STATES, { variables: { dateStr: currentDateStr } });

  console.log('---->', error, data);
  if (loading || !!error) {
    return null;
  }

  const { timeLogs, categories } = data;
  const isSameDateStr = moment(currentDateStr).format('YYYY-MM-DD') === moment(new Date()).format('YYYY-MM-DD');

  const startAt = getStartAtFromTimeLogs(timeLogs, currentDateStr, isSameDateStr);

  return (
    <div className="App">
      <DateNavigator
        key={currentDateStr}
        dateStr={currentDateStr}
        onChangeDate={(dateStr) => setCurrentDateStr(dateStr)}
      />
      <Configuration items={categories} />
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
