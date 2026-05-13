'use client';

import dynamic from 'next/dynamic';

const SpeechToTextComponent = dynamic(() => import('@/app/components/apps/SpeechToText'), {
  ssr: false,
});

export default function SpeechToTextPage() {
  return <SpeechToTextComponent />;
}