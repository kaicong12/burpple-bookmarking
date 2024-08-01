import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './Pages/Home';
import { Login } from './Pages/Login';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';

function App() {
  const { currentUser } = useAuth();
  console.log(currentUser, 'current')

  return (
    <AuthProvider>
      <Router>
        <Routes>
          { currentUser ? <Route path="/home" element={<Home />} />: (
            <Route path="/login" element={<Login />} />
          )}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
