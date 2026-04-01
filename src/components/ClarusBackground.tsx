"use client";

export default function ClarusBackground() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <svg
        className="w-full h-full object-cover opacity-90"
        viewBox="0 0 1280 960"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="cn-centerGlow" cx="30%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#0f172a" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#030712" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="cn-lineFade" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.8" />
            <stop offset="30%" stopColor="#3b82f6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#030712" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="cn-arcGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.2" />
            <stop offset="20%" stopColor="#60a5fa" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#2563eb" stopOpacity="1" />
            <stop offset="80%" stopColor="#60a5fa" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.2" />
          </linearGradient>

          <filter id="cn-glow-heavy" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="12" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="cn-glow-light" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Radial glow background */}
        <rect width="100%" height="100%" fill="url(#cn-centerGlow)" />

        {/* Vertical separator line */}
        <line x1="384" y1="0" x2="384" y2="960" stroke="#ffffff" strokeWidth="1" opacity="0.15" />
        <line x1="384" y1="0" x2="384" y2="960" stroke="#60a5fa" strokeWidth="2" opacity="0.1" filter="url(#cn-glow-heavy)" />

        {/* Pulsing arc + rays group */}
        <g className="cn-animate-glow" transform="translate(0, 0)">
          <path d="M 384 480 Q 420 400 480 340" stroke="#cbd5e1" fill="none" strokeWidth="0.5" opacity="0.4" />
          <path d="M 384 480 Q 440 460 495 400" stroke="#cbd5e1" fill="none" strokeWidth="0.5" opacity="0.5" />
          <path d="M 384 480 Q 450 500 495 560" stroke="#cbd5e1" fill="none" strokeWidth="0.5" opacity="0.5" />
          <path d="M 384 480 Q 420 560 480 620" stroke="#cbd5e1" fill="none" strokeWidth="0.5" opacity="0.4" />
          <path d="M 384 380 Q 430 430 490 440" stroke="#cbd5e1" fill="none" strokeWidth="0.3" opacity="0.3" />
          <path d="M 384 580 Q 430 530 490 520" stroke="#cbd5e1" fill="none" strokeWidth="0.3" opacity="0.3" />

          {/* Arc */}
          <path d="M 384 300 A 180 180 0 0 1 384 660" stroke="url(#cn-arcGrad)" strokeWidth="6" fill="none" filter="url(#cn-glow-heavy)" />
          <path d="M 384 300 A 180 180 0 0 1 384 660" stroke="#bfdbfe" strokeWidth="2" fill="none" opacity="0.8" />
        </g>

        {/* Floating network lines group */}
        <g className="cn-animate-float">
          {/* Upper rays */}
          <path d="M 500 350 C 650 300, 750 150, 1100 100" stroke="url(#cn-lineFade)" strokeWidth="1.5" fill="none" opacity="0.7" filter="url(#cn-glow-light)" />
          <path d="M 540 380 C 700 360, 800 250, 1200 200" stroke="url(#cn-lineFade)" strokeWidth="1" fill="none" opacity="0.5" />
          <path d="M 560 410 C 750 400, 900 300, 1250 280" stroke="url(#cn-lineFade)" strokeWidth="2" fill="none" opacity="0.6" filter="url(#cn-glow-light)" />

          {/* Center rays */}
          <path d="M 564 480 C 800 480, 950 420, 1280 400" stroke="url(#cn-lineFade)" strokeWidth="2.5" fill="none" opacity="0.8" filter="url(#cn-glow-heavy)" />
          <path d="M 564 480 C 750 500, 900 550, 1280 520" stroke="url(#cn-lineFade)" strokeWidth="1.5" fill="none" opacity="0.6" filter="url(#cn-glow-light)" />
          <path d="M 560 520 C 700 540, 800 650, 1150 600" stroke="url(#cn-lineFade)" strokeWidth="1" fill="none" opacity="0.4" />

          {/* Lower rays */}
          <path d="M 540 560 C 650 600, 750 750, 1100 850" stroke="url(#cn-lineFade)" strokeWidth="2" fill="none" opacity="0.7" filter="url(#cn-glow-light)" />
          <path d="M 500 600 C 600 650, 650 800, 1000 950" stroke="url(#cn-lineFade)" strokeWidth="1.5" fill="none" opacity="0.5" />

          {/* Network connector curves */}
          <path d="M 750 250 Q 850 200 900 280" stroke="url(#cn-lineFade)" strokeWidth="0.5" fill="none" opacity="0.3" />
          <path d="M 900 300 Q 1000 280 1050 350" stroke="url(#cn-lineFade)" strokeWidth="0.5" fill="none" opacity="0.3" />
          <path d="M 700 600 Q 800 650 850 580" stroke="url(#cn-lineFade)" strokeWidth="0.5" fill="none" opacity="0.3" />
          <path d="M 850 700 Q 950 750 1000 680" stroke="url(#cn-lineFade)" strokeWidth="0.5" fill="none" opacity="0.3" />

          {/* Node dots */}
          <circle cx="800" cy="250" r="1.5" fill="#93c5fd" opacity="0.6" filter="url(#cn-glow-light)" />
          <circle cx="950" cy="400" r="2" fill="#60a5fa" opacity="0.8" filter="url(#cn-glow-heavy)" />
          <circle cx="850" cy="650" r="1.5" fill="#93c5fd" opacity="0.5" />
          <circle cx="1100" cy="550" r="1" fill="#fff" opacity="0.4" />
        </g>

        {/* Ambient light beams */}
        <path d="M 0 200 Q 200 400 384 480" stroke="#ffffff" strokeWidth="40" fill="none" opacity="0.02" filter="url(#cn-glow-heavy)" />
        <path d="M 0 800 Q 200 600 384 480" stroke="#ffffff" strokeWidth="60" fill="none" opacity="0.01" filter="url(#cn-glow-heavy)" />
      </svg>
    </div>
  );
}
