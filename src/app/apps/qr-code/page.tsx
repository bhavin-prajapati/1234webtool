'use client';
import dynamic from 'next/dynamic';
import PaywallGate from '@/app/components/PaywallGate';

const QrCodeGenerator = dynamic(() => import('@/app/components/apps/QrCodeGenerator'), {
  ssr: false,
});

export default function QrCodePage() {
  return (
    <PaywallGate>
      <QrCodeGenerator />
    </PaywallGate>
  );
}
