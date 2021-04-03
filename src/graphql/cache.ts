import { InMemoryCache } from '@apollo/client';
import moment from 'moment';
import 'moment/locale/ko';
import { CURRENT_DATE_STR } from './queries';

const cache = new InMemoryCache();

export type LocalCache = {
  currentDateStr: string;
};

cache.writeQuery({
  query: CURRENT_DATE_STR,
  data: {
    currentDateStr: moment().format('YYYY-MM-DD'),
  },
});

export default cache;
