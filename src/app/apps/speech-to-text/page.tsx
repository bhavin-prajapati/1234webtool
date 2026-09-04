'use client';

import dynamic from 'next/dynamic';
import PaywallGate from '@/app/components/PaywallGate';

const SpeechToTextComponent = dynamic(() => import('@/app/components/apps/SpeechToText'), {
  ssr: false,
});

export default function SpeechToTextPage() {
  return (
    <PaywallGate>
      <SpeechToTextComponent />
    </PaywallGate>
  );
}