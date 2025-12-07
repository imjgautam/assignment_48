import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import VendorManager from './pages/VendorManager';
import CreateRFP from './pages/CreateRFP';
import RFPDetail from './pages/RFPDetail';
import Comparison from './pages/Comparison';
import SimulateProposal from './pages/SimulateProposal';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="vendors" element={<VendorManager />} />
                    <Route path="create-rfp" element={<CreateRFP />} />
                    <Route path="rfps/:id" element={<RFPDetail />} />
                    <Route path="rfps/:id/compare" element={<Comparison />} />
                    <Route path="simulate-proposal" element={<SimulateProposal />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
