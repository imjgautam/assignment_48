import React, { useState } from 'react';
import { ArrowUpDown } from 'lucide-react';
import VendorCard from './VendorCard';

interface VendorTableProps {
    proposals: any[];
    selectedVendors: string[];
    onToggleSelection: (id: string) => void;
    recommendation: any;
}

const VendorTable: React.FC<VendorTableProps> = ({
    proposals,
    selectedVendors,
    onToggleSelection,
    recommendation
}) => {
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
    const [expandedVendorId, setExpandedVendorId] = useState<string | null>(null);

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedProposals = [...proposals].sort((a, b) => {
        if (!sortConfig) return 0;

        const contentA = typeof a.content === 'string' ? JSON.parse(a.content) : a.content;
        const contentB = typeof b.content === 'string' ? JSON.parse(b.content) : b.content;

        let valA, valB;

        if (sortConfig.key === 'score') {
            valA = contentA.total_score || 0;
            valB = contentB.total_score || 0;
        } else if (sortConfig.key === 'price') {
            valA = parseFloat(String(contentA.total_cost).replace(/[^0-9.-]+/g, "")) || 0;
            valB = parseFloat(String(contentB.total_cost).replace(/[^0-9.-]+/g, "")) || 0;
        } else {
            valA = a.vendor_name;
            valB = b.vendor_name;
        }

        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    return (
        <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                                    Compare
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleSort('name')}
                                >
                                    <div className="flex items-center">
                                        Vendor
                                        <ArrowUpDown size={14} className="ml-1" />
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleSort('score')}
                                >
                                    <div className="flex items-center">
                                        Score
                                        <ArrowUpDown size={14} className="ml-1" />
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleSort('price')}
                                >
                                    <div className="flex items-center">
                                        Total Cost
                                        <ArrowUpDown size={14} className="ml-1" />
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Technical Fit
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sortedProposals.map((proposal, idx) => {
                                const content = typeof proposal.content === 'string' ? JSON.parse(proposal.content) : proposal.content;
                                const isRecommended = recommendation?.recommended_vendor_id === proposal.vendor_id;

                                return (
                                    <React.Fragment key={proposal.id}>
                                        <tr className={isRecommended ? 'bg-indigo-50' : ''}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <input
                                                    type="checkbox"
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                    checked={selectedVendors.includes(proposal.vendor_id)}
                                                    onChange={() => onToggleSelection(proposal.vendor_id)}
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                                                        {proposal.vendor_name.charAt(0)}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {proposal.vendor_name}
                                                            {isRecommended && (
                                                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                                                                    Recommended
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <span className="text-sm text-gray-900 font-bold">{content.total_score || 0}</span>
                                                    <div className="ml-2 w-16 bg-gray-200 rounded-full h-1.5">
                                                        <div
                                                            className="bg-green-500 h-1.5 rounded-full"
                                                            style={{ width: `${content.total_score || 0}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {content.total_cost}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${(content.technical_fit_score || 0) > 80 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {content.technical_fit_score || 0}% Match
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => setExpandedVendorId(expandedVendorId === proposal.id ? null : proposal.id)}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    {expandedVendorId === proposal.id ? 'Hide Details' : 'View Details'}
                                                </button>
                                            </td>
                                        </tr>
                                        {expandedVendorId === proposal.id && (
                                            <tr>
                                                <td colSpan={6} className="px-0 py-0">
                                                    <div className="bg-gray-50 p-4">
                                                        <VendorCard
                                                            proposal={proposal}
                                                            isExpanded={true}
                                                            onToggle={() => setExpandedVendorId(null)}
                                                            rank={idx + 1}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default VendorTable;
