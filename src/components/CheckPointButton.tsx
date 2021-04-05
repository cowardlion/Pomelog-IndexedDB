import { gql, useMutation } from '@apollo/client';
import { Button, Tooltip } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';

const CHECK_IN = gql`
  mutation checkPoint($dateStr: String!) {
    checkPoint(dateStr: $dateStr) @client
  }
`;

type Props = {
  dateStr: string;
  onClick?: () => void;
};

export const CheckPointButton = ({ dateStr, onClick }: Props) => {
  const [checkPointMutation] = useMutation(CHECK_IN);

  const handlecheckPoint = () => {
    checkPointMutation({
      variables: { dateStr },
      optimisticResponse: true,
      update(cache, { data: { checkPoint } }) {
        if (!checkPoint) {
          return;
        }

        cache.modify({
          fields: {
            timeLogs() {
              return [checkPoint];
            },
          },
        });

        onClick?.();
      },
    });
  };

  return (
    <Tooltip placement="topLeft" title="현재 시간을 어떤 일의 시작 시간으로 쓰기 위해 마킹하는 용도로 사용합니다.">
      <Button icon={<CheckCircleOutlined />} onClick={handlecheckPoint}>
        체크포인트
      </Button>
    </Tooltip>
  );
};
