'use client';
import React, { useState } from 'react';
import Link from 'next/link';

const Weather = () => {
  const [weather] = useState({
    temperature: 72,
    condition: 'Sunny',
    location: 'San Francisco',
    high: 75,
    low: 65
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600">
      {/* iOS-style header */}
      <div className="status-bar fixed top-0 left-0 right-0 h-14 px-4 flex justify-between items-center">
        <Link href="/" className="text-white">
          <span>←</span>
        </Link>
        <h1 className="text-lg font-semibold text-white">Weather</h1>
        <div className="w-4"></div>
      </div>

      <div className="pt-16 px-4 text-white">
        <div className="text-center pt-10">
          <h2 className="text-2xl mb-2">{weather.location}</h2>
          <div className="text-8xl font-thin mb-4">{weather.temperature}°</div>
          <div className="text-xl mb-6">{weather.condition}</div>
          <div className="flex justify-center gap-4">
            <span>H:{weather.high}°</span>
            <span>L:{weather.low}°</span>
          </div>
        </div>

        <div className="mt-10">
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4">
            <h3 className="text-lg mb-4">Hourly Forecast</h3>
            <div className="flex justify-between">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="text-center">
                  <div className="mb-2">{`${(i + 1)}PM`}</div>
                  <div className="text-2xl mb-2">☀️</div>
                  <div>{weather.temperature - i}°</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Weather; 