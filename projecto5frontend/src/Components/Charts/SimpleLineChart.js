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
  }
];*/

export default class SimpleLineChart extends PureComponent {

  render() {
    const { data, users } = this.props;

    return (
      <ResponsiveContainer width="90%" height="90%">
        <LineChart
          width={200}
          height={200}
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="6" />
          <XAxis dataKey="name" label={{ value: 'Day', position: 'insideRight', offset: 40 }}/>
          <YAxis type="number" domain={[0, dataMax => Math.round(dataMax * 1.4)]}/>
          <Tooltip />
          <Legend verticalAlign="bottom"/>
          <Line type="monotone" dataKey={users ? "Users" : "Tasks"} stroke="#4682A9" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    );
  }
}
