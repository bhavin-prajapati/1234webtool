'use client';
import dynamic from 'next/dynamic';

const Notes = dynamic(() => import('@/app/components/apps/Notes'), {
  ssr: false,
});

export default function NotesPage() {
  return <Notes />;
}
