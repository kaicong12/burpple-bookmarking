import React from 'react';
import { Box } from '@chakra-ui/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider, useAuth} from './context/AuthContext';
import { RestaurantProvider } from './context/RestaurantContext';

import { Sidebar } from './Components/Sidebar';
import { AppRoutes } from './routes'

function App() {
  const { currentUser } = useAuth();

  return (
    <AuthProvider>
      <RestaurantProvider>
        <Router>
          <Box w="100vw" borderWidth="0px">
            {currentUser && <Sidebar />}
            <AppRoutes />
          </Box>
        </Router>
      </RestaurantProvider>
    </AuthProvider>
  );
}

export default App;
