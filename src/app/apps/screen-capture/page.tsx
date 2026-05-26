'use client';
import dynamic from 'next/dynamic';

const ScreenCapture = dynamic(() => import('@/app/components/apps/ScreenCapture'), {
  ssr: false,
});

export default function ScreenCapturePage() {
  return <ScreenCapture />;
}
