import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useCallback } from 'react';
import './Navbar.css';

const Navbar = ({ loggedIn, setLoggedIn }) => {
  const navigate = useNavigate();
  const logoutTimerRef = useRef(null);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    setLoggedIn(false);
    navigate('/login');
  }, [setLoggedIn, navigate]);

  const resetLogoutTimer = useCallback(() => {
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    logoutTimerRef.current = setTimeout(handleLogout, 1 * 60 * 1000);
  }, [handleLogout]);

  useEffect(() => {
    if (loggedIn) {
      window.addEventListener('mousemove', resetLogoutTimer);
      window.addEventListener('keydown', resetLogoutTimer);
      resetLogoutTimer();
    }

    return () => {
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
      window.removeEventListener('mousemove', resetLogoutTimer);
      window.removeEventListener('keydown', resetLogoutTimer);
    };
  }, [loggedIn, resetLogoutTimer]);

  return (
    <header>
      <h3>AWS MONITORING TOOL</h3>
      {loggedIn && (
        <nav>
          <ul>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/scan-url">Scan URL</Link>
            </li>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Navbar;