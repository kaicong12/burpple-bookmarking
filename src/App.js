import React from 'react';
import { Box } from '@chakra-ui/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider, useAuth} from './context/AuthContext';

import { Sidebar } from './Components/Sidebar';
import { AppRoutes } from './routes'

function App() {
  const { currentUser } = useAuth();

  return (
    <AuthProvider>
      <Router>
        <Box w="100vw" borderWidth="0px">
          {currentUser && <Sidebar />}
          <AppRoutes />
        </Box>
      </Router>
    </AuthProvider>
  );
}

export default App;
