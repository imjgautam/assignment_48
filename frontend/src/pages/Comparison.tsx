import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axiosInstance';
import ComparisonDashboard from '../components/Comparison/ComparisonDashboard';

const Comparison: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [proposals, setProposals] = useState<any[]>([]);
    const [recommendation, setRecommendation] = useState<any>(null);
    const [rfpDetails, setRfpDetails] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [propRes, recRes, rfpRes] = await Promise.all([
                api.get(`/proposals/rfp/${id}`),
                api.get(`/proposals/compare/${id}`),
                api.get(`/rfps/${id}`)
            ]);

            setProposals(propRes.data);
            setRecommendation(recRes.data);
            setRfpDetails(rfpRes.data);
        } catch (error: any) {
            console.error('Failed to fetch comparison data:', error);
            setError(error.response?.data?.message || 'Failed to load comparison data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading comparison data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center max-w-md">
                    <div className="text-red-500 text-5xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Data</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={fetchData}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!rfpDetails) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900">RFP not found</h2>
                    <p className="text-gray-600 mt-2">The requested RFP does not exist.</p>
                </div>
            </div>
        );
    }

    return (
        <ComparisonDashboard
            rfpTitle={rfpDetails.title}
            rfpDate={rfpDetails.created_at}
            proposals={proposals}
            recommendation={recommendation}
        />
    );
};

export default Comparison;
