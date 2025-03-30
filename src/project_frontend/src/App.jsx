import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./HomePage";
import { login, logout, isAuthenticated } from './auth';


const App = () => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      setAuthenticated(true);
    }
  }, []);

  const handleLogin = async () => {
    await login();
    setAuthenticated(true);
  };

  const handleLogout = async () => {
    await logout();
    setAuthenticated(false);
  };

  return (
    <Router>
        <nav>
          {authenticated ? (
            <>
              <Link to="/">HomePage</Link>
              {/* <Link to="/contributions">Your Contributions</Link> */}
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <button onClick={handleLogin}>Login</button>
          )}
        </nav>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
    </Router>
  );
};

export default App;
