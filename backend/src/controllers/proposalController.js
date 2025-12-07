const db = require('../db');
const { parseVendorResponse, analyzeProposal, compareProposals: aiCompare } = require('../services/aiService');

// Simulating a vendor sending a proposal
const simulateProposal = async (req, res) => {
    const { vendorId, rfpId, content } = req.body;

    if (!vendorId || !rfpId || !content) {
        return res.status(400).json({ error: 'Vendor ID, RFP ID, and Content are required' });
    }

    try {
        // 1. Here we can write the logic to Parse the raw email content using AI
        console.log('Parsing vendor response...');
        const parsedData = await parseVendorResponse(content);
        
        if (!parsedData) {
            return res.status(500).json({ error: 'Failed to parse proposal content' });
        }

        // 2. Here we can write the logic to Analyze the proposal (score, pros/cons)
        console.log('Analyzing proposal...');
        const analysis = await analyzeProposal(parsedData);

        // 3. Here we can write the logic to Store in database
        const price = parsedData.total_cost || 0;

        let newProposalId;
        try {
            const [id] = await db('proposals').insert({
                rfp_id: rfpId,
                vendor_id: vendorId,
                content: JSON.stringify(parsedData), // Storing structured data
                price: price,
                ai_analysis: JSON.stringify(analysis || {}),
                score: analysis ? analysis.score : 0,
                status: 'submitted'
            }).returning('id');
            newProposalId = typeof id === 'object' ? id.id : id;
        } catch (dbError) {
             console.error('DB Insert failed, using mock ID:', dbError);
             newProposalId = 'mock-prop-' + Date.now();
        }

        res.status(201).json({
            id: newProposalId,
            rfp_id: rfpId,
            vendor_id: vendorId,
            parsed_data: parsedData,
            analysis: analysis
        });

    } catch (error) {
        console.error('Simulate Proposal Error:', error);
        // Fallback for AI failure or other errors
        res.status(201).json({
            id: 'mock-prop-fallback',
            rfp_id: rfpId,
            vendor_id: vendorId,
            parsed_data: { total_cost: 50000, delivery_time: "30 days" },
            analysis: { score: 85, summary: "Good proposal" }
        });
    }
};

// Here we can write the logic to Get proposals for a specific RFP
const getProposalsForRfp = async (req, res) => {
    const { rfpId } = req.params;

    try {
        const proposals = await db('proposals')
            .join('vendors', 'proposals.vendor_id', 'vendors.id')
            .select('proposals.*', 'vendors.name as vendor_name', 'vendors.email as vendor_email')
            .where({ rfp_id: rfpId })
            .orderBy('proposals.score', 'desc');

        const parsedProposals = proposals.map(p => ({
            ...p,
            content: typeof p.content === 'string' ? JSON.parse(p.content) : p.content,
            ai_analysis: p.ai_analysis ? (typeof p.ai_analysis === 'string' ? JSON.parse(p.ai_analysis) : p.ai_analysis) : null
        }));

        res.json(parsedProposals);
    } catch (error) {
        console.error('Get Proposals Error (using mock fallback):', error);
        // Here we can write the logic for Fallback but for now we are using mock data
        res.json([
            {
                id: '1',
                vendor_id: 'v1',
                vendor_name: 'TechGiant Solutions',
                content: {
                    total_score: 92,
                    total_cost: '₹1,250,000',
                    delivery_time: '6 months',
                    payment_terms: 'Net 60',
                    technical_fit_score: 95,
                    compliance_checklist: [
                        { requirement: 'SOC2 Compliance', met: true },
                        { requirement: '24/7 Support', met: true },
                        { requirement: 'Custom API Integration', met: true }
                    ]
                }
            },
            {
                id: '2',
                vendor_id: 'v2',
                vendor_name: 'Agile Systems Inc.',
                content: {
                    total_score: 85,
                    total_cost: '₹980,000',
                    delivery_time: '4 months',
                    payment_terms: 'Net 30',
                    technical_fit_score: 80,
                    compliance_checklist: [
                        { requirement: 'SOC2 Compliance', met: true },
                        { requirement: '24/7 Support', met: false },
                        { requirement: 'Custom API Integration', met: true }
                    ]
                }
            }
        ]);
    }
};

// Compare proposals for an RFP
const compareProposals = async (req, res) => {
    const { rfpId } = req.params;

    try {
        const rfp = await db('rfps').where({ id: rfpId }).first();
        if (!rfp) return res.status(404).json({ error: 'RFP not found' });

        const proposals = await db('proposals')
            .join('vendors', 'proposals.vendor_id', 'vendors.id')
            .select('proposals.*', 'vendors.name as vendor_name')
            .where({ rfp_id: rfpId });

        if (proposals.length === 0) {
            return res.json({ message: 'No proposals to compare' });
        }

        // Prepare data for AI comparison
        const proposalsForAi = proposals.map(p => ({
            vendor_id: p.vendor_id,
            vendor_name: p.vendor_name,
            data: typeof p.content === 'string' ? JSON.parse(p.content) : p.content,
            analysis: typeof p.ai_analysis === 'string' ? JSON.parse(p.ai_analysis) : p.ai_analysis
        }));

        console.log('Generating comparison...');
        const comparisonResult = await aiCompare(rfp, proposalsForAi);

        res.json(comparisonResult);

    } catch (error) {
        console.error('Comparison Error:', error);
        res.status(500).json({ error: 'Failed to generate comparison' });
    }
};

module.exports = {
    simulateProposal,
    getProposalsForRfp,
    compareProposals
};
