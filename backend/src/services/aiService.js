const { log } = require("console");

// AI Service with Ollama Integration
const generateRfpFromNlp = async (description) => {
    // Mock data for demonstration purposes
    const MOCK_DATA = {
        title: "Enterprise CRM Implementation RFP",
        summary: "Request for Proposal to implement a comprehensive Customer Relationship Management system for a mid-sized enterprise.",
        requirements: [
            "User-friendly interface for sales team",
            "Integration with existing ERP system",
            "Mobile access for field agents",
            "Automated reporting and analytics",
            "24/7 support availability"
        ],
        budget_range: "₹50,000 - ₹100,000",
        timeline: "6 months"
    };

    // Check for demo keyword to return mock data
    // if (description.toLowerCase().includes('demo') || description.toLowerCase().includes('mock')) {
    //     console.log('Returning mock data for demonstration.');
    //     // Simulate delay
    //     await new Promise(resolve => setTimeout(resolve, 1000));
    //     return MOCK_DATA;
    // }

    try {
        console.log('Generating RFP from description using Ollama:', description);
        
        const prompt = `
        You are a procurement expert. Generate a structured RFP (Request for Proposal) based on the following description: "${description}".
        
        Return ONLY a valid JSON object with the following structure:
        {
            "title": "A suitable title",
            "summary": "A brief summary",
            "requirements": ["List of specific requirements"],
            "budget_range": "Estimated budget range",
            "timeline": "Estimated timeline"
        }
        Do not include any markdown formatting or explanation, just the JSON.
        `;

        // Try using a more common model like 'llama2' or 'mistral' if 'llama3' is not available
        // Also added error logging for the response body
        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: process.env.OLLAMA_MODEL || 'llama3.2:latest',
                prompt: prompt,
                stream: false,
                format: 'json'
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Ollama API error: ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        console.log(data);
        
        let rfpData;
        try {
            rfpData = typeof data.response === 'string' ? JSON.parse(data.response) : data.response;
        } catch (e) {
            console.warn('Failed to parse JSON from Ollama, attempting to clean:', e);
            const cleanedResponse = data.response.replace(/```json/g, '').replace(/```/g, '').trim();
            rfpData = JSON.parse(cleanedResponse);
        }

        return rfpData;

    } catch (error) {
        console.error('Error calling Ollama:', error);
        console.log('Falling back to mock data due to error.');
        return {
            ...MOCK_DATA,
            summary: `(Fallback) ${MOCK_DATA.summary}`
        };
    }
};

const parseVendorResponse = async (emailContent) => {
    const prompt = `
    Extract structured data from this vendor email response: "${emailContent}"
    
    Return ONLY a valid JSON object with:
    {
        "total_cost": number (extract the total price),
        "delivery_time": string (e.g. "30 days"),
        "compliance_checklist": [
            { "requirement": "extracted requirement", "met": boolean }
        ],
        "notes": "Any other important details"
    }
    `;

    return await callOllama(prompt);
};

const analyzeProposal = async (proposalData) => {
    const prompt = `
    Analyze this vendor proposal: ${JSON.stringify(proposalData)}
    
    Return ONLY a valid JSON object with:
    {
        "score": number (0-100 based on completeness and value),
        "summary": "Brief analysis of the proposal",
        "pros": ["List of pros"],
        "cons": ["List of cons"]
    }
    `;

    return await callOllama(prompt);
};

const compareProposals = async (rfp, proposals) => {
    const prompt = `
    Compare these vendor proposals for the RFP "${rfp.title}":
    RFP Description: ${rfp.description}
    
    Proposals: ${JSON.stringify(proposals)}
    
    Return ONLY a valid JSON object with:
    {
        "recommended_vendor_id": "ID of the best vendor",
        "recommended_vendor": "Name of the best vendor",
        "reason": "Why this vendor was chosen",
        "comparison_matrix": {
            "vendor_name": "score/summary"
        }
    }
    `;

    return await callOllama(prompt);
};

// Helper function to call Ollama
const callOllama = async (prompt) => {
    try {
        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: process.env.OLLAMA_MODEL || 'llama3.2:latest',
                prompt: prompt,
                stream: false,
                format: 'json'
            }),
        });

        if (!response.ok) throw new Error(`Ollama API error: ${response.statusText}`);

        const data = await response.json();
        let parsedData;
        try {
            parsedData = typeof data.response === 'string' ? JSON.parse(data.response) : data.response;
        } catch (e) {
            const cleaned = data.response.replace(/```json/g, '').replace(/```/g, '').trim();
            parsedData = JSON.parse(cleaned);
        }
        return parsedData;
    } catch (error) {
        console.error('AI Service Error:', error);
        return null;
    }
};

module.exports = {
    generateRfpFromNlp,
    parseVendorResponse,
    analyzeProposal,
    compareProposals
};
