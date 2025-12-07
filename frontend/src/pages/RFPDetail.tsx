import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Send, CheckCircle, ArrowRight } from 'lucide-react';
import api from '../api/axiosInstance';

interface RFP {
    id: number;
    title: string;
    description: string;
    structured_data: any;
    status: string;
    created_at: string;
}

interface Vendor {
    id: number;
    name: string;
    email: string;
}

const RFPDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [rfp, setRfp] = useState<RFP | null>(null);
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [selectedVendors, setSelectedVendors] = useState<number[]>([]);
    const [proposals, setProposals] = useState<any[]>([]);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        fetchRfp();
        fetchVendors();
        fetchProposals();
    }, [id]);

    const fetchRfp = async () => {
        try {
            const res = await api.get(`/rfps/${id}`);
            setRfp(res.data);
        } catch (error) {
            console.error('Failed to fetch RFP', error);
        }
    };

    const fetchVendors = async () => {
        try {
            const res = await api.get('/vendors');
            setVendors(res.data);
        } catch (error) {
            console.error('Failed to fetch vendors', error);
        }
    };

    const fetchProposals = async () => {
        try {
            const res = await api.get(`/proposals/rfp/${id}`);
            setProposals(res.data);
        } catch (error) {
            console.error('Failed to fetch proposals', error);
        }
    };

    const toggleVendor = (vendorId: number) => {
        setSelectedVendors(prev =>
            prev.includes(vendorId)
                ? prev.filter(id => id !== vendorId)
                : [...prev, vendorId]
        );
    };

    const handleSend = async () => {
        if (selectedVendors.length === 0) return;
        setSending(true);
        try {
            await api.post(`/rfps/${id}/send`, { vendorIds: selectedVendors });
            alert(`RFP sent to ${selectedVendors.length} vendors!`);
            // Ideally refresh RFP status here
        } catch (error) {
            console.error('Error sending RFP', error);
            alert('Error sending RFP');
        } finally {
            setSending(false);
        }
    };

    if (!rfp) return <div>Loading...</div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-start">
                <div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${rfp.status === 'sent' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        } mb-2`}>
                        {rfp.status.toUpperCase()}
                    </span>
                    <h1 className="text-3xl font-bold text-gray-900">{rfp.title}</h1>
                    <p className="text-gray-500 mt-1">Created on {new Date(rfp.created_at).toLocaleDateString()}</p>
                </div>
                <Link
                    to={`/rfps/${id}/compare`}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center gap-2"
                >
                    Compare Proposals <ArrowRight size={16} />
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                        <h2 className="text-xl font-semibold mb-4">Structured Requirements</h2>

                        {rfp.structured_data ? (
                            <div className="space-y-6">
                                {/* Summary Section */}
                                {rfp.structured_data.summary && (
                                    <div className="bg-gray-50 p-4 rounded-md">
                                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Summary</h3>
                                        <p className="text-gray-800">{rfp.structured_data.summary}</p>
                                    </div>
                                )}

                                {/* Key Details Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {rfp.structured_data.budget_range && (
                                        <div className="bg-blue-50 p-4 rounded-md flex items-start gap-3">
                                            <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                                                <span className="font-bold text-lg">₹</span>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-blue-800 uppercase tracking-wider">Budget Range</h3>
                                                <p className="text-blue-900 font-semibold">{rfp.structured_data.budget_range}</p>
                                            </div>
                                        </div>
                                    )}

                                    {rfp.structured_data.timeline && (
                                        <div className="bg-purple-50 p-4 rounded-md flex items-start gap-3">
                                            <div className="p-2 bg-purple-100 rounded-full text-purple-600">
                                                <span className="font-bold text-lg">📅</span>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-purple-800 uppercase tracking-wider">Timeline</h3>
                                                <p className="text-purple-900 font-semibold">{rfp.structured_data.timeline}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Requirements List */}
                                {rfp.structured_data.requirements && Array.isArray(rfp.structured_data.requirements) && (
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-3">Key Requirements</h3>
                                        <ul className="space-y-2">
                                            {rfp.structured_data.requirements.map((req: string, index: number) => (
                                                <li key={index} className="flex items-start gap-3 bg-white border border-gray-100 p-3 rounded-md shadow-sm">
                                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                                    <span className="text-gray-700">{req}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-gray-500 italic">No structured data available.</div>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                        <h2 className="text-xl font-semibold mb-4">Original Request</h2>
                        <p className="text-gray-700 whitespace-pre-wrap">{rfp.description}</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Received Proposals</h2>
                            <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                {proposals.length}
                            </span>
                        </div>

                        {proposals.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                No proposals received yet.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {proposals.map((prop) => (
                                    <div key={prop.id} className="border border-gray-200 rounded-md p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-medium text-gray-900">{prop.vendor_name}</h3>
                                                <p className="text-sm text-gray-500">
                                                    Submitted on {new Date(prop.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-gray-900">₹{prop.price}</p>
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${prop.score >= 80 ? 'bg-green-100 text-green-800' :
                                                    prop.score >= 50 ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                    Score: {prop.score}/100
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow border border-gray-200 h-fit">
                    <h2 className="text-xl font-semibold mb-4">Select Vendors to Invite</h2>
                    <div className="space-y-4 max-h-[500px] overflow-y-auto">
                        {vendors.map(vendor => (
                            <div
                                key={vendor.id}
                                className={`p-4 rounded-md border cursor-pointer transition-colors ${selectedVendors.includes(vendor.id)
                                    ? 'border-indigo-500 bg-indigo-50'
                                    : 'border-gray-200 hover:border-indigo-300'
                                    }`}
                                onClick={() => toggleVendor(vendor.id)}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-900">{vendor.name}</p>
                                        <p className="text-xs text-gray-500">{vendor.email}</p>
                                    </div>
                                    {selectedVendors.includes(vendor.id) && (
                                        <CheckCircle size={20} className="text-indigo-600" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-200">
                        <button
                            onClick={handleSend}
                            disabled={selectedVendors.length === 0 || sending}
                            className="w-full bg-indigo-600 text-white px-4 py-3 rounded-md hover:bg-indigo-700 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send size={20} />
                            {sending ? 'Sending...' : `Send to ${selectedVendors.length} Vendors`}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RFPDetail;
