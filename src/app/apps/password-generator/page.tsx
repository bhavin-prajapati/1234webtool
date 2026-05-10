'use client';
import dynamic from 'next/dynamic';

const PasswordGenerator = dynamic(() => import('@/app/components/apps/PasswordGenerator'), {
  ssr: false,
});

export default function PasswordGeneratorPage() {
  return <PasswordGenerator />;
}
