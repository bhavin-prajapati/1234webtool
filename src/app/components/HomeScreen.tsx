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

const apps = [
  { name: 'Notes', icon: PencilSquareIcon, color: 'from-yellow-400 to-yellow-500', href: '/apps/notes' },
  { name: 'Calculator', icon: CalculatorIcon, color: 'from-gray-700 to-gray-800', href: '/apps/calculator' },
  { name: 'Weather', icon: CloudIcon, color: 'from-blue-400 to-blue-600', href: '/apps/weather' },
  { name: 'Todo', icon: ClipboardDocumentListIcon, color: 'from-green-400 to-green-600', href: '/apps/todo' },
  { name: 'Timer', icon: ClockIcon, color: 'from-red-400 to-red-500', href: '/apps/timer' },
  { name: 'Calendar', icon: CalendarDaysIcon, color: 'from-red-400 to-red-500', href: '/apps/calendar' },
  { name: 'Photos', icon: PhotoIcon, color: 'from-purple-400 to-purple-600', href: '/apps/photos' },
  { name: 'Settings', icon: WrenchScrewdriverIcon, color: 'from-gray-400 to-gray-600', href: '/apps/settings' },
  { name: 'Messages', icon: ChatBubbleBottomCenterTextIcon, color: 'from-green-400 to-green-500', href: '/apps/messages' },
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
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'rgb(223, 233, 245)' }}>
      <div ref={menuRef} className="relative flex flex-col items-center">
        {/* Swiss Army Knife Button */}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="border-none bg-transparent focus:outline-none transition-transform duration-500 ease-out"
          style={{ transform: isOpen ? 'rotate(-15deg) scale(0.9)' : 'rotate(0deg) scale(1)' }}
          aria-label="Open app menu"
        >
          <Image
            src="/webtool.png"
            alt="Swiss Army Knife"
            width={190}
            height={62}
            className="drop-shadow-2xl hover:scale-105 transition-transform duration-300"
            draggable={false}
          />
        </button>

        {/* Dropdown List */}
        <div
          className="absolute top-full mt-4 w-72 overflow-hidden transition-all duration-500 ease-out origin-top"
          style={{
            maxHeight: isOpen ? `${apps.length * 56 + 16}px` : '0px',
            opacity: isOpen ? 1 : 0,
            transform: isOpen ? 'scaleY(1) translateY(0)' : 'scaleY(0.8) translateY(-10px)',
          }}
        >
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 p-2">
            {apps.map((app, i) => {
              const Icon = app.icon;
              return (
                <a
                  key={app.name}
                  href={app.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl
                             hover:bg-white/70 transition-all duration-200 group"
                  style={{
                    opacity: isOpen ? 1 : 0,
                    transform: isOpen ? 'translateX(0)' : 'translateX(-20px)',
                    transition: `opacity 300ms ease ${i * 50 + 100}ms, transform 300ms ease ${i * 50 + 100}ms`,
                  }}
                >
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${app.color}
                                   flex items-center justify-center shrink-0
                                   group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-800">{app.name}</span>
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
