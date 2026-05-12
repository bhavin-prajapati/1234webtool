'use client';
import React, { useEffect } from 'react';
import Calculator from './Calculator/Calculator'

const CalculatorApp = () => {

  useEffect(() => {
    // Client-side code here
    document.title = 'My Page Title';
  }, []);

  return (
    <div className="min-h-screen text-black">
      <Calculator />
    </div>
  );
};

export default CalculatorApp; 