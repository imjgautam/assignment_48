import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

interface VisualizationsProps {
    proposals: any[];
}

const Visualizations: React.FC<VisualizationsProps> = ({ proposals }) => {
    const data = proposals.map(p => {
        const content = typeof p.content === 'string' ? JSON.parse(p.content) : p.content;
        const price = parseFloat(String(content.total_cost).replace(/[^0-9.-]+/g, "")) || 0;
        return {
            name: p.vendor_name,
            score: content.total_score || 0,
            price: price,
            technical: content.technical_fit_score || 0,
            compliance: content.compliance_score || 0
        };
    });

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Performance Analysis</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="h-64">
                    <h4 className="text-sm font-medium text-gray-500 mb-4 text-center">Score vs Price Comparison</h4>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                            <Tooltip />
                            <Legend />
                            <Bar yAxisId="left" dataKey="score" fill="#8884d8" name="Score" />
                            <Bar yAxisId="right" dataKey="price" fill="#82ca9d" name="Price (₹)" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="h-64">
                    <h4 className="text-sm font-medium text-gray-500 mb-4 text-center">Technical & Compliance Fit</h4>
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="name" />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} />
                            <Radar name="Technical" dataKey="technical" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                            <Radar name="Compliance" dataKey="compliance" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                            <Legend />
                            <Tooltip />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Visualizations;
