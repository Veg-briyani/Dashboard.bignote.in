import { useEffect } from 'react';
import PropTypes from 'prop-types';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  useEffect(() => {
    // If you need to initialize something, add it here
    // Removing the Main() call as it's undefined
  }, []);

  return (
    <div className="layout-wrapper layout-content-navbar">
      <div className="layout-container">
        <Sidebar />
        <div className="layout-page ">
          <Navbar />
          <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
              {children}
            </div>
          </div>
        </div>
        <div className="layout-overlay layout-menu-toggle"></div>
      </div>
    </div>
  );
};

// Add PropTypes validation
Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
