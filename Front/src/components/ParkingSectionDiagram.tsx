import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

interface ParkingSectionDiagramProps {
    occupied: number;
    total: number;
}

const ParkingSectionDiagram: React.FC<ParkingSectionDiagramProps> = ({ occupied, total }) => {
    const data = [
        { name: 'Zajęte', value: occupied },
        { name: 'Wolne', value: total - occupied },
    ];

    const COLORS = ['#ff0000', '#0088FE'];

    return (
        <ResponsiveContainer width={350} height={280}>
            <PieChart>
                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={25}  // To create the "donut" effect
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={true}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>

                <Legend verticalAlign="bottom" height={36} />
                <Tooltip />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default ParkingSectionDiagram;
