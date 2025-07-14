'use client';

import dynamic from 'next/dynamic';

// Dynamically import MoodDetector client-side only
const MoodDetector = dynamic(() => import('./MoodDetector'), { ssr: false });

export default function MoodDetectorWrapper() {
  return <MoodDetector />;
}
