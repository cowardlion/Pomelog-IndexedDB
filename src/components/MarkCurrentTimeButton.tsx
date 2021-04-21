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

export const MarkCurrentTimeButton = ({ dateStr, onClick }: Props) => {
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
    <Tooltip placement="topLeft" title="현재 시간을 미리 등록 해두고 하던 일이 마무리 되면 수정하세요!">
      <Button icon={<CheckCircleOutlined />} onClick={handlecheckPoint}>
        현재시간 마킹
      </Button>
    </Tooltip>
  );
};
