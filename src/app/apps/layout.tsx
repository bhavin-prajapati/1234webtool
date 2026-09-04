"use client";

import React from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function AppsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const handleBack = () => {
    if (typeof window !== 'undefined') {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = '/';
      }
    }
  };

  return (
    <div className="min-h-screen moving-background h-full overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-stone-100 [&::-webkit-scrollbar-thumb]:bg-stone-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 flex flex-col">
      {/* Centered Top Back Control with generous top-padding */}
      <div className="w-full flex justify-center items-center pt-8 pb-4 px-4 z-50">
        <button
          onClick={handleBack}
          className="flex items-center gap-2.5 px-7 py-3 rounded-xl bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 active:scale-95 text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer border border-white/20"
          style={{ fontFamily: 'Arial, sans-serif', textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}
          title="Back to Home"
        >
          <ArrowLeftIcon style={{ width: 22, height: 22 }} />
          <span>Back</span>
        </button>
      </div>
      <div className="flex-1 w-full pb-16">
        {children}
      </div>
    </div>
  );
}
