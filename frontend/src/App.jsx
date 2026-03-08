import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import PostJob from './pages/PostJob';
import Dashboard from './pages/Dashboard';
import Applications from './pages/Applications';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          
          {/* Recruiter Routes */}
          <Route path="/post-job" element={
            <ProtectedRoute requiredRole="recruiter">
              <PostJob />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute requiredRole="recruiter">
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/applications/:jobId" element={
            <ProtectedRoute requiredRole="recruiter">
              <Applications />
            </ProtectedRoute>
          } />
          
          {/* Job Seeker Routes */}
          <Route path="/applications" element={
            <ProtectedRoute requiredRole="seeker">
              <Applications />
            </ProtectedRoute>
          } />

          {/* Profile (Both) */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;