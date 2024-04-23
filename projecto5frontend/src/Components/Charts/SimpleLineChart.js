import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

/*const data = [
  {
    name: '01/01',
    key: 2400,
  },
  {
    name: '08/01',
    key: 1398,
  },
  {
    name: 'Page C',
    key: 9800,
  },
  {
    name: 'Page D',
    key: 3908,
  },
  {
    name: 'Page E',
    key: 4800,
  },
  {
    name: 'Page F',
    key: 3800,
  },
  {
    name: 'Page G',
    key: 4300,
  },
];*/

export default class SimpleLineChart extends PureComponent {

  render() {
    const { data } = this.props;

    return (
      <ResponsiveContainer width="90%" height="90%">
        <LineChart
          width={500}
          height={500}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="key" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    );
  }
}
