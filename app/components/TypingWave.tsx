'use client';

export default function TypingWave() {
  return (
    <div className="typing-wave">
      <span />
      <span />
      <span />
      <style jsx>{`
        .typing-wave {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .typing-wave span {
          width: 6px;
          height: 6px;
          border-radius: 9999px;
          background: #000; /* adjust if you use dark mode */
          animation: wave 1.2s ease-in-out infinite;
          opacity: 0.2;
          transform: translateY(0);
        }
        .typing-wave span:nth-child(2) { animation-delay: 0.15s; }
        .typing-wave span:nth-child(3) { animation-delay: 0.30s; }

        @keyframes wave {
          0%   { opacity: 0.2; transform: translateY(0); }
          20%  { opacity: 1;   transform: translateY(-2px); }
          40%  { opacity: 0.2; transform: translateY(0); }
          100% { opacity: 0.2; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
