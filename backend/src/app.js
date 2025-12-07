const express = require('express');
const cors = require('cors');
const vendorRoutes = require('./routes/vendors');
const rfpRoutes = require('./routes/rfps');
const proposalRoutes = require('./routes/proposals');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/vendors', vendorRoutes);
app.use('/api/rfps', rfpRoutes);
app.use('/api/proposals', proposalRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;

