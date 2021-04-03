export const msToTime = (s: number) => {
  if (s === 0) {
    return null;
  }

  const ms = s % 1000;
  s = (s - ms) / 1000;
  const secs = s % 60;
  s = (s - secs) / 60;
  const mins = s % 60;
  const hrs = (s - mins) / 60;

  let timeStr = '';
  if (hrs) {
    timeStr += hrs + '시간 ';
  }

  if (mins) {
    timeStr += mins + '분 ';
  }

  return timeStr;
};
