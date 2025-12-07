import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Users, Mail, Plus, Activity } from 'lucide-react';
import api from '../api/axiosInstance';

const Dashboard: React.FC = () => {
    const [rfpList, setRfpList] = useState<any[]>([]);
    const [stats, setStats] = useState({
        rfps: 0,
        vendors: 0,
        proposals: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [rfpsRes, vendorsRes] = await Promise.all([
                    api.get('/rfps'),
                    api.get('/vendors')
                ]);
                const rfps = rfpsRes.data;
                const vendors = vendorsRes.data;

                setRfpList(Array.isArray(rfps) ? rfps : []);

                setStats({
                    rfps: Array.isArray(rfps) ? rfps.length : 0,
                    vendors: Array.isArray(vendors) ? vendors.length : 0,
                    proposals: 0
                });
            } catch (error) {
                console.error('Failed to fetch stats', error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="mt-1 text-gray-600">Overview of your procurement activities.</p>
                </div>
                <Link
                    to="/create-rfp"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2"
                >
                    <Plus size={20} /> Create New RFP
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow border border-gray-200 flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                        <FileText size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total RFPs</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.rfps}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow border border-gray-200 flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-full text-green-600">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Active Vendors</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.vendors}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow border border-gray-200 flex items-center gap-4">
                    <div className="p-3 bg-purple-100 rounded-full text-purple-600">
                        <Mail size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Proposals Received</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.proposals}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow border border-gray-200">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Activity size={20} className="text-gray-500" /> Recent RFPs
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {rfpList.length > 0 ? (
                                    rfpList.map((rfp) => (
                                        <tr key={rfp.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{rfp.title}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${rfp.status === 'sent' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {rfp.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(rfp.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <Link to={`/rfps/${rfp.id}/compare`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                                                    Compare
                                                </Link>
                                                <Link to={`/rfps/${rfp.id}`} className="text-gray-600 hover:text-gray-900">
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                                            No RFPs found. Create one to get started.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow border border-gray-200 h-fit">
                    <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                        <Link to="/vendors" className="block w-full text-left px-4 py-3 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors">
                            <span className="font-medium text-gray-900">Manage Vendors</span>
                            <p className="text-sm text-gray-500">Add or update vendor information</p>
                        </Link>
                        <Link to="/create-rfp" className="block w-full text-left px-4 py-3 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors">
                            <span className="font-medium text-gray-900">Draft New RFP</span>
                            <p className="text-sm text-gray-500">Use AI to generate requirements</p>
                        </Link>
                        <Link to="/simulate-proposal" className="block w-full text-left px-4 py-3 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors">
                            <span className="font-medium text-gray-900">Simulate Vendor Response</span>
                            <p className="text-sm text-gray-500">Submit vendor proposals for testing</p>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
