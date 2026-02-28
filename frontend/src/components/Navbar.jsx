import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          HireHub
        </Link>

        <div className="flex items-center gap-6">
          {user ? (
            <>
              <Link to="/jobs" className="hover:text-blue-200">Browse Jobs</Link>
              
              {user.role === 'recruiter' ? (
                <>
                  <Link to="/post-job" className="hover:text-blue-200">Post Job</Link>
                  <Link to="/dashboard" className="hover:text-blue-200">Dashboard</Link>
                </>
              ) : (
                <Link to="/applications" className="hover:text-blue-200">My Applications</Link>
              )}
              
              <Link to="/profile" className="hover:text-blue-200">Profile</Link>
              
              <div className="flex items-center gap-3">
                <span className="text-sm">Hello, {user.name}</span>
                <button 
                  onClick={handleLogout}
                  className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-200">Login</Link>
              <Link to="/register" className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-50">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;