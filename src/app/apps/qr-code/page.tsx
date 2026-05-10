'use client';
import dynamic from 'next/dynamic';

const QrCodeGenerator = dynamic(() => import('@/app/components/apps/QrCodeGenerator'), {
  ssr: false,
});

export default function QrCodePage() {
  return <QrCodeGenerator />;
}
