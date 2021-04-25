import styled from '@emotion/styled';
import { Bar } from '@ant-design/charts';
import { BarConfig } from '@ant-design/charts/es/bar';

export const Statics = () => {
  var data = [
    {
      country: 'Asia',
      year: '1750',
      value: 5,
    },
    {
      country: 'Asia',
      year: '1800',
      value: 2,
    },
    {
      country: 'Asia',
      year: '1850',
      value: 1,
    },
  ];

  const config: BarConfig = {
    data: data,
    xField: 'value',
    yField: 'year',
    seriesField: 'country',
    isPercent: true,
    isStack: true,
    label: {
      position: 'middle',
      content: function content(item: any) {
        return item.value.toFixed(2);
      },
      style: { fill: '#fff' },
    },
  };
  return (
    <StaticsStyled>
      <div>간단한 통계</div>
      <div>
        <Bar {...config} />
      </div>
    </StaticsStyled>
  );
};

const StaticsStyled = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 5px 0;

  .display-style {
    button {
      width: 50px;
    }
  }
`;
