import React, { useEffect } from 'react';
import { testAPI } from '../services/api';

const TestConnection = () => {
  useEffect(() => {
    testAPI.checkConnection()
      .then(() => console.log('Backend connection successful'))
      .catch(error => console.error('Backend connection failed:', error));
  }, []);

  return (
    <div style={{ position: 'fixed', bottom: 10, right: 10, padding: '10px', 
                  backgroundColor: status.includes('success') ? '#4caf50' : '#f44336', 
                  color: 'white', borderRadius: '4px', zIndex: 9999 }}>
      {status}
    </div>
  );
};

export default TestConnection;