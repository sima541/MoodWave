
# 🎵 MoodWave
— Mood-Based Music Player using AI

This is a fun and innovative Next.js app that detects your mood using your webcam and plays music + shows emoji accordingly.

## 👀 Features
- Real-time face detection using webcam
- Mood analysis using Face Expression Recognition
- Emoji and Music changes as per mood (happy, sad, angry, etc.)
- Start/Stop camera control
- Music auto-stops when camera is stopped
- Built using Next.js App Router + TypeScript

## 📸 How It Works
1. Loads face detection + expression models (face-api.js)
2. Activates webcam and tracks facial expressions
3. Based on the highest expression, plays a matching song and emoji

## 🛠️ Tech Stack
- Next.js 15 (App Router)
- Tailwind CSS
- TypeScript
- @vladmandic/face-api
- Browser Webcam API

## 📂 Setup Instructions
```bash
npm install
# Make sure your /public/models and /public/music folders are correctly placed
npm run dev
