'use client';
import React, { useState, useEffect } from 'react';

const StatusBar = () => {
  const [time, setTime] = useState(getTime());

  function getTime() {
    return new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(getTime());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="status-bar fixed top-0 left-0 right-0 h-7 px-5 flex justify-between items-center z-50 text-gray-800 text-sm font-medium">
      <div>{time}</div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
            <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7z"/>
          </svg>
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
            <path d="M2 22h20V2L2 22z"/>
          </svg>
          <svg viewBox="0 0 24 24" className="w-5 h-4 fill-current">
            <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default StatusBar; 