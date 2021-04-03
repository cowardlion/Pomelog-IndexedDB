import { gql, useQuery, useMutation } from '@apollo/client';
import { Button } from 'antd';

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
          timeLogs() {
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

  return isCheckedIn ? <Button>체크아웃</Button> : <Button onClick={handleCheckIn}>체크인</Button>;
};
