import React from 'react';
import { DollarSign, Award, CheckCircle, TrendingUp } from 'lucide-react';

interface OverviewStatsProps {
    totalVendors: number;
    averageScore: number;
    lowestPrice: number;
    highestPrice: number;
    currency?: string;
}

const OverviewStats: React.FC<OverviewStatsProps> = ({
    totalVendors,
    averageScore,
    lowestPrice,
    highestPrice,
    currency = '₹'
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                    <Award size={24} />
                </div>
                <div>
                    <p className="text-sm text-gray-500 font-medium">Vendors Evaluated</p>
                    <p className="text-2xl font-bold text-gray-900">{totalVendors}</p>
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                    <TrendingUp size={24} />
                </div>
                <div>
                    <p className="text-sm text-gray-500 font-medium">Average Score</p>
                    <p className="text-2xl font-bold text-gray-900">{averageScore.toFixed(1)}/100</p>
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                    <DollarSign size={24} />
                </div>
                <div>
                    <p className="text-sm text-gray-500 font-medium">Price Range</p>
                    <p className="text-lg font-bold text-gray-900">
                        {currency}{lowestPrice.toLocaleString()} - {currency}{highestPrice.toLocaleString()}
                    </p>
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                    <CheckCircle size={24} />
                </div>
                <div>
                    <p className="text-sm text-gray-500 font-medium">Completion Rate</p>
                    <p className="text-2xl font-bold text-gray-900">100%</p>
                </div>
            </div>
        </div>
    );
};

export default OverviewStats;
