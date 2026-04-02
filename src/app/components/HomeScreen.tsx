'use client';
import React from 'react';
import { PencilSquareIcon, CalculatorIcon, CloudIcon, ClipboardDocumentListIcon, ClockIcon, CalendarDaysIcon, PhotoIcon, WrenchScrewdriverIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline'

const HomeScreen = () => {
  const apps = [
    {
      name: 'Notes',
      icon: <PencilSquareIcon />,
      color: 'bg-gradient-to-br from-yellow-400 to-yellow-500',
      href: '/apps/notes',
      description: 'Jot down quick thoughts, ideas, and reminders'
    },
    {
      name: 'Calculator',
      icon: <CalculatorIcon />,
      color: 'bg-gradient-to-br from-gray-700 to-gray-800',
      href: '/apps/calculator',
      description: 'Perform basic and advanced calculations'
    },
    {
      name: 'Weather',
      icon: <CloudIcon />,
      color: 'bg-gradient-to-br from-blue-400 to-blue-600',
      href: '/apps/weather',
      description: 'Check current conditions and forecasts'
    },
    {
      name: 'Todo',
      icon: <ClipboardDocumentListIcon />,
      color: 'bg-gradient-to-br from-green-400 to-green-600',
      href: '/apps/todo',
      description: 'Manage your tasks and stay organized'
    },
    {
      name: 'Clock',
      icon: <ClockIcon />,
      color: 'bg-gradient-to-br from-red-400 to-red-500',
      href: '/apps/clock',
      description: 'View the time, set alarms, and use timers'
    },
    {
      name: 'Calendar',
      icon: <CalendarDaysIcon />,
      color: 'bg-gradient-to-br from-red-400 to-red-500',
      href: '/apps/calendar',
      description: 'Schedule events and track important dates'
    },
    {
      name: 'Photos',
      icon: <PhotoIcon />,
      color: 'bg-gradient-to-br from-purple-400 to-purple-600',
      href: '/apps/photos',
      description: 'Browse and organize your photo library'
    },
    {
      name: 'Settings',
      icon: <WrenchScrewdriverIcon />,
      color: 'bg-gradient-to-br from-gray-400 to-gray-600',
      href: '/apps/settings',
      description: 'Customize preferences and configurations'
    },
    {
      name: 'Messages',
      icon: <ChatBubbleBottomCenterTextIcon />,
      color: 'bg-gradient-to-br from-green-400 to-green-500',
      href: '/apps/messages',
      description: 'Send and receive messages with others'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main container with padding for status bar */}
      <div className="pt-32 px-24 min-h-screen">
        {/* Grid container */}
        <ul id="hexGrid">
          {apps.map((app) => (
            <li className="hex" key={app.name}>
              <div className="hexIn">
                <a className="hexLink" href={app.href}>
                  <div style={{
                    width: '65%',
                    height: '100%',
                    paddingTop: '40%'
                  }}>{app.icon}</div>
                  <h1>{app.name}</h1>
                  <p>{app.description}</p>
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HomeScreen; 