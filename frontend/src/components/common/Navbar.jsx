import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/plans', label: 'My Plans' },
];

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link to="/" className="text-lg font-bold text-primary-700">
          🏋️ AI Fitness Planner
        </Link>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              {NAV_LINKS.map(({ to, label }) => (
                <Link key={to} to={to} className="text-sm text-slate-600 hover:text-primary-700">
                  {label}
                </Link>
              ))}
              <span className="text-sm text-slate-500 hidden sm:inline">
                Hi, {user?.name?.split(' ')[0] ?? 'there'}
              </span>
              <button type="button" onClick={handleLogout} className="btn-secondary text-sm py-1.5 px-3">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-slate-600 hover:text-primary-700">
                Login
              </Link>
              <Link to="/register" className="btn-primary text-sm py-1.5 px-3">
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
