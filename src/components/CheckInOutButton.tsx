import { gql, useQuery, useMutation } from '@apollo/client';

const CHECK_IN_OUT = gql`
  query {
    isCheckedIn @client
  }
`;

const CHECK_IN = gql`
  mutation {
    CheckIn @client
  }
`;

export const CheckInOutButton = () => {
  const { loading, data } = useQuery(CHECK_IN_OUT);
  const [checkIn] = useMutation(CHECK_IN, {
    update(cache, { data: { CheckIn } }) {
      cache.modify({
        fields: {
          getTodayLogs() {
            return [CheckIn];
          },
          isCheckedIn() {
            return true;
          },
        },
      });
    },
  });

  const handleCheckIn = () => {
    checkIn();
  };

  if (loading) {
    return null;
  }

  const { isCheckedIn } = data;

  return isCheckedIn ? <button>체크아웃</button> : <button onClick={handleCheckIn}>체크인</button>;
};
