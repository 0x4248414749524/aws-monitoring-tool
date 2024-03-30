import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ScanUrl from './components/ScanURL';

// pages & components
import Home from './Pages/Home';
import Navbar from './components/Navbar';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Profile from './Pages/Profile';

function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const token = localStorage.getItem('token');
    setLoggedIn(!!token);
  }, []);

  return (
    <div className="App">
      <Router>
        <Navbar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
        <div className="pages">
          <Routes>
            <Route path="/login" element={<Login setLoggedIn={setLoggedIn} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={loggedIn ? <Profile /> : <Login setLoggedIn={setLoggedIn} />} />
            <Route path="/" element={loggedIn ? <Home /> : <Login setLoggedIn={setLoggedIn} />} />
            <Route path="/scan-url" component={ScanUrl} element={<ScanUrl />}/>
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;