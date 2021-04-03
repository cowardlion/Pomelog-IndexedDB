import { gql, useMutation } from '@apollo/client';
import { Button } from 'antd';

const CHECK_IN = gql`
  mutation {
    CheckIn @client
  }
`;

type Props = {
  isCheckedIn: boolean;
};

export const CheckInOutButton = ({ isCheckedIn }: Props) => {
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

  return isCheckedIn ? <Button>체크아웃</Button> : <Button onClick={handleCheckIn}>체크인</Button>;
};
