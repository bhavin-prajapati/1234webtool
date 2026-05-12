'use client';
import React, { useState, useCallback, useEffect, useRef } from 'react';
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

function toLocalDatetimeString(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function loadEvents(): CalendarEvent[] {
  if (typeof window === 'undefined') return [];
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
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

export default function CalendarApp() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newStart, setNewStart] = useState('');
  const [newEnd, setNewEnd] = useState('');
  const [newAllDay, setNewAllDay] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    setEvents(loadEvents());
  }, []);

  const openModal = (title: string, start: string, end: string, allDay: boolean) => {
    setNewTitle(title);
    setNewStart(start);
    setNewEnd(end);
    setNewAllDay(allDay);
    dialogRef.current?.showModal();
  };

  const openModalFromSlot = useCallback((slot: SlotInfo) => {
    openModal('', toLocalDatetimeString(slot.start), toLocalDatetimeString(slot.end), slot.action === 'click');
  }, []);

  const closeModal = () => {
    dialogRef.current?.close();
    setNewTitle('');
    setNewStart('');
    setNewEnd('');
    setNewAllDay(false);
  };

  const handleAddEvent = useCallback(() => {
    if (!newTitle.trim() || !newStart || !newEnd) return;
    const event: CalendarEvent = {
      id: crypto.randomUUID(),
      title: newTitle.trim(),
      start: new Date(newStart),
      end: new Date(newEnd),
      allDay: newAllDay,
    };
    const updated = [...events, event];
    setEvents(updated);
    saveEvents(updated);
    closeModal();
  }, [newTitle, newStart, newEnd, newAllDay, events]);

  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    if (window.confirm(`Delete "${event.title}"?`)) {
      const updated = events.filter((e) => e.id !== event.id);
      setEvents(updated);
      saveEvents(updated);
    }
  }, [events]);

  return (
    <div>
      <div className="max-w-6xl mx-auto px-8 py-8">
      <div style={{ height: '74vh' }}>
        <Calendar
          localizer={localizer}
          events={events}
          selectable
          onSelectSlot={openModalFromSlot}
          onSelectEvent={handleSelectEvent as (event: object) => void}
          style={{ maxWidth: '800px', maxHeight: '800px', height: '100%', background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
        />
      </div>
      </div>

      <dialog
        ref={dialogRef}
        className="event-dialog"
        onClick={(e) => { if (e.target === dialogRef.current) closeModal(); }}
      >
        <h2 className="text-lg font-semibold mb-4 text-gray-800">New Event</h2>

        <label className="block text-sm font-medium text-gray-600 mb-1">Title</label>
        <input
          autoFocus
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
          placeholder="Event title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddEvent()}
        />

        <div className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            id="allDay"
            checked={newAllDay}
            onChange={(e) => setNewAllDay(e.target.checked)}
            className="rounded border-gray-300 text-blue-500 focus:ring-blue-400"
          />
          <label htmlFor="allDay" className="text-sm text-gray-600">All day</label>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Start</label>
            <input
              type={newAllDay ? 'date' : 'datetime-local'}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 text-sm"
              value={newAllDay ? newStart.split('T')[0] : newStart}
              onChange={(e) => setNewStart(newAllDay ? `${e.target.value}T00:00` : e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">End</label>
            <input
              type={newAllDay ? 'date' : 'datetime-local'}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 text-sm"
              value={newAllDay ? newEnd.split('T')[0] : newEnd}
              onChange={(e) => setNewEnd(newAllDay ? `${e.target.value}T23:59` : e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <button
            className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={closeModal}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleAddEvent}
            disabled={!newTitle.trim() || !newStart || !newEnd}
          >
            Add Event
          </button>
        </div>
      </dialog>
    </div>
  );
}
