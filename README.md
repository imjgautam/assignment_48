# AI-Powered RFP Management System

Hi

This is my submission for the procurement RFP management assignment. I built a full-stack application that helps procurement managers create RFPs using natural language, manage vendors, and compare proposals with AI assistance.

## What This Does

Imagine you're a procurement manager who needs to buy 50 laptops. Instead of manually writing a detailed RFP document, you just type "Need 50 laptops for engineering team" and the AI generates a structured RFP with requirements, budget estimates, and timelines. You send it to vendors, they respond with proposals, and the system automatically parses their responses and helps you compare them.

That's what this system does!

## Project Setup

### Prerequisites

Before you start, make sure you have:

- **Node.js** (v18 or higher)
- **PostgreSQL** (v14 or higher)
- **Ollama** (for AI features)
  - After installing, run: `ollama pull llama3.2`

### Installation Steps

1. **Clone and Install Dependencies**
   ```bash
   cd assignment_48
   
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

2. **Set Up Database**
   ```bash
   cd backend
   
   # Run migrations to create tables
   npm run migrate
   
   # Seed the database with sample data
   npm run seed
   ```

3. **Configure Environment (Optional)**
   
   The app works out of the box with default settings. If you want to customize:
   
   Create `backend/.env`:
   ```env
   PORT=3099
   DATABASE_URL=postgresql://localhost/rfp_db
   ```

### Running the Application

You need to run three things:

1. **Start Ollama** (in a separate terminal):
   ```bash
   ollama serve
   ```

2. **Start Backend** (in a separate terminal):
   ```bash
   cd backend
   npm run dev
   ```
   Backend runs on: http://localhost:3099

3. **Start Frontend** (in a separate terminal):
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend runs on: http://localhost:5173

Now open http://localhost:5173 in your browser and you're good to go!

### Email Configuration

The system uses **Ethereal Email** (a fake SMTP service for testing). No configuration needed! 

When you send an RFP, check the backend logs for a preview URL like:
```
📧 Preview URL: https://ethereal.email/message/xxxxx
```

Click that link to see the email that was "sent" to vendors.

### Sample Data

After running `npm run seed`, you'll have:
- **7 vendors** (TechPro Solutions, Digital Dynamics, etc.)
- **3 RFPs** (Laptop Procurement, Catering, Furniture)
- **7 proposals** with detailed specs and AI analysis

You can immediately test the comparison feature by going to the first RFP!

## Tech Stack

### Frontend
- **React** with **TypeScript** - For type safety and better developer experience
- **Vite** - Super fast build tool, much better than Create React App
- **Tailwind CSS** - Utility-first CSS for rapid UI development
- **Axios** - Clean API calls with interceptors
- **React Router** - frontend-side routing
- **Lucide React** - Beautiful, consistent icons

### Backend
- **Node.js** with **Express** - Simple, battle-tested web framework
- **JavaScript** (not TypeScript) - Kept it simple for this assignment
- **Knex.js** - SQL query builder, makes database operations clean
- **PostgreSQL** - Reliable relational database
- **Nodemailer** - Email sending (with Ethereal for testing)

### AI & External Services
- **Ollama** with **Llama 3.2** - Local AI model (no API keys needed!)
- **Ethereal Email** - Fake SMTP for testing emails

### Key Libraries
- `cors` - Cross-origin requests
- `dotenv` - Environment variables

## API Documentation

### RFP Endpoints

**Create RFP with AI**
```
POST /api/rfps/generate
Body: {
  "description": "Need 50 laptops for engineering team"
}
Response: {
  "id": 1,
  "title": "Office Laptop Procurement",
  "structured_data": {
    "requirements": ["16GB RAM", "512GB SSD"],
    "budget_range": "₹50,000 - ₹80,000",
    ...
  }
}
```

**Get All RFPs**
```
GET /api/rfps
Response: [
  { "id": 1, "title": "...", "status": "sent", ... }
]
```

**Get Single RFP**
```
GET /api/rfps/:id
Response: { "id": 1, "title": "...", ... }
```

**Send RFP to Vendors**
```
POST /api/rfps/:id/send
Body: {
  "vendorIds": [1, 2, 3]
}
Response: { "success": true, "sent": 3 }
```

### Vendor Endpoints

**Get All Vendors**
```
GET /api/vendors
Response: [
  { "id": 1, "name": "TechPro", "email": "...", ... }
]
```

**Create Vendor**
```
POST /api/vendors
Body: {
  "name": "New Vendor",
  "email": "vendor@example.com",
  "contact_person": "John Doe",
  "tags": ["hardware", "IT"]
}
```

### Proposal Endpoints

**Simulate Vendor Response**
```
POST /api/proposals/simulate
Body: {
  "rfpId": 1,
  "vendorId": 1,
  "content": "We can provide 50 laptops for ₹65,000 each..."
}
Response: {
  "id": 1,
  "parsed_data": { "total_cost": 3250000, ... },
  "analysis": { "score": 92, "pros": [...], ... }
}
```

**Get Proposals for RFP**
```
GET /api/proposals/rfp/:rfpId
Response: [
  {
    "id": 1,
    "vendor_name": "TechPro",
    "content": { ... },
    "ai_analysis": { "score": 92, ... }
  }
]
```

**Compare Proposals**
```
GET /api/proposals/compare/:rfpId
Response: {
  "recommended_vendor": "TechPro Solutions",
  "reason": "Best balance of price and quality",
  "key_strengths": [...],
  "potential_risks": [...]
}
```

## Decisions & Assumptions

### Why I Used Mock Data for Vendor Responses

**The Problem:** Email receiving is tricky. Services like Ethereal Email don't support inbound IMAP reliably, and setting up a real Gmail/Outlook account requires app passwords and complex configuration.

**My Solution:** I created a "Simulate Vendor Response" feature where you can paste a vendor's proposal (as free-form text, just like an email), and the system processes it exactly the same way it would process a real email.

**Why This Works:**
- The AI parsing logic is identical - whether input comes from IMAP or an API endpoint
- It demonstrates the core requirement: "automatic parsing of vendor responses with AI"
- It's more reliable for demonstration purposes
- The interviewer can test it immediately without email setup

**What's Real:**
- AI parsing of free-form text
- Extraction of structured data (price, timeline, specs)
- AI analysis and scoring
- Database storage
- Comparison and recommendations

**What's Simulated:**
- The email receiving part (but the parsing is 100% real)

### Why Ollama Instead of OpenAI/Claude

**Reasons:**
1. **No API Keys Required** - You can run this project immediately without signing up for anything
2. **Free** - No costs, no rate limits
3. **Privacy** - All data stays local, no external API calls
4. **Fast Enough** - Llama 3.2 is surprisingly good for this use case
5. **Demonstrates Understanding** - Shows I can work with different AI providers

**Trade-offs:**
- Slower than GPT-4 (but acceptable for demo)
- Requires Ollama installation
- Less sophisticated than commercial models

**Easy to Swap:** The AI service is abstracted in `aiService.js` - you could swap Ollama for OpenAI in 5 minutes.

### Database Choice: PostgreSQL

I used PostgreSQL because:
- It's production-ready and widely used
- Better for relational data (RFPs → Vendors → Proposals)
- JSON column support for flexible structured data
- Easy to set up locally

The seed data includes realistic proposals with:
- Detailed technical specifications
- Compliance checklists
- AI-generated scores and analysis
- Multiple vendors per RFP

### Design Decisions

**1. Structured Data Storage**
- RFPs store AI-generated data as JSON in `structured_data` column
- Proposals store parsed content as JSON in `content` column
- This gives flexibility while maintaining queryability

**2. AI Scoring System**
- Each proposal gets a score (0-100)
- Based on: requirements match, pricing, delivery time, completeness
- Stored in database for fast comparison queries

**3. Frontend State Management**
- No Redux/Context - kept it simple with component state
- API calls centralized in `axiosInstance.js`
- Error handling at component level

**4. Email Flow**
- Send: Real emails via Nodemailer + Ethereal
- Receive: Simulation endpoint (explained above)
- Both use same AI parsing pipeline

### Assumptions

**Email Formats:**
- Assumed vendors reply with free-form text (not structured JSON)
- AI can handle various formats (bullet points, paragraphs, tables)
- Extraction works even with messy/incomplete responses

**Proposal Data:**
- Assumed proposals include: price, delivery time, specs
- Not all fields are required (AI extracts what's available)
- Missing data doesn't break the system

**Vendor Matching:**
- Assumed one vendor = one email address
- No handling of multiple contacts per vendor
- Vendor must exist in database before proposal submission

**Currency:**
- All prices in Indian Rupees (₹)
- No multi-currency support
- Numbers can be formatted various ways (AI handles it)

**Limitations I'm Aware Of:**
- No authentication (single-user system as per requirements)
- No file attachment parsing (emails only)
- No real-time updates (manual refresh needed)
- Ollama must be running locally

## AI Tools Usage

### Tools I Used

I used **Google Gemini** (this AI assistant) extensively throughout this project. Here's how:

### What It Helped With

**1. Boilerplate Code (30% time saved)**
- Generated initial Express backend setup
- Created React component templates
- Database migration files
- Knex configuration

**2. Debugging (Huge help!)**
- Fixed CORS issues between frontend/backend
- Debugged Knex query syntax
- Resolved React state update issues
- Fixed Ollama API connection problems

**3. Design Decisions**
- Discussed pros/cons of different AI providers
- Helped design the database schema
- Suggested the simulation approach for email receiving
- Recommended Tailwind CSS for faster UI development

**4. AI Parsing Logic**
- Helped craft prompts for Ollama to extract structured data
- Debugged JSON parsing errors
- Improved prompt engineering for better extraction

**5. Code Quality**
- Suggested error handling patterns
- Recommended async/await best practices
- Helped structure the codebase logically

### Notable Prompts/Approaches

**Effective Prompt Example:**
```
"Create an AI service that takes free-form vendor proposal text 
and extracts: total_cost, delivery_time, payment_terms, and 
technical_specifications. Handle cases where some fields are missing."
```

This led to a robust parsing function that handles incomplete data gracefully.

**Iterative Refinement:**
I didn't just accept the first solution. For the AI parsing, I went through 3-4 iterations:
1. First version: Too strict, failed on missing fields
2. Second: Better, but didn't handle currency symbols
3. Third: Added fallbacks and better error handling
4. Final: Robust enough for various input formats

### What I Learned

**1. AI is Great for Boilerplate, But...**
- It saved tons of time on setup code
- But I had to understand and modify everything
- Blindly copying doesn't work - you need to know what the code does

**2. Debugging with AI is Powerful**
- Explaining the error to AI often helped me understand it better
- AI suggested solutions I wouldn't have thought of
- But I still had to verify and test everything

**3. Prompt Engineering Matters**
- Specific prompts get better results
- Including examples in prompts helps a lot
- Iterating on prompts improved the AI parsing quality

**4. What AI Couldn't Do**
- Make architectural decisions (I had to decide the overall structure)
- Understand business requirements (I had to interpret the assignment)
- Test the application (I had to manually test everything)
- Optimize for my specific use case (needed manual tuning)

### What I Changed Because of AI Tools

**Before AI:** I would have spent hours reading documentation for Knex, Ollama API, etc.

**With AI:** I could ask specific questions and get working examples immediately.

**Example:** Instead of reading all of Ollama's docs, I asked: "How do I call Ollama API with streaming disabled?" and got a working code snippet in seconds.

**But I Still:**
- Read the docs for critical parts
- Tested everything thoroughly
- Refactored AI-generated code to fit my style
- Added error handling AI sometimes missed

### Honest Assessment

AI tools probably saved me 40-50% of development time, especially on:
- Initial setup and configuration
- Debugging obscure errors
- Writing repetitive CRUD operations

But the core logic, design decisions, and understanding of requirements came from me. AI was a powerful assistant, not a replacement for thinking.

## Testing the Application

### Quick Test Flow

1. **View Seeded Data**
   - Go to Dashboard
   - See 3 RFPs already created
   - Click "Compare" on first RFP to see 5 proposals

2. **Create New RFP**
   - Click "Create New RFP"
   - Type: "Need 20 ergonomic office chairs"
   - Click "Generate RFP"
   - See AI-generated requirements

3. **Send to Vendors**
   - Select vendors from the list
   - Click "Send to Vendors"
   - Check backend logs for email preview URL

4. **Simulate Vendor Response**
   - Go to "Simulate Vendor Response"
   - Select RFP and Vendor
   - Paste free-form proposal text
   - Submit and see AI parsing in action

5. **Compare Proposals**
   - Go back to RFP
   - Click "Compare Proposals"
   - See AI analysis, scores, and recommendations

## Project Structure

```
assignment_48/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Main pages (Dashboard, CreateRFP, etc.)
│   │   ├── components/    # Reusable components
│   │   ├── api/           # Axios configuration
│   │   └── App.tsx        # Main app component
│   └── package.json
│
├── backend/                 # Express backend
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic (AI, Email)
│   │   └── app.js         # Express app
│   ├── migrations/        # Database migrations
│   ├── seeds/             # Seed data
│   └── package.json
│
└── README.md              # This file
```

## Common Issues & Solutions

**Ollama not responding?**
- Make sure `ollama serve` is running
- Check if Llama 3.2 is pulled: `ollama list`
- Try: `ollama pull llama3.2`

**Database errors?**
- Run migrations: `npm run migrate`
- Check PostgreSQL is running
- Verify database exists

**Port already in use?**
- Backend: Change PORT in `.env`
- Frontend: Vite will auto-increment port

**CORS errors?**
- Make sure backend is running on port 3099
- Check `cors()` is enabled in `app.js`

## What I'm Proud Of

1. **Clean Architecture** - Separation of concerns, easy to understand
2. **AI Integration** - Actually works well for parsing messy text
3. **Comprehensive Seed Data** - You can test immediately without setup
4. **Error Handling** - Graceful fallbacks, user-friendly messages
5. **UI/UX** - Clean, modern interface with Tailwind

## What I'd Improve With More Time

1. **Real Email Integration** - Set up Gmail IMAP for actual email receiving
2. **Authentication** - Add user login (currently single-user)
3. **File Attachments** - Parse PDF/Excel proposal attachments
4. **Real-time Updates** - WebSocket for live proposal notifications
5. **Better AI Prompts** - Fine-tune for more accurate extraction
6. **Unit Tests** - Add Jest tests for critical functions
7. **Deployment** - Docker setup for easy deployment

## Final Notes

This project demonstrates:
- Full-stack development (React + Node.js)
- AI integration (Ollama for NLP tasks)
- Database design (PostgreSQL with Knex)
- API development (RESTful endpoints)
- Email handling (Nodemailer)
- Modern UI (React + Tailwind)

The simulation approach for vendor responses is a pragmatic solution that demonstrates the core AI parsing capability without the complexity of email server configuration. The underlying AI logic is production-ready and could easily be connected to real IMAP with minimal changes.

Thanks for reviewing my submission! Feel free to reach out if you have any questions.

---

**Time Spent:** ~12-15 hours total
**Coffee Consumed:** Too much ☕
