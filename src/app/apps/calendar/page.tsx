import CalendarApp from '@/app/components/apps/CalendarApp';
import PaywallGate from '@/app/components/PaywallGate';

export default function CalendarPage() {
  return (
    <PaywallGate>
      <CalendarApp />
    </PaywallGate>
  );
}
