import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import CreateTrip from '@/pages/CreateTrip';
import TripDetails from '@/pages/TripDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/create" element={<CreateTrip />} />
        <Route path="/trip/:id" element={<TripDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
