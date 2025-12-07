import React from 'react';
import { Sparkles, Check, AlertTriangle, ThumbsUp } from 'lucide-react';

interface AIRecommendationPanelProps {
    recommendation: any;
}

const AIRecommendationPanel: React.FC<AIRecommendationPanelProps> = ({ recommendation }) => {
    if (!recommendation) return null;

    return (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg shadow-sm border border-indigo-100 overflow-hidden">
            <div className="p-6">
                <div className="flex items-center mb-4">
                    <div className="p-2 bg-indigo-600 rounded-lg text-white mr-3">
                        <Sparkles size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-indigo-900">AI Recommendation</h3>
                </div>

                <div className="mb-6">
                    <p className="text-sm text-indigo-600 font-medium mb-1">Top Choice</p>
                    <h2 className="text-2xl font-bold text-gray-900">{recommendation.recommended_vendor}</h2>
                    <div className="flex items-center mt-2">
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                            <ThumbsUp size={12} className="mr-1" /> 95% Confidence
                        </span>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Why this vendor?</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {recommendation.reason}
                        </p>
                    </div>

                    {recommendation.key_strengths && (
                        <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-2">Key Strengths</h4>
                            <ul className="space-y-2">
                                {recommendation.key_strengths.map((strength: string, idx: number) => (
                                    <li key={idx} className="flex items-start text-sm text-gray-600">
                                        <Check size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                        <span>{strength}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {recommendation.potential_risks && (
                        <div className="bg-yellow-50 p-3 rounded-md border border-yellow-100">
                            <h4 className="text-sm font-semibold text-yellow-800 mb-2 flex items-center">
                                <AlertTriangle size={14} className="mr-1" /> Potential Risks
                            </h4>
                            <ul className="space-y-1">
                                {recommendation.potential_risks.map((risk: string, idx: number) => (
                                    <li key={idx} className="text-xs text-yellow-700">
                                        • {risk}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-indigo-600 px-6 py-3">
                <p className="text-xs text-indigo-100 font-medium text-center">
                    AI analysis based on RFP requirements and vendor proposals
                </p>
            </div>
        </div>
    );
};

export default AIRecommendationPanel;
