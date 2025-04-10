import React, { useEffect } from 'react';

const CalendlyWidget = () => {
  useEffect(() => {
    // Create script for Calendly widget.js
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    // Create link for Calendly CSS
    const link = document.createElement('link');
    link.href = 'https://assets.calendly.com/assets/external/widget.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Initialize Calendly Badge Widget after scripts are loaded
    script.onload = () => {
      if (window.Calendly) {
        window.Calendly.initBadgeWidget({
          url: 'https://calendly.com/dydevansh/30min',
          text: 'Schedule time with me',
          color: '#0069ff',
          textColor: '#ffffff'
        });
      }
    };

    // Cleanup function to remove scripts when component unmounts
    return () => {
      document.body.removeChild(script);
      document.head.removeChild(link);
      // Remove Calendly badge if it exists
      const calendlyBadge = document.querySelector('.calendly-badge-widget');
      if (calendlyBadge) {
        calendlyBadge.remove();
      }
    };
  }, []); // Empty dependency array means this effect runs once on mount

  return null; // This component doesn't render anything itself
};

export default CalendlyWidget;