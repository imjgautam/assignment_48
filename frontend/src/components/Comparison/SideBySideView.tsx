import React from 'react';
import { ArrowLeft, Check, X, Minus } from 'lucide-react';

interface SideBySideViewProps {
    proposals: any[];
    onBack: () => void;
}

const SideBySideView: React.FC<SideBySideViewProps> = ({ proposals, onBack }) => {
    const parsedProposals = proposals.map(p => ({
        ...p,
        content: typeof p.content === 'string' ? JSON.parse(p.content) : p.content
    }));

    // Extract all unique requirements from all proposals to ensure alignment
    const allRequirements = Array.from(new Set(
        parsedProposals.flatMap(p =>
            p.content.compliance_checklist?.map((c: any) => c.requirement) || []
        )
    ));

    return (
        <div className="space-y-6">
            <div className="flex items-center mb-6">
                <button
                    onClick={onBack}
                    className="mr-4 p-2 rounded-full hover:bg-gray-100 text-gray-600"
                >
                    <ArrowLeft size={24} />
                </button>
                <h2 className="text-2xl font-bold text-gray-900">Side-by-Side Comparison</h2>
            </div>

            <div className="overflow-x-auto pb-6">
                <div className="min-w-max">
                    <div className="grid" style={{ gridTemplateColumns: `200px repeat(${proposals.length}, minmax(300px, 1fr))` }}>
                        {/* Header Row */}
                        <div className="p-4 font-bold text-gray-500 bg-gray-50 border-b border-gray-200 sticky left-0">
                            Vendor
                        </div>
                        {parsedProposals.map(p => (
                            <div key={p.id} className="p-4 font-bold text-lg text-gray-900 bg-white border-b border-gray-200 border-l text-center">
                                {p.vendor_name}
                            </div>
                        ))}

                        {/* Total Cost Row */}
                        <div className="p-4 font-medium text-gray-700 bg-gray-50 border-b border-gray-200 sticky left-0">
                            Total Cost
                        </div>
                        {parsedProposals.map(p => (
                            <div key={p.id} className="p-4 text-xl font-bold text-indigo-600 bg-white border-b border-gray-200 border-l text-center">
                                {p.content.total_cost}
                            </div>
                        ))}

                        {/* Score Row */}
                        <div className="p-4 font-medium text-gray-700 bg-gray-50 border-b border-gray-200 sticky left-0">
                            Overall Score
                        </div>
                        {parsedProposals.map(p => (
                            <div key={p.id} className="p-4 bg-white border-b border-gray-200 border-l text-center">
                                <div className="inline-block px-3 py-1 rounded-full bg-gray-100 font-bold">
                                    {p.content.total_score}/100
                                </div>
                            </div>
                        ))}

                        {/* Delivery Time Row */}
                        <div className="p-4 font-medium text-gray-700 bg-gray-50 border-b border-gray-200 sticky left-0">
                            Delivery Time
                        </div>
                        {parsedProposals.map(p => (
                            <div key={p.id} className="p-4 bg-white border-b border-gray-200 border-l text-center">
                                {p.content.delivery_time}
                            </div>
                        ))}

                        {/* Payment Terms Row */}
                        <div className="p-4 font-medium text-gray-700 bg-gray-50 border-b border-gray-200 sticky left-0">
                            Payment Terms
                        </div>
                        {parsedProposals.map(p => (
                            <div key={p.id} className="p-4 bg-white border-b border-gray-200 border-l text-center text-sm">
                                {p.content.payment_terms}
                            </div>
                        ))}

                        {/* Section Header: Technical Compliance */}
                        <div className="col-span-full bg-gray-100 p-3 font-bold text-gray-700 border-b border-gray-200 mt-4">
                            Technical Compliance
                        </div>

                        {/* Dynamic Requirement Rows */}
                        {allRequirements.map((req: any, idx) => (
                            <React.Fragment key={idx}>
                                <div className="p-4 font-medium text-gray-700 bg-gray-50 border-b border-gray-200 sticky left-0 text-sm">
                                    {req}
                                </div>
                                {parsedProposals.map(p => {
                                    const item = p.content.compliance_checklist?.find((c: any) => c.requirement === req);
                                    return (
                                        <div key={p.id} className="p-4 bg-white border-b border-gray-200 border-l text-center flex justify-center items-center">
                                            {item ? (
                                                item.met ? (
                                                    <Check size={20} className="text-green-500" />
                                                ) : (
                                                    <X size={20} className="text-red-500" />
                                                )
                                            ) : (
                                                <Minus size={20} className="text-gray-300" />
                                            )}
                                        </div>
                                    );
                                })}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SideBySideView;
