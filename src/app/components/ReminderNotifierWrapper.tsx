'use client';
import dynamic from 'next/dynamic';

const ReminderNotifier = dynamic(() => import('./ReminderNotifier'), {
  ssr: false,
});

export default function ReminderNotifierWrapper() {
  return <ReminderNotifier />;
}
