import { gql, useMutation } from '@apollo/client';
import { Button } from 'antd';

const CHECK_IN = gql`
  mutation CheckIn($dateStr: String!) {
    checkIn(dateStr: $dateStr) @client
  }
`;

type Props = {
  dateStr: string;
  isCheckedIn: boolean;
};

export const CheckInOutButton = ({ dateStr, isCheckedIn }: Props) => {
  const [checkInMutation] = useMutation(CHECK_IN);

  const handleCheckIn = () => {
    checkInMutation({
      variables: { dateStr },
      optimisticResponse: true,
      update(cache, { data: { checkIn } }) {
        if (!checkIn) {
          return;
        }

        cache.modify({
          fields: {
            timeLogs() {
              return [checkIn];
            },
            isCheckedIn() {
              return true;
            },
          },
        });
      },
    });
  };

  return isCheckedIn ? <Button>체크아웃</Button> : <Button onClick={handleCheckIn}>체크인</Button>;
};
