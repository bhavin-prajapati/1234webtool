'use client';
import dynamic from 'next/dynamic';

const Reminder = dynamic(() => import('@/app/components/apps/Reminder'), {
  ssr: false,
});

export default function ReminderPage() {
  return <Reminder />;
}
