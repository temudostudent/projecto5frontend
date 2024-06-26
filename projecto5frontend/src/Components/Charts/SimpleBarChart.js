import React, { PureComponent } from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

/*const data = [
  {
    name: 'Page A',
    uv: 4000,
  },
  {
    name: 'Page B',
    uv: 3000,
  },
  {
    name: 'Page C',
    uv: 2000,
  },
  {
    name: 'Page D',
    uv: 2780,
  }
];*/

export default class SimpleBarChart extends PureComponent {

  render() {
    const { data } = this.props;

    return (
      <ResponsiveContainer width="100%" height="80%">
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 0,
            right: 20,
            left: 5,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis type='number' domain={[0, dataMax => Math.round(dataMax * 1.3)]}/>
          <Tooltip />
          <Legend verticalAlign="top" height={36}/>
          <Bar dataKey="Number of Tasks" fill="#749BC2" activeBar={<Rectangle fill="#D7693C" stroke="#D7D4B9" />} />
        </BarChart>
      </ResponsiveContainer>
    );
  }
}