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
          <PieChart max-width={250} max-height={250}>
            <Pie
              dataKey="value"
              startAngle={180}
              endAngle={0}
              data={data}
              cx="50%"
              cy="80%"
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
                    style={{ fontSize: "0.8em", textAlign: "center"}}
                    fill="#253955"
                    textAnchor={x > cx ? "start" : "end"}
                  >
                    {`${name} : ${value}`}
                  </text>
                );
              }}
            />
            {total && <text x="50%" y="88%" textAnchor="middle" dominantBaseline="middle" fontSize= "0.8em">
              Total: {total}
            </text>}
          </PieChart>
        </ResponsiveContainer>
      );
    }
  }