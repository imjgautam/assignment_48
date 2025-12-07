import React, { useState } from 'react';
import { Download, Share2, Calendar, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import OverviewStats from './OverviewStats';
import VendorTable from './VendorTable';
import AIRecommendationPanel from './AIRecommendationPanel';
import SideBySideView from './SideBySideView';
import Visualizations from './Visualizations';

interface ComparisonDashboardProps {
    rfpTitle: string;
    rfpDate: string;
    proposals: any[];
    recommendation: any;
}

const ComparisonDashboard: React.FC<ComparisonDashboardProps> = ({
    rfpTitle,
    rfpDate,
    proposals,
    recommendation
}) => {
    const [viewMode, setViewMode] = useState<'dashboard' | 'compare'>('dashboard');
    const [selectedVendors, setSelectedVendors] = useState<string[]>([]);

    const toggleVendorSelection = (vendorId: string) => {
        if (selectedVendors.includes(vendorId)) {
            setSelectedVendors(selectedVendors.filter(id => id !== vendorId));
        } else {
            if (selectedVendors.length < 3) {
                setSelectedVendors([...selectedVendors, vendorId]);
            } else {
                // Optional: Show toast that max 3 vendors can be compared
                alert("You can compare up to 3 vendors at a time.");
            }
        }
    };

    const handleCompareClick = () => {
        if (selectedVendors.length >= 2) {
            setViewMode('compare');
        } else {
            alert("Please select at least 2 vendors to compare.");
        }
    };

    // Calculate stats
    const totalVendors = proposals.length;
    const scores = proposals.map(p => {
        const content = typeof p.content === 'string' ? JSON.parse(p.content) : p.content;
        return content.total_score || 0;
    });
    const avgScore = scores.reduce((a, b) => a + b, 0) / (scores.length || 1);

    const prices = proposals.map(p => {
        const content = typeof p.content === 'string' ? JSON.parse(p.content) : p.content;
        return parseFloat(String(content.total_cost).replace(/[^0-9.-]+/g, "")) || 0;
    });
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                <div>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                        <Link to="/vendors" className="hover:text-indigo-600 flex items-center">
                            <ArrowLeft size={16} className="mr-1" /> Back to RFPs
                        </Link>
                        <span className="mx-2">•</span>
                        <Calendar size={14} className="mr-1" /> {new Date(rfpDate).toLocaleDateString()}
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">{rfpTitle}</h1>
                    <p className="text-gray-500 mt-1">Vendor Evaluation & Comparison Report</p>
                </div>
                <div className="mt-4 md:mt-0 flex space-x-3">
                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                        <Share2 size={16} className="mr-2" /> Share
                    </button>
                    <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                        <Download size={16} className="mr-2" /> Export Report
                    </button>
                </div>
            </div>

            {viewMode === 'dashboard' ? (
                <>
                    <OverviewStats
                        totalVendors={totalVendors}
                        averageScore={avgScore}
                        lowestPrice={minPrice}
                        highestPrice={maxPrice}
                    />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                        <div className="lg:col-span-2">
                            <Visualizations proposals={proposals} />
                        </div>
                        <div className="lg:col-span-1">
                            <AIRecommendationPanel recommendation={recommendation} />
                        </div>
                    </div>

                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Vendor Comparison</h2>
                            <button
                                onClick={handleCompareClick}
                                disabled={selectedVendors.length < 2}
                                className={`px-4 py-2 rounded-md text-sm font-medium ${selectedVendors.length >= 2
                                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                Compare Selected ({selectedVendors.length})
                            </button>
                        </div>
                        <VendorTable
                            proposals={proposals}
                            selectedVendors={selectedVendors}
                            onToggleSelection={toggleVendorSelection}
                            recommendation={recommendation}
                        />
                    </div>
                </>
            ) : (
                <SideBySideView
                    proposals={proposals.filter(p => selectedVendors.includes(p.vendor_id))}
                    onBack={() => setViewMode('dashboard')}
                />
            )}
        </div>
    );
};

export default ComparisonDashboard;
