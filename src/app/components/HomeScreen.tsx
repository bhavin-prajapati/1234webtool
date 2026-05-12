'use client';
import React from 'react';
import {
  PencilSquareIcon,
  CalculatorIcon,
  CloudIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  CalendarDaysIcon,
  ArrowsRightLeftIcon,
  SwatchIcon,
  CodeBracketIcon,
  QrCodeIcon,
  KeyIcon,
  ChatBubbleLeftIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

const isDev = process.env.NODE_ENV === 'development';
const apps = [
  { name: 'Notes', icon: PencilSquareIcon, color: 'from-yellow-400 to-yellow-500', href: `/1234webtool/apps/notes${isDev ? '' : '.html'}`, desc: 'Jot down quick notes and ideas' },
  { name: 'Calculator', icon: CalculatorIcon, color: 'from-gray-700 to-gray-800', href: `/1234webtool/apps/calculator${isDev ? '' : '.html'}`, desc: 'Perform basic and scientific calculations' },
  { name: 'Weather', icon: CloudIcon, color: 'from-blue-400 to-blue-600', href: `/1234webtool/apps/weather${isDev ? '' : '.html'}`, desc: 'Check current weather conditions' },
  { name: 'Todo', icon: ClipboardDocumentListIcon, color: 'from-green-400 to-green-600', href: `/1234webtool/apps/todo${isDev ? '' : '.html'}`, desc: 'Manage your tasks and to-do lists' },
  { name: 'Timer', icon: ClockIcon, color: 'from-red-400 to-red-500', href: `/1234webtool/apps/timer${isDev ? '' : '.html'}`, desc: 'Set timers and stopwatches' },
  { name: 'Calendar', icon: CalendarDaysIcon, color: 'from-red-400 to-red-500', href: `/1234webtool/apps/calendar${isDev ? '' : '.html'}`, desc: 'View and manage your schedule' },
  { name: 'Unit Converter', icon: ArrowsRightLeftIcon, color: 'from-cyan-400 to-cyan-600', href: `/1234webtool/apps/unit-converter${isDev ? '' : '.html'}`, desc: 'Convert between units of measurement' },
  { name: 'Color Picker', icon: SwatchIcon, color: 'from-pink-400 to-rose-500', href: `/1234webtool/apps/color-picker${isDev ? '' : '.html'}`, desc: 'Pick colors and generate palettes' },
  { name: 'JSON Formatter', icon: CodeBracketIcon, color: 'from-amber-400 to-orange-500', href: `/1234webtool/apps/json-formatter${isDev ? '' : '.html'}`, desc: 'Format and validate JSON data' },
  { name: 'QR Code', icon: QrCodeIcon, color: 'from-gray-600 to-gray-800', href: `/1234webtool/apps/qr-code${isDev ? '' : '.html'}`, desc: 'Generate QR codes from text or URLs' },
  { name: 'Password Gen', icon: KeyIcon, color: 'from-emerald-500 to-green-600', href: `/1234webtool/apps/password-generator${isDev ? '' : '.html'}`, desc: 'Generate secure random passwords' },
  { name: 'Quotes', icon: ChatBubbleLeftIcon, color: 'from-violet-500 to-purple-600', href: `/1234webtool/apps/quotes${isDev ? '' : '.html'}`, desc: 'Browse inspirational quotes' },
  { name: 'Word Counter', icon: DocumentTextIcon, color: 'from-sky-400 to-blue-500', href: `/1234webtool/apps/word-counter${isDev ? '' : '.html'}`, desc: 'Count words, characters, and more' },
];

const HomeScreen = () => {
  return (
    <div className="min-h-screen moving-background flex items-center justify-center p-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-4xl w-full">
        {apps.map((app) => {
          const Icon = app.icon;
          return (
            <a
              key={app.name}
              href={app.href}
              title={app.desc}
              className={`app-menu-link flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-gradient-to-br ${app.color}
                          shadow-md hover:shadow-xl hover:scale-105 active:scale-95
                          transition-all duration-200 no-underline aspect-square`}
            >
<Icon style={{ width: 32, height: 32, color: 'white', strokeWidth: 1.5 }} />
              <span
                className="text-sm font-semibold text-white text-center leading-tight"
                style={{ fontFamily: 'Arial, sans-serif', textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}
              >
                {app.name}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default HomeScreen;
