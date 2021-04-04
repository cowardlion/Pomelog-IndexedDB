import { gql, useMutation } from '@apollo/client';
import { Button } from 'antd';
import { LogoutOutlined, LoginOutlined } from '@ant-design/icons';

const CHECK_IN = gql`
  mutation CheckIn($dateStr: String!) {
    checkIn(dateStr: $dateStr) @client
  }
`;

type Props = {
  dateStr: string;
  isCheckedIn: boolean;
  onClick?: () => void;
};

export const CheckInButton = ({ dateStr, isCheckedIn, onClick }: Props) => {
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

        onClick?.();
      },
    });
  };

  return isCheckedIn ? (
    <Button icon={<LogoutOutlined />}>체크아웃</Button>
  ) : (
    <Button icon={<LoginOutlined />} onClick={handleCheckIn}>
      체크인
    </Button>
  );
};
