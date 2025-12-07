import React, { useState } from 'react';
import { Send, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';

const CreateRFP: React.FC = () => {
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        setLoading(true);
        try {
            const res = await api.post('/rfps/generate', { description: input });
            const data = res.data;
            if (data.id) {
                navigate(`/rfps/${data.id}`);
            }
        } catch (error) {
            console.error('Failed to generate RFP', error);
            alert('Failed to generate RFP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900">Create New RFP</h1>
                <p className="mt-4 text-lg text-gray-600">
                    Describe what you need in natural language, and our AI will structure it for you.
                </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Your Requirement
                        </label>
                        <textarea
                            rows={6}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-4 border text-lg"
                            placeholder="e.g., I need 20 laptops with 16GB RAM and 15 monitors for our new office. Budget is ₹50k. Delivery within 30 days."
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-medium"
                        >
                            {loading ? (
                                <>
                                    <Loader className="animate-spin" /> Generating...
                                </>
                            ) : (
                                <>
                                    <Send size={20} /> Generate RFP
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-blue-50 p-4 rounded-md">
                <h3 className="text-sm font-medium text-blue-800">Tips</h3>
                <ul className="mt-2 text-sm text-blue-700 list-disc list-inside">
                    <li>Be specific about quantities and specs.</li>
                    <li>Mention budget and timelines if known.</li>
                    <li>Include any special terms or warranty requirements.</li>
                </ul>
            </div>
        </div>
    );
};

export default CreateRFP;
