'use client';
import React, { useState, useEffect } from 'react';
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
  AcademicCapIcon,
  DocumentTextIcon,
  BellAlertIcon,
  ArrowsPointingOutIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  MicrophoneIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';

const isDev = process.env.NODE_ENV === 'development';
const apps = [
  { name: 'Notes', icon: PencilSquareIcon, color: 'from-yellow-400 to-yellow-500', href: `/1234webtool/apps/notes${isDev ? '' : '.html'}`, desc: 'Jot down quick notes and ideas' },
  { name: 'Calculator', icon: CalculatorIcon, color: 'from-gray-700 to-gray-800', href: `/1234webtool/apps/calculator${isDev ? '' : '.html'}`, desc: 'Perform basic and scientific calculations' },
  { name: 'Formulas', icon: AcademicCapIcon, color: 'from-indigo-500 to-violet-600', href: `/1234webtool/apps/formulas${isDev ? '' : '.html'}`, desc: 'Reference common math formulas with live rendering' },
  { name: 'Weather', icon: CloudIcon, color: 'from-blue-400 to-blue-600', href: `/1234webtool/apps/weather${isDev ? '' : '.html'}`, desc: 'Check current weather conditions' },
  { name: 'Todo', icon: ClipboardDocumentListIcon, color: 'from-green-400 to-green-600', href: `/1234webtool/apps/todo${isDev ? '' : '.html'}`, desc: 'Manage your tasks and to-do lists' },
  { name: 'Timer', icon: ClockIcon, color: 'from-red-400 to-red-500', href: `/1234webtool/apps/timer${isDev ? '' : '.html'}`, desc: 'Set timers and stopwatches' },
  { name: 'Calendar', icon: CalendarDaysIcon, color: 'from-red-400 to-red-500', href: `/1234webtool/apps/calendar${isDev ? '' : '.html'}`, desc: 'View and manage your schedule' },
  { name: 'Unit Converter', icon: ArrowsRightLeftIcon, color: 'from-cyan-400 to-cyan-600', href: `/1234webtool/apps/unit-converter${isDev ? '' : '.html'}`, desc: 'Convert between units of measurement' },
  { name: 'Color Picker', icon: SwatchIcon, color: 'from-pink-400 to-rose-500', href: `/1234webtool/apps/color-picker${isDev ? '' : '.html'}`, desc: 'Pick colors and generate palettes' },
  { name: 'Screen Capture', icon: PhotoIcon, color: 'from-orange-400 to-rose-500', href: `/1234webtool/apps/screen-capture${isDev ? '' : '.html'}`, desc: 'Capture and save any area of your screen' },
  { name: 'JSON Formatter', icon: CodeBracketIcon, color: 'from-amber-400 to-orange-500', href: `/1234webtool/apps/json-formatter${isDev ? '' : '.html'}`, desc: 'Format and validate JSON data' },
  { name: 'Regex Tester', icon: MagnifyingGlassIcon, color: 'from-purple-400 to-purple-600', href: `/1234webtool/apps/regex-tester${isDev ? '' : '.html'}`, desc: 'Test and validate regular expressions' },
  { name: 'Speech-to-Text', icon: MicrophoneIcon, color: 'from-teal-400 to-cyan-600', href: `/1234webtool/apps/speech-to-text${isDev ? '' : '.html'}`, desc: 'Convert speech to text using your microphone' },
  { name: 'QR Code', icon: QrCodeIcon, color: 'from-gray-600 to-gray-800', href: `/1234webtool/apps/qr-code${isDev ? '' : '.html'}`, desc: 'Generate QR codes from text or URLs' },
  { name: 'Password Generator', icon: KeyIcon, color: 'from-emerald-500 to-green-600', href: `/1234webtool/apps/password-generator${isDev ? '' : '.html'}`, desc: 'Generate secure random passwords' },
  { name: 'Tab Manager', icon: ArrowsPointingOutIcon, color: 'from-slate-600 to-slate-900', href: `/1234webtool/apps/tab-manager${isDev ? '' : '.html'}`, desc: 'View open tabs and restore history pages from Chrome' },
  { name: 'Quotes', icon: ChatBubbleLeftIcon, color: 'from-violet-500 to-purple-600', href: `/1234webtool/apps/quotes${isDev ? '' : '.html'}`, desc: 'Browse inspirational quotes' },
  { name: 'Word Counter', icon: DocumentTextIcon, color: 'from-sky-400 to-blue-500', href: `/1234webtool/apps/word-counter${isDev ? '' : '.html'}`, desc: 'Count words, characters, and more' },
  { name: 'Reminder', icon: BellAlertIcon, color: 'from-indigo-500 to-purple-600', href: `/1234webtool/apps/reminder${isDev ? '' : '.html'}`, desc: 'Set reminders with rich text and notifications' },
];

type AppItem = (typeof apps)[number];
type DisplayItem =
  | { type: 'app'; app: AppItem; originalIndex: number }
  | { type: 'placeholder' };

const HomeScreen = () => {
  const [isRearranging, setIsRearranging] = useState(false);
  const [appsList, setAppsList] = useState(apps);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);

  // Load custom app order from localStorage
  useEffect(() => {
    const savedOrder = localStorage.getItem('appOrder');
    if (savedOrder) {
      try {
        const appNames = JSON.parse(savedOrder) as string[];
        const orderedApps = appNames
          .map((name) => apps.find(app => app.name === name))
          .filter((app): app is AppItem => app !== undefined);
        
        // Add any new apps that weren't in the saved order
        const savedNames = new Set(appNames);
        const newApps = apps.filter(app => !savedNames.has(app.name));
        
        setAppsList([...orderedApps, ...newApps]);
      } catch {
        setAppsList(apps);
      }
    }
  }, []);

  const handleDragStart = (index: number) => {
    setDraggedItem(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    // Only set drop target if it's not the dragged item
    if (draggedItem !== null && draggedItem !== index) {
      setDropTargetIndex(index);
    }
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedItem === null || draggedItem === dropIndex) {
      setDraggedItem(null);
      setDropTargetIndex(null);
      return;
    }

    const newList = [...appsList];
    const draggedItemContent = newList[draggedItem];
    
    // Remove the dragged item
    newList.splice(draggedItem, 1);
    
    // Insert at the drop position
    newList.splice(dropIndex, 0, draggedItemContent);

    setAppsList(newList);
    
    // Save new order to localStorage as ordered list of app names
    const appNames = newList.map(app => app.name);
    localStorage.setItem('appOrder', JSON.stringify(appNames));

    setDraggedItem(null);
    setDropTargetIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDropTargetIndex(null);
  };

  const resetOrder = () => {
    setAppsList(apps);
    localStorage.removeItem('appOrder');
  };

  const getDisplayList = (): DisplayItem[] => {
    if (draggedItem === null || dropTargetIndex === null) {
      return appsList.map((app, originalIndex) => ({ type: 'app' as const, app, originalIndex }));
    }

    const displayItems: DisplayItem[] = appsList
      .map((app, originalIndex) => ({ type: 'app' as const, app, originalIndex }))
      .filter((item) => item.type === 'app' && item.originalIndex !== draggedItem);

    displayItems.splice(dropTargetIndex, 0, { type: 'placeholder' });
    return displayItems;
  };

  const displayList = getDisplayList();

  return (
    <div className="min-h-screen moving-background flex flex-col items-center justify-center px-8 py-16 relative">
      {/* Rearrange Button */}
      <div className="absolute top-4 left-4 flex gap-2 z-50">
        {isRearranging && (
          <button
            onClick={resetOrder}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            title="Reset to default order"
          >
            <span
              className="flex app-menu-link items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-gray-700 to-gray-800 shadow-md hover:shadow-lg no-underline text-sm font-semibold text-white"
              style={{ fontFamily: 'Arial, sans-serif', textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}
            >
              Reset
            </span>
          </button>
        )}
        <button
          onClick={() => setIsRearranging(!isRearranging)}
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          title={isRearranging ? 'Done rearranging' : 'Rearrange app tiles'}
        >
          <span
            className="flex app-menu-link items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-gray-700 to-gray-800 shadow-md hover:shadow-lg no-underline text-sm font-semibold text-white"
            style={{ fontFamily: 'Arial, sans-serif', textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}
          >
            {isRearranging ? (
              <>
                <XMarkIcon style={{ width: 20, height: 20 }} />
                Done
              </>
            ) : (
              <>
                <ArrowsPointingOutIcon style={{ width: 20, height: 20 }} />
                Rearrange
              </>
            )}
          </span>
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-4 max-w-4xl w-full">
        {displayList.map((item, displayIndex) => {
          if (item.type === 'placeholder') {
            return (
              <div
                key={`placeholder-${displayIndex}`}
                onDragOver={(e) => handleDragOver(e, displayIndex)}
                onDrop={(e) => handleDrop(e, displayIndex)}
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-4 border-dashed border-white/50 bg-white/10 transition-all duration-200 w-32 h-32"
                style={{ fontFamily: 'Arial, sans-serif' }}
              >
                <div className="w-8 h-8 border-2 border-white/50 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white/50 rounded-full"></div>
                </div>
                <span className="text-xs text-white/70 text-center">Drop here</span>
              </div>
            );
          }

          const { app, originalIndex } = item;
          const Icon = app.icon;
          const isDragged = draggedItem === originalIndex;
          
          return isRearranging ? (
            <div
              key={`${app.name}-${originalIndex}`}
              draggable={!isDragged}
              onDragStart={() => handleDragStart(originalIndex)}
              onDragOver={(e) => handleDragOver(e, displayIndex)}
              onDrop={(e) => handleDrop(e, displayIndex)}
              onDragEnd={handleDragEnd}
              className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl transition-all duration-200 w-32 h-32 cursor-move
                          ${isDragged ? 'opacity-0' : ''}
                          bg-gradient-to-br ${app.color} shadow-md hover:shadow-xl`}
              style={{ fontFamily: 'Arial, sans-serif' }}
            >
              {!isDragged && (
                <>
                  <Icon style={{ width: 32, height: 32, color: 'white', strokeWidth: 1.5 }} />
                  <span
                    className="text-sm font-semibold text-white text-center leading-tight"
                    style={{ textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}
                  >
                    {app.name}
                  </span>
                </>
              )}
            </div>
          ) : (
            <a
              key={`${app.name}-${originalIndex}`}
              href={app.href}
              title={app.desc}
              className={`app-menu-link flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-gradient-to-br ${app.color}
                          shadow-md hover:shadow-xl hover:scale-105 active:scale-95
                          transition-all duration-200 no-underline w-32 h-32`}
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
      <a
        href={`/1234webtool/apps/privacy-policy${isDev ? '' : '.html'}`}
        className="absolute bottom-4 left-4 text-sm text-white/70 hover:text-white transition-colors no-underline"
        style={{ fontFamily: 'Arial, sans-serif', textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}
      >
        Privacy Policy
      </a>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
        <a href="https://www.facebook.com/sharer/sharer.php?u=https://tinyurl.com/1234WebTool&text=Check out 1234WebTool!" target="_blank" rel="noopener noreferrer" title="Share on Facebook" className="text-white/70 hover:text-white transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
        </a>
        <a href="https://twitter.com/intent/tweet?url=https://tinyurl.com/1234WebTool&text=Check out 1234WebTool!" target="_blank" rel="noopener noreferrer" title="Share on X" className="text-white/70 hover:text-white transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        </a>
        <a href="https://www.linkedin.com/sharing/share-offsite/?url=https://tinyurl.com/1234WebTool&text=Check out 1234WebTool!" target="_blank" rel="noopener noreferrer" title="Share on LinkedIn" className="text-white/70 hover:text-white transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
        </a>
        <a href="https://www.reddit.com/submit?url=https://tinyurl.com/1234WebTool&title=Check out 1234WebTool!" target="_blank" rel="noopener noreferrer" title="Share on Reddit" className="text-white/70 hover:text-white transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12c0 6.627 5.373 12 12 12s12-5.373 12-12c0-6.627-5.373-12-12-12zm6.066 13.98c.04.225.06.454.06.687 0 3.508-4.088 6.353-9.126 6.353S-.126 18.175-.126 14.667c0-.233.02-.462.06-.687a1.755 1.755 0 01-.744-1.43 1.76 1.76 0 011.76-1.76c.452 0 .862.175 1.17.46 1.155-.786 2.744-1.293 4.508-1.353l.893-4.195a.37.37 0 01.443-.283l2.966.63a1.252 1.252 0 012.37.53 1.252 1.252 0 01-1.25 1.252 1.252 1.252 0 01-1.24-1.105l-2.64-.562-.795 3.73c1.735.07 3.293.577 4.428 1.354a1.75 1.75 0 011.17-.46 1.76 1.76 0 011.76 1.76c0 .593-.296 1.118-.744 1.43zm-11.28.473c0 .69.56 1.25 1.25 1.25s1.25-.56 1.25-1.25-.56-1.25-1.25-1.25-1.25.56-1.25 1.25zm7.23 3.193c-.78.78-2.28 1.04-3.02 1.04s-2.24-.26-3.02-1.04a.318.318 0 010-.45.318.318 0 01.45 0c.49.49 1.54.69 2.57.69s2.08-.2 2.57-.69a.318.318 0 01.45 0 .318.318 0 010 .45zm-.2-1.943c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25z"/></svg>
        </a>
      </div>
      <a
        href="https://buymeacoffee.com/1234webtool"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-4 right-4 text-sm text-white/70 hover:text-white transition-colors no-underline"
        style={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold', textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}
      >
        Buy me a coffee!
      </a>
    </div>
  );
};

export default HomeScreen;
