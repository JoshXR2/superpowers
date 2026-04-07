import React, { useState, useEffect } from 'react';

// ─── Color Palette ───────────────────────────────────────────────
const C = {
  bg: '#0A0A0B',
  surface: '#111114',
  border: '#1E1E24',
  red: '#C0392B',
  amber: '#C07A2B',
  neutral: '#8A8A9A',
  white: '#F0F0F5',
  packetRed: '#E74C3C',
  packetAmber: '#D4891A',
};

// ─── Injected Styles ─────────────────────────────────────────────
const styleSheet = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap');

@keyframes pulseWhite {
  0%, 100% { box-shadow: 0 0 0 0 rgba(240,240,245,0.3); }
  50% { box-shadow: 0 0 16px 6px rgba(240,240,245,0.12); }
}

@keyframes pulseRed {
  0%, 100% { box-shadow: 0 0 0 0 rgba(231,76,60,0.4); }
  50% { box-shadow: 0 0 24px 10px rgba(231,76,60,0.18); }
}

@keyframes pulseAmber {
  0%, 100% { box-shadow: 0 0 0 0 rgba(212,137,26,0.4); }
  50% { box-shadow: 0 0 18px 6px rgba(212,137,26,0.2); }
}

@keyframes dotGrid {
  0%, 100% { opacity: 0.03; }
  50% { opacity: 0.06; }
}

@media (max-width: 768px) {
  .iv-canvas {
    flex-direction: column !important;
  }
  .iv-divider {
    display: none !important;
  }
}
`;

// ─── SVG Icons ───────────────────────────────────────────────────
const BuildingIcon = ({ color = C.white, size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect x="6" y="8" width="20" height="20" rx="2" stroke={color} strokeWidth="1.5" fill="none" />
    <rect x="10" y="12" width="4" height="4" rx="0.5" fill={color} opacity="0.5" />
    <rect x="18" y="12" width="4" height="4" rx="0.5" fill={color} opacity="0.5" />
    <rect x="10" y="19" width="4" height="4" rx="0.5" fill={color} opacity="0.5" />
    <rect x="18" y="19" width="4" height="4" rx="0.5" fill={color} opacity="0.5" />
    <rect x="13" y="24" width="6" height="4" rx="0.5" fill={color} opacity="0.7" />
  </svg>
);

const CloudIcon = ({ color = C.packetRed, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <path
      d="M10 28c-3.3 0-6-2.7-6-6 0-2.8 1.9-5.1 4.5-5.8C9.2 12.3 12.8 10 17 10c5 0 9.1 3.6 9.8 8.3C29.6 19 32 21.7 32 25c0 3.3-2.7 6-6 6H10z"
      stroke={color} strokeWidth="1.5" fill="none"
    />
    <text x="17" y="24" textAnchor="middle" fill={color} fontSize="8" fontFamily="IBM Plex Mono">?</text>
  </svg>
);

const GPUIcon = ({ color = C.packetAmber, size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
    <rect x="4" y="8" width="28" height="20" rx="3" stroke={color} strokeWidth="1.5" fill="none" />
    <rect x="8" y="12" width="8" height="6" rx="1" stroke={color} strokeWidth="1" fill="none" opacity="0.6" />
    <rect x="20" y="12" width="8" height="6" rx="1" stroke={color} strokeWidth="1" fill="none" opacity="0.6" />
    <line x1="10" y1="8" x2="10" y2="5" stroke={color} strokeWidth="1" opacity="0.5" />
    <line x1="18" y1="8" x2="18" y2="5" stroke={color} strokeWidth="1" opacity="0.5" />
    <line x1="26" y1="8" x2="26" y2="5" stroke={color} strokeWidth="1" opacity="0.5" />
    <line x1="10" y1="28" x2="10" y2="31" stroke={color} strokeWidth="1" opacity="0.5" />
    <line x1="18" y1="28" x2="18" y2="31" stroke={color} strokeWidth="1" opacity="0.5" />
    <line x1="26" y1="28" x2="26" y2="31" stroke={color} strokeWidth="1" opacity="0.5" />
    <rect x="8" y="21" width="20" height="3" rx="1" stroke={color} strokeWidth="0.8" fill="none" opacity="0.4" />
  </svg>
);

const WarningIcon = ({ color = C.packetRed, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M8 1L15 14H1L8 1z" stroke={color} strokeWidth="1.2" fill="none" />
    <line x1="8" y1="6" x2="8" y2="10" stroke={color} strokeWidth="1.2" />
    <circle cx="8" cy="12" r="0.8" fill={color} />
  </svg>
);

const LockIcon = ({ color = C.packetAmber, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <rect x="3" y="7" width="10" height="8" rx="1.5" stroke={color} strokeWidth="1.2" fill="none" />
    <path d="M5 7V5a3 3 0 016 0v2" stroke={color} strokeWidth="1.2" fill="none" />
    <circle cx="8" cy="11" r="1.2" fill={color} />
  </svg>
);

// ─── Shared SVG Filter Definitions ───────────────────────────────
const SvgFilters = () => (
  <defs>
    <filter id="glowRed" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
      <feFlood floodColor={C.packetRed} floodOpacity="0.5" />
      <feComposite in2="blur" operator="in" result="colorBlur" />
      <feMerge>
        <feMergeNode in="colorBlur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <filter id="glowAmber" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
      <feFlood floodColor={C.packetAmber} floodOpacity="0.45" />
      <feComposite in2="blur" operator="in" result="colorBlur" />
      <feMerge>
        <feMergeNode in="colorBlur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <filter id="glowAmberWide" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
      <feFlood floodColor={C.amber} floodOpacity="0.35" />
      <feComposite in2="blur" operator="in" result="colorBlur" />
      <feMerge>
        <feMergeNode in="colorBlur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
);

// ─── Tooltip Component ───────────────────────────────────────────
const Tooltip = ({ text, children, style = {} }) => {
  const [show, setShow] = useState(false);

  return (
    <div
      style={{ position: 'relative', ...style }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: 8,
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 6,
          padding: '10px 14px',
          width: 240,
          zIndex: 100,
          pointerEvents: 'none',
        }}>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 11,
            color: C.white,
            lineHeight: 1.5,
          }}>{text}</div>
        </div>
      )}
    </div>
  );
};

// ─── Animated Packets (SVG animateMotion) ────────────────────────
const Packets = ({ pathId, color, count = 4, duration = 4 }) => {
  const packets = [];
  for (let i = 0; i < count; i++) {
    const delay = `${(i * duration) / count}s`;
    packets.push(
      <circle key={i} r="4" fill={color} opacity="0" filter={`drop-shadow(0 0 4px ${color})`}>
        <animateMotion
          dur={`${duration}s`}
          repeatCount="indefinite"
          begin={delay}
        >
          <mpath href={`#${pathId}`} />
        </animateMotion>
        <animate
          attributeName="opacity"
          values="0;1;1;0"
          keyTimes="0;0.05;0.9;1"
          dur={`${duration}s`}
          repeatCount="indefinite"
          begin={delay}
        />
      </circle>
    );
  }
  return <>{packets}</>;
};

// ─── Exposure Counter ────────────────────────────────────────────
const ExposureCounter = () => {
  const [count, setCount] = useState(1247);
  useEffect(() => {
    const id = setInterval(() => setCount(c => c + 1), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 28,
        fontWeight: 700,
        color: C.packetRed,
        letterSpacing: 2,
        textShadow: '0 0 12px rgba(231,76,60,0.4)',
      }}>
        {count.toLocaleString()}
      </div>
      <div style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 10,
        color: C.red,
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginTop: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
      }}>
        <WarningIcon size={12} /> Data Points Exposed
      </div>
    </div>
  );
};

// ─── Secure Indicator ────────────────────────────────────────────
const SecureIndicator = () => (
  <div style={{ textAlign: 'center' }}>
    <div style={{
      fontFamily: "'IBM Plex Mono', monospace",
      fontSize: 28,
      fontWeight: 700,
      color: C.packetAmber,
      letterSpacing: 2,
      textShadow: '0 0 12px rgba(212,137,26,0.3)',
    }}>
      0
    </div>
    <div style={{
      fontFamily: "'IBM Plex Mono', monospace",
      fontSize: 10,
      color: C.amber,
      textTransform: 'uppercase',
      letterSpacing: 2,
      marginTop: 4,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
    }}>
      <LockIcon size={12} /> Exposures — Data Contained
    </div>
  </div>
);

// ─── Status Badge ────────────────────────────────────────────────
const StatusBadge = ({ danger, text }) => (
  <div style={{
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 11,
    fontWeight: 600,
    color: danger ? C.packetRed : C.packetAmber,
    background: danger ? 'rgba(231,76,60,0.08)' : 'rgba(212,137,26,0.08)',
    border: `1px solid ${danger ? 'rgba(231,76,60,0.2)' : 'rgba(212,137,26,0.2)'}`,
    borderRadius: 4,
    padding: '6px 14px',
    textAlign: 'center',
    letterSpacing: 0.5,
  }}>
    {text}
  </div>
);

// ─── Overlay Node Positioning Helper ─────────────────────────────
// Converts SVG viewBox coordinates to percentage positions
// ViewBox: 0 0 360 300
const svgPos = (x, y) => ({
  position: 'absolute',
  left: `${(x / 360) * 100}%`,
  top: `${(y / 300) * 100}%`,
  transform: 'translate(-50%, -50%)',
});

// ─── Left Panel (Traditional Cloud) ─────────────────────────────
const LEFT_PATH = 'M180 260 C180 220 130 190 140 160 C150 130 180 100 180 70';

const LeftPanel = () => (
  <div style={{
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '24px 16px',
    position: 'relative',
    minWidth: 0,
  }}>
    {/* Header */}
    <div style={{
      fontFamily: "'IBM Plex Mono', monospace",
      fontSize: 13,
      fontWeight: 600,
      color: C.red,
      textTransform: 'uppercase',
      letterSpacing: 3,
      marginBottom: 24,
    }}>
      Traditional Cloud AI
    </div>

    {/* SVG Canvas with HTML Overlays */}
    <div style={{ position: 'relative', width: '100%', aspectRatio: '6 / 5' }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 360 300"
        preserveAspectRatio="xMidYMid meet"
        style={{ position: 'absolute', inset: 0 }}
      >
        <SvgFilters />
        <defs>
          <path id="leftPath" d={LEFT_PATH} fill="none" />
        </defs>

        {/* Visible data path line */}
        <path
          d={LEFT_PATH}
          stroke={C.border}
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="4 4"
          opacity="0.5"
        />

        {/* Boundary line */}
        <line
          x1="30" y1="160" x2="330" y2="160"
          stroke={C.packetRed}
          strokeWidth="1"
          strokeDasharray="8 4"
          opacity="0.6"
        >
          <animate
            attributeName="opacity"
            values="0.4;1;0.4"
            keyTimes="0;0.375;1"
            dur="4s"
            repeatCount="indefinite"
          />
        </line>

        {/* Boundary label background */}
        <rect x="110" y="148" width="140" height="20" rx="3" fill={C.bg} stroke={C.packetRed} strokeWidth="0.8" opacity="0.9" />
        <text x="180" y="162" textAnchor="middle" fill={C.packetRed} fontSize="9" fontFamily="IBM Plex Mono, monospace" fontWeight="600" letterSpacing="2">
          UNCONTROLLED BOUNDARY
        </text>

        {/* Cloud node SVG glow circle */}
        <circle cx="180" cy="55" r="30" fill={C.packetRed} opacity="0.08" filter="url(#glowRed)">
          <animate
            attributeName="opacity"
            values="0.05;0.18;0.05"
            keyTimes="0;0.625;1"
            dur="4s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Animated packets */}
        <Packets pathId="leftPath" color={C.packetRed} count={4} duration={4} />
      </svg>

      {/* Business Node (HTML overlay) — SVG coord: 180, 260 */}
      <Tooltip
        text="Your internal data originates here and is sent to external cloud infrastructure for AI processing."
        style={svgPos(180, 258)}
      >
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          animation: 'pulseWhite 3s ease infinite',
          borderRadius: 8,
          padding: 6,
        }}>
          <BuildingIcon size={28} />
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 9,
            color: C.neutral,
            marginTop: 2,
            textTransform: 'uppercase',
            letterSpacing: 1,
            whiteSpace: 'nowrap',
          }}>Your Business</div>
        </div>
      </Tooltip>

      {/* Cloud Node (HTML overlay) — SVG coord: 180, 55 */}
      <Tooltip
        text="Your data is stored and processed on infrastructure owned and operated by third parties. You have no visibility or control over who can access it."
        style={svgPos(180, 48)}
      >
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          animation: 'pulseRed 4s ease infinite',
          borderRadius: 8,
          padding: 4,
        }}>
          <CloudIcon size={36} />
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 9,
            color: C.red,
            textTransform: 'uppercase',
            letterSpacing: 1,
            whiteSpace: 'nowrap',
          }}>3rd-Party Cloud</div>
          <div style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 8,
            color: C.neutral,
            marginTop: 1,
          }}>AWS / Azure / GCP</div>
        </div>
      </Tooltip>
    </div>

    {/* Counter + Badge */}
    <div style={{ marginTop: 16, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <ExposureCounter />
      <StatusBadge danger text="Your data leaves. Permanently." />
    </div>
  </div>
);

// ─── Right Panel (CubCloud Sovereign) ───────────────────────────
const RIGHT_PATH_A = 'M180 260 L180 195 C180 170 120 155 120 125';
const RIGHT_PATH_B = 'M180 260 L180 195 C180 170 240 155 240 125';

const RightPanel = () => (
  <div style={{
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '24px 16px',
    position: 'relative',
    minWidth: 0,
  }}>
    {/* Header */}
    <div style={{
      fontFamily: "'IBM Plex Mono', monospace",
      fontSize: 13,
      fontWeight: 600,
      color: C.amber,
      textTransform: 'uppercase',
      letterSpacing: 3,
      marginBottom: 24,
    }}>
      CubCloud Sovereign AI
    </div>

    {/* SVG Canvas with HTML Overlays */}
    <div style={{ position: 'relative', width: '100%', aspectRatio: '6 / 5' }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 360 300"
        preserveAspectRatio="xMidYMid meet"
        style={{ position: 'absolute', inset: 0 }}
      >
        <SvgFilters />
        <defs>
          <path id="rightPathA" d={RIGHT_PATH_A} fill="none" />
          <path id="rightPathB" d={RIGHT_PATH_B} fill="none" />
        </defs>

        {/* Sovereign Perimeter — outer glow rect */}
        <rect
          x="55" y="50" width="250" height="160" rx="6"
          fill="none"
          stroke={C.amber}
          strokeWidth="2"
          filter="url(#glowAmberWide)"
          opacity="0.6"
        >
          <animate
            attributeName="opacity"
            values="0.4;0.8;0.4"
            dur="4s"
            repeatCount="indefinite"
          />
        </rect>
        {/* Sovereign Perimeter — crisp inner border */}
        <rect
          x="55" y="50" width="250" height="160" rx="6"
          fill="none"
          stroke={C.amber}
          strokeWidth="1.5"
          opacity="0.8"
        />

        {/* Perimeter label */}
        <rect x="108" y="42" width="144" height="18" rx="3" fill={C.bg} stroke={C.amber} strokeWidth="0.8" />
        <text x="180" y="54" textAnchor="middle" fill={C.packetAmber} fontSize="9" fontFamily="IBM Plex Mono, monospace" fontWeight="600" letterSpacing="2">
          SOVEREIGN BOUNDARY
        </text>

        {/* Visible data path lines */}
        <path d={RIGHT_PATH_A} stroke={C.border} strokeWidth="1.5" fill="none" strokeDasharray="4 4" opacity="0.5" />
        <path d={RIGHT_PATH_B} stroke={C.border} strokeWidth="1.5" fill="none" strokeDasharray="4 4" opacity="0.5" />

        {/* GPU glow circles */}
        <circle cx="120" cy="120" r="24" fill={C.packetAmber} opacity="0.06" filter="url(#glowAmber)">
          <animate attributeName="opacity" values="0.04;0.15;0.04" keyTimes="0;0.625;1" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle cx="240" cy="120" r="24" fill={C.packetAmber} opacity="0.06" filter="url(#glowAmber)">
          <animate attributeName="opacity" values="0.04;0.15;0.04" keyTimes="0;0.625;1" dur="4s" repeatCount="indefinite" begin="0.5s" />
        </circle>

        {/* Animated packets — branch A (to GPU 1) */}
        <Packets pathId="rightPathA" color={C.packetAmber} count={3} duration={4} />
        {/* Animated packets — branch B (to GPU 2) */}
        <Packets pathId="rightPathB" color={C.packetAmber} count={3} duration={4} />
      </svg>

      {/* Business Node (HTML overlay) — SVG coord: 180, 260 */}
      <Tooltip
        text="Your internal data is sent for AI processing but never leaves CubCloud's sovereign perimeter."
        style={svgPos(180, 258)}
      >
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          animation: 'pulseWhite 3s ease infinite',
          borderRadius: 8,
          padding: 6,
        }}>
          <BuildingIcon size={28} />
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 9,
            color: C.neutral,
            marginTop: 2,
            textTransform: 'uppercase',
            letterSpacing: 1,
            whiteSpace: 'nowrap',
          }}>Your Business</div>
        </div>
      </Tooltip>

      {/* GPU Node 1 (HTML overlay) — SVG coord: 120, 120 */}
      <Tooltip
        text="Processing happens entirely on CubCloud-owned NVIDIA GPU infrastructure located in Missoula, Montana. Your data never leaves your defined perimeter."
        style={svgPos(120, 120)}
      >
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          animation: 'pulseAmber 4s ease infinite',
          borderRadius: 8,
          padding: 4,
        }}>
          <GPUIcon size={30} />
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 8,
            color: C.amber,
            textTransform: 'uppercase',
            letterSpacing: 1,
            whiteSpace: 'nowrap',
          }}>H200 SXM5</div>
        </div>
      </Tooltip>

      {/* GPU Node 2 (HTML overlay) — SVG coord: 240, 120 */}
      <Tooltip
        text="Processing happens entirely on CubCloud-owned NVIDIA GPU infrastructure located in Missoula, Montana. Your data never leaves your defined perimeter."
        style={svgPos(240, 120)}
      >
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          animation: 'pulseAmber 4s ease infinite',
          animationDelay: '1s',
          borderRadius: 8,
          padding: 4,
        }}>
          <GPUIcon size={30} />
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 8,
            color: C.amber,
            textTransform: 'uppercase',
            letterSpacing: 1,
            whiteSpace: 'nowrap',
          }}>H100 SXM5</div>
        </div>
      </Tooltip>
    </div>

    {/* Secure Indicator + Badge */}
    <div style={{ marginTop: 16, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <SecureIndicator />
      <StatusBadge text="Your data stays. Always." />
    </div>
  </div>
);

// ─── Center Divider ──────────────────────────────────────────────
const CenterDivider = () => (
  <div className="iv-divider" style={{
    width: 1,
    background: `linear-gradient(to bottom, transparent, ${C.border}, transparent)`,
    position: 'relative',
    flexShrink: 0,
    margin: '0 4px',
  }}>
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: C.bg,
      border: `1px solid ${C.border}`,
      borderRadius: '50%',
      width: 36,
      height: 36,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'IBM Plex Mono', monospace",
      fontSize: 11,
      fontWeight: 700,
      color: C.neutral,
      letterSpacing: 2,
    }}>
      VS
    </div>
  </div>
);

// ─── Toggle Button Group ─────────────────────────────────────────
const ToggleButton = ({ viewMode, setViewMode }) => {
  const modes = [
    { key: 'compare', label: 'Compare' },
    { key: 'cloud', label: 'Cloud Risk' },
    { key: 'sovereign', label: 'Sovereign' },
  ];
  return (
    <div style={{
      display: 'flex',
      gap: 0,
      border: `1px solid ${C.border}`,
      borderRadius: 6,
      overflow: 'hidden',
    }}>
      {modes.map(m => (
        <button
          key={m.key}
          onClick={() => setViewMode(m.key)}
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 11,
            fontWeight: viewMode === m.key ? 600 : 400,
            color: viewMode === m.key ? C.white : C.neutral,
            background: viewMode === m.key ? C.surface : 'transparent',
            border: 'none',
            padding: '8px 20px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            borderRight: `1px solid ${C.border}`,
            letterSpacing: 0.5,
          }}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
};

// ─── Dot Grid Background ─────────────────────────────────────────
const DotGrid = () => (
  <div style={{
    position: 'absolute',
    inset: 0,
    backgroundImage: `radial-gradient(${C.border} 1px, transparent 1px)`,
    backgroundSize: '24px 24px',
    opacity: 0.4,
    pointerEvents: 'none',
    animation: 'dotGrid 8s ease infinite',
  }} />
);

// ─── Main Component ──────────────────────────────────────────────
const InfrastructureVisualizer = () => {
  const [viewMode, setViewMode] = useState('compare');

  const getLeftStyle = () => {
    if (viewMode === 'cloud') return { flex: 2, opacity: 1, transition: 'all 0.5s ease' };
    if (viewMode === 'sovereign') return { flex: 0.5, opacity: 0.25, transition: 'all 0.5s ease', filter: 'saturate(0.3)' };
    return { flex: 1, opacity: 1, transition: 'all 0.5s ease' };
  };

  const getRightStyle = () => {
    if (viewMode === 'sovereign') return { flex: 2, opacity: 1, transition: 'all 0.5s ease' };
    if (viewMode === 'cloud') return { flex: 0.5, opacity: 0.25, transition: 'all 0.5s ease', filter: 'saturate(0.3)' };
    return { flex: 1, opacity: 1, transition: 'all 0.5s ease' };
  };

  return (
    <div style={{
      background: C.bg,
      minWidth: 320,
      maxWidth: 1200,
      margin: '0 auto',
      fontFamily: "'Inter', sans-serif",
      position: 'relative',
      overflow: 'hidden',
      borderRadius: 12,
      border: `1px solid ${C.border}`,
    }}>
      {/* Inject keyframes */}
      <style>{styleSheet}</style>

      {/* Dot grid */}
      <DotGrid />

      {/* Header */}
      <div style={{
        textAlign: 'center',
        padding: '40px 24px 12px',
        position: 'relative',
        zIndex: 1,
      }}>
        <h2 style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 24,
          fontWeight: 700,
          color: C.white,
          margin: 0,
          letterSpacing: -0.5,
        }}>
          Where Does Your Data Actually Go?
        </h2>
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 14,
          color: C.neutral,
          margin: '10px 0 0',
          lineHeight: 1.5,
        }}>
          See the difference between cloud AI and sovereign AI infrastructure.
        </p>
      </div>

      {/* Visualizer Canvas */}
      <div className="iv-canvas" style={{
        display: 'flex',
        position: 'relative',
        zIndex: 1,
        padding: '0 8px',
        minHeight: 460,
      }}>
        <div style={{ ...getLeftStyle(), minWidth: 0, overflow: 'hidden' }}>
          <LeftPanel />
        </div>
        <CenterDivider />
        <div style={{ ...getRightStyle(), minWidth: 0, overflow: 'hidden' }}>
          <RightPanel />
        </div>
      </div>

      {/* Interaction Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '16px 24px',
        position: 'relative',
        zIndex: 1,
      }}>
        <ToggleButton viewMode={viewMode} setViewMode={setViewMode} />
      </div>

      {/* CTA Footer */}
      <div style={{
        textAlign: 'center',
        padding: '20px 24px 32px',
        position: 'relative',
        zIndex: 1,
        borderTop: `1px solid ${C.border}`,
      }}>
        <a
          href="#"
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 13,
            fontWeight: 500,
            color: C.packetAmber,
            textDecoration: 'none',
            letterSpacing: 0.3,
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={e => e.target.style.color = C.white}
          onMouseLeave={e => e.target.style.color = C.packetAmber}
        >
          Learn how CubCloud keeps your AI on your terms &rarr;
        </a>
      </div>
    </div>
  );
};

export default InfrastructureVisualizer;
