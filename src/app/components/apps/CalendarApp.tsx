'use client';
import React, { useState, useCallback, useEffect } from 'react';
import { Calendar, dateFnsLocalizer, SlotInfo } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendar.css';

const locales = { 'en-US': enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date: Date) => startOfWeek(date, { weekStartsOn: 0 }),
  getDay,
  locales,
});

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
}

const STORAGE_KEY = 'calendar-events';

function loadEvents(): CalendarEvent[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return JSON.parse(stored).map((e: any) => ({
      ...e,
      start: new Date(e.start),
      end: new Date(e.end),
    }));
  } catch {
    return [];
  }
}

function saveEvents(events: CalendarEvent[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

export default function CalendarApp() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [pendingSlot, setPendingSlot] = useState<SlotInfo | null>(null);

  useEffect(() => {
    setEvents(loadEvents());
  }, []);

  const handleSelectSlot = useCallback((slot: SlotInfo) => {
    setPendingSlot(slot);
    setNewTitle('');
    setShowModal(true);
  }, []);

  const handleAddEvent = useCallback(() => {
    if (!newTitle.trim() || !pendingSlot) return;
    const event: CalendarEvent = {
      id: crypto.randomUUID(),
      title: newTitle.trim(),
      start: pendingSlot.start,
      end: pendingSlot.end,
      allDay: pendingSlot.action === 'click',
    };
    const updated = [...events, event];
    setEvents(updated);
    saveEvents(updated);
    setNewTitle('');
    setShowModal(false);
    setPendingSlot(null);
  }, [newTitle, pendingSlot, events]);

  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    if (window.confirm(`Delete "${event.title}"?`)) {
      const updated = events.filter((e) => e.id !== event.id);
      setEvents(updated);
      saveEvents(updated);
    }
  }, [events]);

  const closeModal = () => {
    setShowModal(false);
    setPendingSlot(null);
    setNewTitle('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-8 py-8">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Calendar</h1>
      <div style={{ height: '78vh' }}>
        <Calendar
          localizer={localizer}
          events={events}
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent as (event: object) => void}
          style={{ height: '100%', background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
        />
      </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-80">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">New Event</h2>
            <input
              autoFocus
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
              placeholder="Event title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddEvent()}
            />
            <div className="flex gap-2 justify-end">
              <button
                className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                onClick={handleAddEvent}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
