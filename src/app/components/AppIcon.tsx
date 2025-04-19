'use client';
import React from 'react';
import Link from 'next/link';

interface AppIconProps {
  name: string;
  icon: string;
  color: string;
  href: string;
}

const AppIcon: React.FC<AppIconProps> = ({ name, icon, color, href }) => {
  return (
    <Link href={href} className="flex flex-col items-center group">
      <div className="bg-white p-16 rounded-2xl 
                      shadow-[0_20px_50px_rgba(0,0,0,0.2)] 
                      transition-all duration-300 
                      w-[400px] h-[400px] 
                      flex flex-col items-center justify-center">
        <div 
          className={`
            ios-app-icon w-[100px] h-[100px] flex items-center justify-center text-6xl
            ${color} transition-all duration-300 ease-in-out
          `}
        >
          <div className="relative z-10">
            {icon}
          </div>
        </div>
        {name && (
          <span className="mt-8 text-2xl text-gray-800 font-medium text-center no-underline">
            {name}
          </span>
        )}
      </div>
    </Link>
  );
};

export default AppIcon; 