'use client';
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  PencilSquareIcon,
  CalculatorIcon,
  CloudIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  CalendarDaysIcon,
  PhotoIcon,
  WrenchScrewdriverIcon,
  ChatBubbleBottomCenterTextIcon,
} from '@heroicons/react/24/outline';

const IMG_WIDTH = 190;

const apps = [
  { name: 'Notes', icon: PencilSquareIcon, color: 'from-yellow-400 to-yellow-500', href: '/apps/notes', desc: 'Jot down quick notes and ideas' },
  { name: 'Calculator', icon: CalculatorIcon, color: 'from-gray-700 to-gray-800', href: '/apps/calculator', desc: 'Perform basic and scientific calculations' },
  { name: 'Weather', icon: CloudIcon, color: 'from-blue-400 to-blue-600', href: '/apps/weather', desc: 'Check current weather conditions' },
  { name: 'Todo', icon: ClipboardDocumentListIcon, color: 'from-green-400 to-green-600', href: '/apps/todo', desc: 'Manage your tasks and to-do lists' },
  { name: 'Timer', icon: ClockIcon, color: 'from-red-400 to-red-500', href: '/apps/timer', desc: 'Set timers and stopwatches' },
  { name: 'Calendar', icon: CalendarDaysIcon, color: 'from-red-400 to-red-500', href: '/apps/calendar', desc: 'View and manage your schedule' },
  { name: 'Photos', icon: PhotoIcon, color: 'from-purple-400 to-purple-600', href: '/apps/photos', desc: 'Browse and organize your photos' },
  { name: 'Settings', icon: WrenchScrewdriverIcon, color: 'from-gray-400 to-gray-600', href: '/apps/settings', desc: 'Configure app preferences' },
  { name: 'Messages', icon: ChatBubbleBottomCenterTextIcon, color: 'from-green-400 to-green-500', href: '/apps/messages', desc: 'Send and receive messages' },
];

const HomeScreen = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`min-h-screen flex items-center justify-center animate-gradient-rotate ${isOpen ? 'modern-box' : ''} transition-all duration-500`}>
      <div ref={menuRef} className="relative flex flex-col items-center">
        {/* Swiss Army Knife Button */}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="border-none bg-transparent focus:outline-none transition-transform duration-500 ease-out"
          style={{ transform: isOpen ? 'rotate(-15deg) scale(0.9)' : 'rotate(0deg) scale(1)' }}
          aria-label="Open app menu"
        >
          <Image
            src="webtool.png"
            alt="Swiss Army Knife"
            width={190}
            height={62}
            className="drop-shadow-2xl hover:scale-105 transition-transform duration-300"
            draggable={false}
          />
        </button>

        {/* Dropdown List */}
        <div
          className="absolute top-full mt-4 left-1/2 overflow-hidden transition-all duration-500 ease-out origin-top"
          style={{
            width: `${IMG_WIDTH}px`,
            transform: isOpen ? 'scaleY(1) translateX(-50%) translateY(0)' : 'scaleY(0.8) translateX(-50%) translateY(-10px)',
            maxHeight: isOpen ? `${apps.length * 48 + 24}px` : '0px',
            opacity: isOpen ? 1 : 0,
          }}
        >
          <div className="flex flex-col gap-1.5 p-1">
            {apps.map((app, i) => {
              const Icon = app.icon;
              return (
                <a
                  key={app.name}
                  href={app.href}
                  title={app.desc}
                  className={`app-menu-link flex items-center gap-2.5 px-3 py-2 rounded-lg bg-gradient-to-r ${app.color}
                              shadow-md hover:shadow-lg hover:scale-[1.03] active:scale-[0.97]
                              transition-all duration-200 no-underline`}
                  style={{
                    opacity: isOpen ? 1 : 0,
                    transform: isOpen ? 'translateX(0)' : 'translateX(-20px)',
                    transition: `opacity 300ms ease ${i * 50 + 100}ms, transform 300ms ease ${i * 50 + 100}ms, box-shadow 200ms ease, scale 200ms ease`,
                  }}
                >
                  <Icon style={{ width: 18, height: 18, color: 'white', strokeWidth: 2 }} />
                  <span className="text-sm font-semibold text-white" style={{ fontFamily: 'Arial, sans-serif', textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>{app.name}</span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
