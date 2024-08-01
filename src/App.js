import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider, useAuth} from './context/AuthContext';

import { AppRoutes } from './routes';
import { Sidebar } from './Components/Sidebar';

function App() {
  const { currentUser } = useAuth();

  return (
    <AuthProvider>
      <Router>
        <Flex>
          {currentUser && <Sidebar />}
          <Box flex={1}>
            <AppRoutes />
          </Box>
        </Flex>
      </Router>
    </AuthProvider>
  );
}

export default App;
