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
} from '@heroicons/react/24/outline';

const isDev = process.env.NODE_ENV === 'development';
const apps = [
  { name: 'Speech-to-Text', icon: MicrophoneIcon, color: 'from-teal-400 to-cyan-600', href: `/apps/speech-to-text${isDev ? '' : '.html'}`, desc: 'Convert speech to text using your microphone' },
  { name: 'Reminder', icon: BellAlertIcon, color: 'from-indigo-500 to-purple-600', href: `/apps/reminder${isDev ? '' : '.html'}`, desc: 'Set reminders with rich text and notifications' },
  { name: 'Notes', icon: PencilSquareIcon, color: 'from-yellow-400 to-yellow-500', href: `/apps/notes${isDev ? '' : '.html'}`, desc: 'Jot down quick notes and ideas' },
  { name: 'Calculator', icon: CalculatorIcon, color: 'from-gray-700 to-gray-800', href: `/apps/calculator${isDev ? '' : '.html'}`, desc: 'Perform basic and scientific calculations' },
  { name: 'Formulas', icon: AcademicCapIcon, color: 'from-indigo-500 to-violet-600', href: `/apps/formulas${isDev ? '' : '.html'}`, desc: 'Reference common math formulas with live rendering' },
  { name: 'Weather', icon: CloudIcon, color: 'from-blue-400 to-blue-600', href: `/apps/weather${isDev ? '' : '.html'}`, desc: 'Check current weather conditions' },
  { name: 'Todo', icon: ClipboardDocumentListIcon, color: 'from-green-400 to-green-600', href: `/apps/todo${isDev ? '' : '.html'}`, desc: 'Manage your tasks and to-do lists' },
  { name: 'Timer', icon: ClockIcon, color: 'from-red-400 to-red-500', href: `/apps/timer${isDev ? '' : '.html'}`, desc: 'Set timers and stopwatches' },
  { name: 'Calendar', icon: CalendarDaysIcon, color: 'from-red-400 to-red-500', href: `/apps/calendar${isDev ? '' : '.html'}`, desc: 'View and manage your schedule' },
  { name: 'Unit Converter', icon: ArrowsRightLeftIcon, color: 'from-cyan-400 to-cyan-600', href: `/apps/unit-converter${isDev ? '' : '.html'}`, desc: 'Convert between units of measurement' },
  { name: 'Color Picker', icon: SwatchIcon, color: 'from-pink-400 to-rose-500', href: `/apps/color-picker${isDev ? '' : '.html'}`, desc: 'Pick colors and generate palettes' },
  { name: 'JSON Formatter', icon: CodeBracketIcon, color: 'from-amber-400 to-orange-500', href: `/apps/json-formatter${isDev ? '' : '.html'}`, desc: 'Format and validate JSON data' },
  { name: 'Regex Tester', icon: MagnifyingGlassIcon, color: 'from-purple-400 to-purple-600', href: `/apps/regex-tester${isDev ? '' : '.html'}`, desc: 'Test and validate regular expressions' },
  { name: 'QR Code', icon: QrCodeIcon, color: 'from-gray-600 to-gray-800', href: `/apps/qr-code${isDev ? '' : '.html'}`, desc: 'Generate QR codes from text or URLs' },
  { name: 'Password Generator', icon: KeyIcon, color: 'from-emerald-500 to-green-600', href: `/apps/password-generator${isDev ? '' : '.html'}`, desc: 'Generate secure random passwords' },
  { name: 'Quotes', icon: ChatBubbleLeftIcon, color: 'from-violet-500 to-purple-600', href: `/apps/quotes${isDev ? '' : '.html'}`, desc: 'Browse inspirational quotes' },
  { name: 'Word Counter', icon: DocumentTextIcon, color: 'from-sky-400 to-blue-500', href: `/apps/word-counter${isDev ? '' : '.html'}`, desc: 'Count words, characters, and more' },
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

  const [selectedTileIndex, setSelectedTileIndex] = useState<number | null>(null);

  // Desktop Drag Handlers
  const handleDragStart = (index: number) => {
    setDraggedItem(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItem !== null && draggedItem !== index) {
      setDropTargetIndex(index);
    }
  };

  const handleDrop = (e: React.DragEvent | null, dropIndex: number) => {
    if (e) e.preventDefault();

    if (draggedItem === null || draggedItem === dropIndex) {
      setDraggedItem(null);
      setDropTargetIndex(null);
      return;
    }

    const newList = [...appsList];
    const draggedItemContent = newList[draggedItem];

    newList.splice(draggedItem, 1);
    newList.splice(dropIndex, 0, draggedItemContent);

    setAppsList(newList);
    localStorage.setItem('appOrder', JSON.stringify(newList.map(app => app.name)));

    setDraggedItem(null);
    setDropTargetIndex(null);
    setSelectedTileIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDropTargetIndex(null);
  };

  // Mobile Touch Drag Handlers
  const handleTouchStart = (originalIndex: number, displayIndex: number) => {
    setDraggedItem(originalIndex);
    setDropTargetIndex(displayIndex);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (draggedItem === null) return;
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const tileEl = element?.closest('[data-display-index]');
    if (tileEl) {
      const idxStr = tileEl.getAttribute('data-display-index');
      if (idxStr !== null) {
        const hoverIdx = parseInt(idxStr, 10);
        if (!isNaN(hoverIdx) && hoverIdx !== dropTargetIndex) {
          setDropTargetIndex(hoverIdx);
        }
      }
    }
  };

  const handleTouchEnd = () => {
    if (draggedItem !== null && dropTargetIndex !== null && draggedItem !== dropTargetIndex) {
      const newList = [...appsList];
      const draggedItemContent = newList[draggedItem];
      newList.splice(draggedItem, 1);
      newList.splice(dropTargetIndex, 0, draggedItemContent);
      setAppsList(newList);
      localStorage.setItem('appOrder', JSON.stringify(newList.map(app => app.name)));
    }
    setDraggedItem(null);
    setDropTargetIndex(null);
    setSelectedTileIndex(null);
  };

  // Quick Move with Arrow Buttons
  const moveAppByDisplayIndex = (currentDisplayIndex: number, direction: 'prev' | 'next') => {
    const targetDisplayIndex = direction === 'prev' ? currentDisplayIndex - 1 : currentDisplayIndex + 1;
    if (targetDisplayIndex < 0 || targetDisplayIndex >= appsList.length) return;

    const newList = [...appsList];
    const [movedItem] = newList.splice(currentDisplayIndex, 1);
    newList.splice(targetDisplayIndex, 0, movedItem);

    setAppsList(newList);
    localStorage.setItem('appOrder', JSON.stringify(newList.map(app => app.name)));
    setSelectedTileIndex(null);
  };

  // Tap-to-Swap for Mobile
  const handleTileTap = (displayIndex: number) => {
    if (selectedTileIndex === null) {
      setSelectedTileIndex(displayIndex);
    } else if (selectedTileIndex === displayIndex) {
      setSelectedTileIndex(null);
    } else {
      const newList = [...appsList];
      const temp = newList[selectedTileIndex];
      newList[selectedTileIndex] = newList[displayIndex];
      newList[displayIndex] = temp;
      setAppsList(newList);
      localStorage.setItem('appOrder', JSON.stringify(newList.map(app => app.name)));
      setSelectedTileIndex(null);
    }
  };

  const resetOrder = () => {
    setAppsList(apps);
    setSelectedTileIndex(null);
    localStorage.removeItem('appOrder');
  };

  const toggleRearranging = () => {
    setIsRearranging(!isRearranging);
    setSelectedTileIndex(null);
    setDraggedItem(null);
    setDropTargetIndex(null);
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
    <div className="min-h-screen moving-background flex flex-col items-center justify-start px-4 sm:px-8 pt-6 pb-24 relative">
      {/* Centered Top Action Controls */}
      <div className="w-full flex flex-col items-center gap-2 pt-4 pb-4 z-50">
        <div className="flex items-center justify-center gap-4">
          {isRearranging && (
            <button
              onClick={resetOrder}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 active:scale-95 text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer border border-white/20"
              title="Reset to default order"
              style={{ fontFamily: 'Arial, sans-serif', textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}
            >
              Reset
            </button>
          )}
          <button
            onClick={toggleRearranging}
            className={`flex items-center gap-2.5 px-7 py-3 rounded-xl font-semibold text-base shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200 cursor-pointer border border-white/20 text-white ${
              isRearranging
                ? 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600'
                : 'bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800'
            }`}
            title={isRearranging ? 'Done rearranging' : 'Rearrange app tiles'}
            style={{ fontFamily: 'Arial, sans-serif', textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}
          >
            {isRearranging ? (
              <>
                <XMarkIcon style={{ width: 22, height: 22 }} />
                Done
              </>
            ) : (
              <>
                <ArrowsPointingOutIcon style={{ width: 22, height: 22 }} />
                Rearrange
              </>
            )}
          </button>
        </div>

        {isRearranging && (
          <p className="text-white/85 text-xs sm:text-sm font-medium text-center mt-1 select-none px-4" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
            {selectedTileIndex !== null
              ? `Tap another tile to swap with #${selectedTileIndex + 1}`
              : 'Drag with your finger, tap tiles to swap, or use ◀ ▶ to move.'}
          </p>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-4 max-w-4xl w-full my-auto">
        {displayList.map((item, displayIndex) => {
          if (item.type === 'placeholder') {
            return (
              <div
                key={`placeholder-${displayIndex}`}
                data-display-index={displayIndex}
                onDragOver={(e) => handleDragOver(e, displayIndex)}
                onDrop={(e) => handleDrop(e, displayIndex)}
                className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border-4 border-dashed border-white/60 bg-white/15 transition-all duration-150 w-32 h-36"
                style={{ fontFamily: 'Arial, sans-serif' }}
              >
                <div className="w-8 h-8 border-2 border-white/60 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white/60 rounded-full"></div>
                </div>
                <span className="text-xs text-white/80 font-medium text-center">Drop here</span>
              </div>
            );
          }

          const { app, originalIndex } = item;
          const Icon = app.icon;
          const isDragged = draggedItem === originalIndex;
          const isSelected = selectedTileIndex === displayIndex;

          return isRearranging ? (
            <div
              key={`${app.name}-${originalIndex}`}
              data-display-index={displayIndex}
              draggable={!isDragged}
              onDragStart={() => handleDragStart(originalIndex)}
              onDragOver={(e) => handleDragOver(e, displayIndex)}
              onDrop={(e) => handleDrop(e, displayIndex)}
              onDragEnd={handleDragEnd}
              onTouchStart={() => handleTouchStart(originalIndex, displayIndex)}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onTouchCancel={handleTouchEnd}
              onClick={() => handleTileTap(displayIndex)}
              className={`flex flex-col items-center justify-between p-2.5 rounded-2xl transition-all duration-200 w-32 h-36 select-none touch-none cursor-grab active:cursor-grabbing
                          ${isDragged ? 'opacity-30 scale-95' : ''}
                          ${isSelected ? 'ring-4 ring-yellow-400 scale-105 shadow-2xl' : 'shadow-md hover:shadow-xl'}
                          bg-gradient-to-br ${app.color}`}
              style={{ fontFamily: 'Arial, sans-serif' }}
            >
              <div className="flex flex-col items-center justify-center gap-1.5 pt-1 pointer-events-none">
                <Icon style={{ width: 32, height: 32, color: 'white', strokeWidth: 1.5 }} />
                <span
                  className="text-xs sm:text-sm font-semibold text-white text-center leading-tight line-clamp-1"
                  style={{ textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}
                >
                  {app.name}
                </span>
              </div>

              {/* Mobile and Desktop Arrow Controls */}
              <div className="flex items-center justify-between w-full px-0.5 pt-1 mt-auto z-20">
                <button
                  type="button"
                  disabled={displayIndex === 0}
                  onClick={(e) => {
                    e.stopPropagation();
                    moveAppByDisplayIndex(displayIndex, 'prev');
                  }}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center bg-black/40 hover:bg-black/60 active:scale-90 text-white text-xs font-bold transition-all ${
                    displayIndex === 0 ? 'opacity-20 cursor-not-allowed' : 'opacity-85 hover:opacity-100 cursor-pointer'
                  }`}
                  title="Move left"
                >
                  ◀
                </button>
                <span className="text-[11px] text-white/90 font-mono font-bold select-none">
                  #{displayIndex + 1}
                </span>
                <button
                  type="button"
                  disabled={displayIndex === appsList.length - 1}
                  onClick={(e) => {
                    e.stopPropagation();
                    moveAppByDisplayIndex(displayIndex, 'next');
                  }}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center bg-black/40 hover:bg-black/60 active:scale-90 text-white text-xs font-bold transition-all ${
                    displayIndex === appsList.length - 1 ? 'opacity-20 cursor-not-allowed' : 'opacity-85 hover:opacity-100 cursor-pointer'
                  }`}
                  title="Move right"
                >
                  ▶
                </button>
              </div>
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
        href={`/apps/privacy-policy${isDev ? '' : '.html'}`}
        className="absolute bottom-4 left-4 text-sm text-white/70 hover:text-white transition-colors no-underline"
        style={{ fontFamily: 'Arial, sans-serif', textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}
      >
        Privacy Policy
      </a>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
        <a href="https://www.facebook.com/sharer/sharer.php?u=https://tinyurl.com/1234WebTool&text=Check out 1234WebTool!" target="_blank" rel="noopener noreferrer" title="Share on Facebook" className="text-white/70 hover:text-white transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
        </a>
        <a href="https://twitter.com/intent/tweet?url=https://tinyurl.com/1234WebTool&text=Check out 1234WebTool!" target="_blank" rel="noopener noreferrer" title="Share on X" className="text-white/70 hover:text-white transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
        </a>
        <a href="https://www.linkedin.com/sharing/share-offsite/?url=https://tinyurl.com/1234WebTool&text=Check out 1234WebTool!" target="_blank" rel="noopener noreferrer" title="Share on LinkedIn" className="text-white/70 hover:text-white transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
        </a>
        <a href="https://www.reddit.com/submit?url=https://tinyurl.com/1234WebTool&title=Check out 1234WebTool!" target="_blank" rel="noopener noreferrer" title="Share on Reddit" className="text-white/70 hover:text-white transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12c0 6.627 5.373 12 12 12s12-5.373 12-12c0-6.627-5.373-12-12-12zm6.066 13.98c.04.225.06.454.06.687 0 3.508-4.088 6.353-9.126 6.353S-.126 18.175-.126 14.667c0-.233.02-.462.06-.687a1.755 1.755 0 01-.744-1.43 1.76 1.76 0 011.76-1.76c.452 0 .862.175 1.17.46 1.155-.786 2.744-1.293 4.508-1.353l.893-4.195a.37.37 0 01.443-.283l2.966.63a1.252 1.252 0 012.37.53 1.252 1.252 0 01-1.25 1.252 1.252 1.252 0 01-1.24-1.105l-2.64-.562-.795 3.73c1.735.07 3.293.577 4.428 1.354a1.75 1.75 0 011.17-.46 1.76 1.76 0 011.76 1.76c0 .593-.296 1.118-.744 1.43zm-11.28.473c0 .69.56 1.25 1.25 1.25s1.25-.56 1.25-1.25-.56-1.25-1.25-1.25-1.25.56-1.25 1.25zm7.23 3.193c-.78.78-2.28 1.04-3.02 1.04s-2.24-.26-3.02-1.04a.318.318 0 010-.45.318.318 0 01.45 0c.49.49 1.54.69 2.57.69s2.08-.2 2.57-.69a.318.318 0 01.45 0 .318.318 0 010 .45zm-.2-1.943c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25z" /></svg>
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
