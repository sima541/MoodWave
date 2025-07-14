import PomodoroTimer from "./components/PromodoroTimer";
import MoodDetectorWrapper from "./components/MoodDetectorWrapper";

export default function Home() {
  return (
    <main className="flex justify-around items-center min-h-screen p-4 bg-gradient-to-b from-red-200 to-blue-400">
      <div>
        <PomodoroTimer />
      </div>
      <div>
        <MoodDetectorWrapper />
      </div>
    </main>
  );
}
