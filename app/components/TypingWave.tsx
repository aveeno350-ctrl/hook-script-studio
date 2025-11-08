'use client';

export default function TypingWave() {
  return (
    <div className="flex items-center gap-1">
      <span className="w-1.5 h-1.5 rounded-full bg-black animate-wave1"></span>
      <span className="w-1.5 h-1.5 rounded-full bg-black animate-wave2"></span>
      <span className="w-1.5 h-1.5 rounded-full bg-black animate-wave3"></span>
    </div>
  );
}
