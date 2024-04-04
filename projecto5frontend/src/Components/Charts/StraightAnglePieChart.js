import React, { PureComponent } from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer, Label } from 'recharts';

/*const data = [
  { name: 'Group A', value: 500 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 200 }
];*/

export default class StraightAnglePieChart extends PureComponent {
    render() {
      const { data, total } = this.props;
  
      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart width={150} height={150}>
            <Pie
              dataKey="value"
              startAngle={180}
              endAngle={0}
              data={data}
              cx="45%"
              cy="70%"
              outerRadius={80}
              fill="#8884d8"
              label={({
                cx,
                cy,
                midAngle,
                innerRadius,
                outerRadius,
                value,
                index,
                name
              }) => {
                const RADIAN = Math.PI / 180;
                const radius = 25 + innerRadius + (outerRadius - innerRadius);
                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
                return (
                  <text
                    x={x}
                    y={y}
                    style={{ fontSize: "0.9em" }}
                    fill="#253955"
                    textAnchor={x > cx ? "start" : "end"}
                    dominantBaseline="central"
                  >
                    {`${name} : ${value}`}
                  </text>
                );
              }}
            />
            <text x="45%" y="80%" textAnchor="middle" dominantBaseline="middle">
              Total: {total}
            </text>
          </PieChart>
        </ResponsiveContainer>
      );
    }
  }