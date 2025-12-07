import React, { useEffect, useState } from 'react';
import { Loader, CheckCircle } from 'lucide-react';
import api from '../api/axiosInstance';

const SimulateProposal: React.FC = () => {
    const [vendors, setVendors] = useState<any[]>([]);
    const [rfps, setRfps] = useState<any[]>([]);
    const [selectedVendor, setSelectedVendor] = useState('');
    const [selectedRfp, setSelectedRfp] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [vendorsRes, rfpsRes] = await Promise.all([
                api.get('/vendors'),
                api.get('/rfps')
            ]);
            setVendors(vendorsRes.data);
            setRfps(rfpsRes.data);
        } catch (error) {
            console.error('Failed to fetch data', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/proposals/simulate', {
                rfpId: selectedRfp,
                vendorId: selectedVendor,
                content
            });

            setSuccess(true);
            setContent('');
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            console.error('Failed to submit proposal', error);
            alert('Failed to submit proposal');
        } finally {
            setLoading(false);
        }
    };

    const handleAutoFill = () => {
        setContent(`We can provide the requested items with the following details:

Price: ₹65,000 per unit
Total Cost: ₹3,250,000
Delivery Time: 25 days
Payment Terms: Net 45 days

Specifications:
- Intel Core i7-13700H processor
- 16GB DDR5 RAM
- 512GB NVMe SSD
- 3-year comprehensive warranty

Additional Benefits:
- Free on-site setup
- Dedicated account manager
- 24/7 technical support

We look forward to working with you.

Best regards,
Sales Team`);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900">Simulate Vendor Response</h1>
                <p className="mt-2 text-gray-600">
                    Submit a vendor proposal response. The system will parse it using AI and add it to the comparison.
                </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Vendor</label>
                            <select
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                                value={selectedVendor}
                                onChange={e => setSelectedVendor(e.target.value)}
                                required
                            >
                                <option value="">-- Choose Vendor --</option>
                                {vendors.map(v => (
                                    <option key={v.id} value={v.id}>{v.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Select RFP</label>
                            <select
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                                value={selectedRfp}
                                onChange={e => setSelectedRfp(e.target.value)}
                                required
                            >
                                <option value="">-- Choose RFP --</option>
                                {rfps.map(r => (
                                    <option key={r.id} value={r.id}>{r.title}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-700">Proposal Content</label>
                            <button
                                type="button"
                                onClick={handleAutoFill}
                                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                            >
                                Auto-fill Sample
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mb-2">
                            Enter free-form text (like an email). AI will extract structured data automatically.
                        </p>
                        <textarea
                            rows={12}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-4 border text-sm"
                            placeholder="Enter vendor proposal as free-form text...

Example:
We can provide 50 laptops for ₹65,000 each.
Total: ₹3,250,000
Delivery: 25 days
Warranty: 3 years"
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading || !selectedVendor || !selectedRfp || !content}
                            className={`px-6 py-3 rounded-md flex items-center gap-2 text-white font-medium transition-colors ${success ? 'bg-green-600 hover:bg-green-700' : 'bg-indigo-600 hover:bg-indigo-700'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {loading ? (
                                <><Loader className="animate-spin" /> Processing...</>
                            ) : success ? (
                                <><CheckCircle size={20} /> Submitted!</>
                            ) : (
                                'Submit Proposal'
                            )}
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-2">How it works:</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                    <li>Select a vendor and RFP from the dropdowns</li>
                    <li>Enter the proposal content as free-form text (like an email)</li>
                    <li>AI will automatically parse and extract structured data</li>
                    <li>Proposal will be analyzed and scored</li>
                    <li>View the results in the comparison page</li>
                </ol>
            </div>
        </div>
    );
};

export default SimulateProposal;
