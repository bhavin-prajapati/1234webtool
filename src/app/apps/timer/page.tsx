'use client';
import dynamic from 'next/dynamic';

const Timer = dynamic(() => import('@/app/components/apps/Timer'), {
  ssr: false,
});

export default function TimerPage() {
  return <Timer />;
}
