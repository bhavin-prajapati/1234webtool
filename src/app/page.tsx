import HomeScreen from './components/HomeScreen';
import StatusBar from './components/StatusBar';

export default function Home() {
  return (
    <main className="h-screen overflow-hidden">
      <StatusBar />
      <HomeScreen />
    </main>
  );
}