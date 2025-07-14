'use client';

import { useEffect, useRef, useState } from 'react';
import * as faceapi from '@vladmandic/face-api';

// 🎯 Define allowed moods
type MoodType = 'happy' | 'sad' | 'angry' | 'surprised' | 'neutral';

// 🎵 Emoji + Music for each mood
const moodAssets: Record<MoodType, { emoji: string; music: string }> = {
  happy: { emoji: '😄', music: '/music/happy.mp3' },
  sad: { emoji: '😢', music: '/music/sad.mp3' },
  angry: { emoji: '😠', music: '/music/angry.mp3' },
  surprised: { emoji: '😲', music: '/music/surprised.mp3' },
  neutral: { emoji: '😐', music: '/music/neutral.mp3' },
};

export default function MoodDetector() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentMoodRef = useRef<MoodType | null>(null);

  const [mood, setMood] = useState<MoodType | null>(null);
  const [emoji, setEmoji] = useState('🙂');
  const [modelsLoaded, setModelsLoaded] = useState(false);

  // ✅ Load Face API models
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models';
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      ]);
      setModelsLoaded(true);
    };
    loadModels();
  }, []);

  // ✅ Play music based on mood
  const playMusic = (mood: MoodType) => {
    if (mood === currentMoodRef.current) return; // same mood, don't restart music

    const musicPath = moodAssets[mood]?.music;
    if (!musicPath) return;

    // Stop old music
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const newAudio = new Audio(musicPath);
    newAudio.volume = 0.3;
    newAudio.loop = true;
    newAudio.play();

    audioRef.current = newAudio;
    currentMoodRef.current = mood;
  };

  // ✅ Detect mood from webcam feed
  const detectMood = async () => {
    if (!videoRef.current) return;

    const detection = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();

    if (detection?.expressions) {
      const sorted = Object.entries(detection.expressions).sort((a, b) => b[1] - a[1]);
      const moodDetected = sorted[0][0] as MoodType;

      setMood(moodDetected);
      setEmoji(moodAssets[moodDetected]?.emoji || '🙂');
      playMusic(moodDetected);
    }
  };

  // ✅ Start webcam and detection loop
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      intervalRef.current = setInterval(() => {
        if (!videoRef.current || videoRef.current.paused) return;
        detectMood();
      }, 3000);
    } catch (err) {
      console.error('Webcam error:', err);
    }
  };

  // ✅ Stop camera + reset state
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setMood(null);
    setEmoji('🙂');
    currentMoodRef.current = null;
  };

  return (
    <div className="text-center space-y-4">
      <h2 className="text-2xl font-bold">🎥 Webcam Mood Detector</h2>

      <video
        ref={videoRef}
        autoPlay
        muted
        width={320}
        height={240}
        className="mx-auto rounded-lg shadow"
      />

      <div className="text-xl font-semibold">
        Mood: {mood ? mood.toUpperCase() : 'Not Detected'} {emoji}
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={startCamera}
          disabled={!modelsLoaded}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          Start Camera
        </button>

        <button
          onClick={stopCamera}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Stop Camera
        </button>
      </div>
    </div>
  );
}
