import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Candidates from './pages/Candidates';
import CandidateDetail from './pages/CandidateDetail';
import EditCandidate from './pages/EditCandidate';
import Pipeline from './pages/Pipeline';

function App() {
  return (
    <BrowserRouter>
      {/* Global toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: 'var(--surface-elevated)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />

      <Navbar />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/candidates" element={<Candidates />} />
          <Route path="/candidates/:id" element={<CandidateDetail />} />
          <Route path="/candidates/:id/edit" element={<EditCandidate />} />
          <Route path="/pipeline" element={<Pipeline />} />
          {/* 404 fallback */}
          <Route
            path="*"
            element={
              <div className="page">
                <div className="empty-state">
                  <div className="empty-state__icon">🗺️</div>
                  <h3>Page not found</h3>
                  <p>The page you're looking for doesn't exist.</p>
                </div>
              </div>
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
