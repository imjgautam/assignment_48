import React, { useState } from 'react';
import { Check, X, ChevronDown, ChevronUp, DollarSign, Shield, Award, FileText } from 'lucide-react';

interface VendorCardProps {
    proposal: any;
    isExpanded: boolean;
    onToggle: () => void;
    rank?: number;
}

const VendorCard: React.FC<VendorCardProps> = ({ proposal, isExpanded, onToggle, rank }) => {
    const [activeTab, setActiveTab] = useState('pricing');
    const content = typeof proposal.content === 'string' ? JSON.parse(proposal.content) : proposal.content;

    const tabs = [
        { id: 'pricing', label: 'Pricing', icon: DollarSign },
        { id: 'technical', label: 'Technical Fit', icon: Shield },
        { id: 'qualifications', label: 'Qualifications', icon: Award },
        { id: 'completeness', label: 'Completeness', icon: FileText },
    ];

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-4 transition-all duration-200">
            <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                onClick={onToggle}
            >
                <div className="flex items-center space-x-4">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${rank === 1 ? 'bg-yellow-500' : rank === 2 ? 'bg-gray-400' : rank === 3 ? 'bg-orange-400' : 'bg-gray-300'
                        }`}>
                        {rank || '-'}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">{proposal.vendor_name}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <span>Score: {content.total_score || 0}/100</span>
                            <span>•</span>
                            <span>{content.delivery_time || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-6">
                    <div className="text-right hidden md:block">
                        <p className="text-lg font-bold text-gray-900">{content.total_cost}</p>
                        <p className="text-xs text-gray-500">Total Cost</p>
                    </div>
                    {isExpanded ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                </div>
            </div>

            {isExpanded && (
                <div className="border-t border-gray-200">
                    <div className="flex border-b border-gray-200 overflow-x-auto">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${activeTab === tab.id
                                        ? 'border-indigo-500 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <tab.icon size={16} className="mr-2" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="p-6 bg-gray-50">
                        {activeTab === 'pricing' && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-white p-4 rounded-md shadow-sm">
                                        <p className="text-sm text-gray-500">Total Cost</p>
                                        <p className="text-2xl font-bold text-gray-900">{content.total_cost}</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-md shadow-sm">
                                        <p className="text-sm text-gray-500">Payment Terms</p>
                                        <p className="text-lg font-medium text-gray-900">{content.payment_terms || 'Standard'}</p>
                                    </div>
                                </div>
                                {/* Add breakdown if available */}
                            </div>
                        )}

                        {activeTab === 'technical' && (
                            <div className="space-y-4">
                                <h4 className="font-medium text-gray-900">Compliance Checklist</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {content.compliance_checklist?.map((item: any, idx: number) => (
                                        <div key={idx} className="flex items-start p-3 bg-white rounded-md border border-gray-200">
                                            {item.met ? (
                                                <Check size={18} className="text-green-500 mr-2 mt-0.5" />
                                            ) : (
                                                <X size={18} className="text-red-500 mr-2 mt-0.5" />
                                            )}
                                            <span className="text-sm text-gray-700">{item.requirement}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'qualifications' && (
                            <div className="bg-white p-4 rounded-md border border-gray-200">
                                <p className="text-gray-600">{content.qualifications_summary || 'No qualification summary provided.'}</p>
                            </div>
                        )}

                        {activeTab === 'completeness' && (
                            <div className="bg-white p-4 rounded-md border border-gray-200">
                                <div className="flex items-center mb-4">
                                    <div className="w-full bg-gray-200 rounded-full h-2.5 mr-4">
                                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '100%' }}></div>
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">100%</span>
                                </div>
                                <p className="text-sm text-gray-500">All required sections have been completed.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default VendorCard;
