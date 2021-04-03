import './App.less';
import { useState } from 'react';
import { useQuery } from '@apollo/client';
import cache, { LocalCache } from './graphql/cache';
import { CURRENT_DATE_STR, TIME_LOGS } from './graphql/queries';

import { TimeLogList } from './components/TimeLogList';
import { CheckInOutButton } from './components/CheckInOutButton';
import { TagAutomationButton } from './components/TagAutomationButton';
import { TimeLogForm } from './components/TimeLogForm';
import { DateNavigator } from './components/DateNavigator';

function App() {
  const [currentDateStr, setCurrentDateStr] = useState(() => {
    const { currentDateStr } = cache.readQuery({
      query: CURRENT_DATE_STR,
    }) as LocalCache;
    return currentDateStr;
  });

  const { loading, data } = useQuery(TIME_LOGS, { variables: { date: currentDateStr } });

  if (loading) {
    return null;
  }

  const { isCheckedIn, timeLogs } = data;
  const isPast = new Date(currentDateStr) < new Date();

  return (
    <div className="App">
      <DateNavigator dateStr={currentDateStr} onChangeDate={(dateStr) => setCurrentDateStr(dateStr)} />
      <TimeLogList dateStr={currentDateStr} isPast={isPast} isCheckedIn={isCheckedIn} items={timeLogs} />
      {isCheckedIn && <TimeLogForm startAt={timeLogs[timeLogs.length - 1].date} />}
      <TagAutomationButton />
      {!isPast && <CheckInOutButton isCheckedIn={isCheckedIn} />}
    </div>
  );
}

export default App;
