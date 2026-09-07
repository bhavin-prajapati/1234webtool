'use client';
import dynamic from 'next/dynamic';
import PaywallGate from '@/app/components/PaywallGate';

const Timer = dynamic(() => import('@/app/components/apps/Timer'), {
  ssr: false,
});

export default function TimerPage() {
  return (
    <PaywallGate>
      <Timer />
    </PaywallGate>
  );
}
