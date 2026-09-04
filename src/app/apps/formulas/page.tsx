'use client';

import dynamic from 'next/dynamic';
import PaywallGate from '@/app/components/PaywallGate';

const FormulasComponent = dynamic(() => import('@/app/components/apps/Formulas'), {
  ssr: false,
});

export default function FormulasPage() {
  return (
    <PaywallGate>
      <FormulasComponent />
    </PaywallGate>
  );
}
