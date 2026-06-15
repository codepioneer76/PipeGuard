import { PIPELINE_DATA } from '../data/constants.js';

// ─── State ────────────────────────────────────────────────────────────
let animationFrameIds = [];
let isCleanedUp = false;

// ─── SVG Icons (inline) ──────────────────────────────────────────────
const ICONS = {
  pipe: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path d="M4 6h16M4 6v12a2 2 0 002 2h12a2 2 0 002-2V6M4 6l-2-2m18 2l2-2"/><line x1="8" y1="10" x2="8" y2="16"/><line x1="12" y1="10" x2="12" y2="16"/><line x1="16" y1="10" x2="16" y2="16"/></svg>`,
  clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  wave: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><polyline points="2 12 5 8 8 14 11 6 14 16 17 10 20 13 22 12"/></svg>`,
  target: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
  mapPin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>`,
  alertTriangle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  radio: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path d="M16.72 11.06A10.94 10.94 0 0119 12.55"/><path d="M5 12.55a10.94 10.94 0 012.28-1.49"/><path d="M10.71 5.05A16 16 0 000 12.55"/><path d="M24 12.55A16 16 0 0013.29 5.05"/><circle cx="12" cy="20" r="2"/><path d="M12 18v-6"/></svg>`,
  crosshair: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/></svg>`,
  pipelineBar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><rect x="1" y="8" width="22" height="8" rx="2"/><line x1="6" y1="8" x2="6" y2="16"/><line x1="18" y1="8" x2="18" y2="16"/></svg>`,
};

// ─── Animated Counter ────────────────────────────────────────────────
function animateCounter(element, endValue, duration = 1500, isDecimal = false, suffix = '', prefix = '') {
  if (isCleanedUp) return;
  const startTime = performance.now();

  function update(currentTime) {
    if (isCleanedUp) return;
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const currentValue = eased * endValue;

    let display;
    if (isDecimal) {
      display = currentValue.toFixed(4);
    } else if (endValue >= 1000) {
      display = Math.round(currentValue).toLocaleString('en-US');
    } else if (suffix === '%') {
      display = currentValue.toFixed(2);
    } else {
      display = Math.round(currentValue).toString();
    }

    element.textContent = prefix + display + suffix;

    if (progress < 1) {
      const id = requestAnimationFrame(update);
      animationFrameIds.push(id);
    }
  }

  const id = requestAnimationFrame(update);
  animationFrameIds.push(id);
}

// ─── KPI Card Builder ────────────────────────────────────────────────
function buildKpiCard(config, index) {
  const {
    icon, value, label, accent, textColor,
    showProgress, progressValue,
    showPulse, pulseColor,
    showBadge, badgeText,
    isAlert, countUp
  } = config;

  const accentColors = {
    blue: { bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.18)', glow: '#3b82f6', iconBg: 'rgba(59,130,246,0.15)' },
    teal: { bg: 'rgba(0,191,166,0.08)', border: 'rgba(0,191,166,0.18)', glow: '#00bfa6', iconBg: 'rgba(0,191,166,0.15)' },
    cyan: { bg: 'rgba(0,212,255,0.08)', border: 'rgba(0,212,255,0.18)', glow: '#00d4ff', iconBg: 'rgba(0,212,255,0.15)' },
    orange: { bg: 'rgba(255,159,67,0.08)', border: 'rgba(255,159,67,0.18)', glow: '#ff9f43', iconBg: 'rgba(255,159,67,0.15)' },
    red: { bg: 'rgba(255,61,90,0.06)', border: 'rgba(255,61,90,0.25)', glow: '#ff3d5a', iconBg: 'rgba(255,61,90,0.15)' },
    green: { bg: 'rgba(0,230,118,0.08)', border: 'rgba(0,230,118,0.18)', glow: '#00e676', iconBg: 'rgba(0,230,118,0.15)' },
  };

  const colors = accentColors[accent] || accentColors.cyan;
  const delay = index * 80;

  const alertBorderStyle = isAlert
    ? `box-shadow: 0 0 20px rgba(255,61,90,0.12), inset 0 0 20px rgba(255,61,90,0.03); border-color: rgba(255,61,90,0.3);`
    : '';

  const pulseIndicator = showPulse
    ? `<span class="inline-flex items-center gap-1.5 ml-2">
         <span class="animate-pulse-glow relative flex h-2.5 w-2.5">
           <span class="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping" style="background:${pulseColor}"></span>
           <span class="relative inline-flex rounded-full h-2.5 w-2.5" style="background:${pulseColor}"></span>
         </span>
       </span>`
    : '';

  const badge = showBadge
    ? `<span class="ml-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider" style="background:rgba(0,230,118,0.15);color:#00e676;border:1px solid rgba(0,230,118,0.3);">${badgeText}</span>`
    : '';

  const progressBar = showProgress
    ? `<div class="w-full mt-2 h-1.5 rounded-full overflow-hidden" style="background:rgba(0,212,255,0.1);">
         <div class="h-full rounded-full transition-all duration-1000 progress-fill" style="width:0%;background:linear-gradient(90deg,#00bfa6,#00d4ff);" data-target-width="${progressValue}%"></div>
       </div>`
    : '';

  const valueStyle = textColor ? `color:${textColor};` : 'color:#e8eaf6;';

  return `
    <div class="kpi-card group relative overflow-hidden rounded-xl p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg opacity-0"
         style="background:${colors.bg};border:1px solid ${colors.border};animation:fadeInUp 0.5s ease-out ${delay}ms forwards;${alertBorderStyle}">
      <!-- Accent glow -->
      <div class="absolute -top-12 -right-12 w-28 h-28 rounded-full opacity-20 blur-2xl transition-opacity duration-300 group-hover:opacity-40"
           style="background:${colors.glow}"></div>
      <!-- Icon -->
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center justify-center w-10 h-10 rounded-lg" style="background:${colors.iconBg};color:${colors.glow};">
          ${icon}
        </div>
        ${badge}
      </div>
      <!-- Value -->
      <div class="flex items-center">
        <span class="text-2xl font-bold tracking-tight leading-none kpi-value" style="${valueStyle}" data-countup='${JSON.stringify(countUp || null)}'>
          ${countUp ? '0' : value}
        </span>
        ${pulseIndicator}
      </div>
      <!-- Label -->
      <p class="mt-1.5 text-xs tracking-wide" style="color:#8892b0;">${label}</p>
      ${progressBar}
    </div>
  `;
}

// ─── Leak Localization Summary ───────────────────────────────────────
function buildLeakSummary() {
  return `
    <div class="mt-6 rounded-xl p-6 relative overflow-hidden opacity-0"
         style="background:#131a2e;border:1px solid #1e2a45;animation:fadeInUp 0.6s ease-out 700ms forwards;">
      <!-- Decorative glow -->
      <div class="absolute -top-20 -left-20 w-60 h-60 rounded-full opacity-10 blur-3xl" style="background:#00d4ff;"></div>
      <div class="absolute -bottom-20 -right-20 w-60 h-60 rounded-full opacity-10 blur-3xl" style="background:#00bfa6;"></div>

      <!-- Header -->
      <div class="flex items-center gap-3 mb-5">
        <div class="flex items-center justify-center w-10 h-10 rounded-lg" style="background:rgba(0,212,255,0.12);color:#00d4ff;">
          ${ICONS.crosshair}
        </div>
        <div>
          <h3 class="text-base font-semibold" style="color:#e8eaf6;">Leak Localization Summary</h3>
          <p class="text-[11px] tracking-wide" style="color:#8892b0;">Diagnostic analysis report</p>
        </div>
      </div>

      <!-- Two columns -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Left: Interpretation -->
        <div class="space-y-3">
          <div class="flex items-start gap-2.5">
            <span class="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full" style="background:#00d4ff;"></span>
            <p class="text-sm leading-relaxed" style="color:#b0b8d0;">Leak localized using <span class="font-medium" style="color:#00d4ff;">time-delay cross-correlation</span> methodology.</p>
          </div>
          <div class="flex items-start gap-2.5">
            <span class="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full" style="background:#00bfa6;"></span>
            <p class="text-sm leading-relaxed" style="color:#b0b8d0;">A strong correlation coefficient of <span class="font-medium" style="color:#00bfa6;">0.8688</span> indicates high confidence in the detected time delay.</p>
          </div>
          <div class="flex items-start gap-2.5">
            <span class="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full" style="background:#00d4ff;"></span>
            <p class="text-sm leading-relaxed" style="color:#b0b8d0;">Dominant frequency band detected at <span class="font-medium" style="color:#00d4ff;">500–510 Hz</span> confirms acoustic leak signature.</p>
          </div>
          <div class="flex items-start gap-2.5">
            <span class="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full" style="background:#00bfa6;"></span>
            <p class="text-sm leading-relaxed" style="color:#b0b8d0;">Cross-correlation analysis yields a time delay of <span class="font-medium" style="color:#00bfa6;">0.0668 seconds</span> between Logger 3 and Logger 4 signals.</p>
          </div>
        </div>

        <!-- Right: Key metrics -->
        <div class="rounded-lg p-4" style="background:rgba(10,14,26,0.6);border:1px solid #1e2a45;">
          <h4 class="text-xs font-semibold uppercase tracking-widest mb-3" style="color:#8892b0;">Key Parameters</h4>
          <div class="space-y-2.5">
            ${buildMetricRow('Correlation Method', 'Cross-Correlation', '#00d4ff')}
            ${buildMetricRow('Frequency Band', '500 – 510 Hz', '#00bfa6')}
            ${buildMetricRow('Confidence Level', 'High (86.88%)', '#00e676')}
            ${buildMetricRow('Detection Time', '0.0668 s', '#00d4ff')}
            ${buildMetricRow('Localization Accuracy', '±0.5 m', '#ff9f43')}
          </div>
        </div>
      </div>
    </div>
  `;
}

function buildMetricRow(label, value, color) {
  return `
    <div class="flex items-center justify-between py-1.5 border-b" style="border-color:rgba(30,42,69,0.7);">
      <span class="text-xs" style="color:#8892b0;">${label}</span>
      <span class="text-xs font-semibold" style="color:${color};">${value}</span>
    </div>
  `;
}

// ─── Mini Pipeline Diagram ───────────────────────────────────────────
function buildPipelineDiagram() {
  const leakPositionPercent = 41.4474;
  return `
    <div class="mt-6 rounded-xl p-6 relative overflow-hidden opacity-0"
         style="background:#131a2e;border:1px solid #1e2a45;animation:fadeInUp 0.6s ease-out 900ms forwards;">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <div class="flex items-center justify-center w-10 h-10 rounded-lg" style="background:rgba(0,212,255,0.12);color:#00d4ff;">
            ${ICONS.pipelineBar}
          </div>
          <div>
            <h3 class="text-base font-semibold" style="color:#e8eaf6;">Pipeline Overview</h3>
            <p class="text-[11px] tracking-wide" style="color:#8892b0;">500m pipeline schematic</p>
          </div>
        </div>
        <a href="#/visualization" class="flex items-center gap-1 text-xs font-medium transition-colors duration-200 hover:underline" style="color:#00d4ff;">
          View Full Visualization
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </a>
      </div>

      <!-- Pipeline bar -->
      <div class="relative px-4">
        <!-- AP Labels -->
        <div class="flex justify-between mb-2">
          <div class="text-center">
            <div class="text-[10px] font-bold uppercase tracking-widest" style="color:#00e676;">AP1</div>
            <div class="text-[10px]" style="color:#8892b0;">Logger 3</div>
          </div>
          <div class="text-center">
            <div class="text-[10px] font-bold uppercase tracking-widest" style="color:#00e676;">AP2</div>
            <div class="text-[10px]" style="color:#8892b0;">Logger 4</div>
          </div>
        </div>

        <!-- Main pipe -->
        <div class="relative w-full h-6 rounded-full overflow-visible" style="background:linear-gradient(90deg, rgba(0,230,118,0.25) 0%, rgba(0,230,118,0.18) ${leakPositionPercent - 2}%, rgba(255,61,90,0.3) ${leakPositionPercent}%, rgba(0,230,118,0.18) ${leakPositionPercent + 2}%, rgba(0,230,118,0.25) 100%);border:1px solid rgba(0,230,118,0.2);">
          <!-- Healthy fill left -->
          <div class="absolute inset-y-0 left-0 rounded-l-full" style="width:${leakPositionPercent - 1}%;background:linear-gradient(90deg,rgba(0,230,118,0.35),rgba(0,230,118,0.2));"></div>
          <!-- Healthy fill right -->
          <div class="absolute inset-y-0 right-0 rounded-r-full" style="width:${100 - leakPositionPercent - 1}%;background:linear-gradient(90deg,rgba(0,230,118,0.2),rgba(0,230,118,0.35));"></div>

          <!-- Leak marker -->
          <div class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10" style="left:${leakPositionPercent}%;">
            <div class="relative">
              <!-- Pulse ring -->
              <div class="absolute -inset-2 rounded-full animate-ping opacity-40" style="background:rgba(255,61,90,0.4);"></div>
              <!-- Marker dot -->
              <div class="w-4 h-4 rounded-full border-2" style="background:#ff3d5a;border-color:#ff3d5a;box-shadow:0 0 12px rgba(255,61,90,0.6);"></div>
            </div>
          </div>

          <!-- AP1 endpoint -->
          <div class="absolute top-1/2 -translate-y-1/2 left-0 w-3 h-3 rounded-full border-2" style="background:#0a0e1a;border-color:#00e676;"></div>
          <!-- AP2 endpoint -->
          <div class="absolute top-1/2 -translate-y-1/2 right-0 w-3 h-3 rounded-full border-2" style="background:#0a0e1a;border-color:#00e676;"></div>
        </div>

        <!-- Leak label -->
        <div class="absolute z-20" style="left:${leakPositionPercent}%;top:100%;transform:translateX(-50%);">
          <div class="mt-2 flex flex-col items-center">
            <div class="w-px h-3" style="background:rgba(255,61,90,0.4);"></div>
            <div class="px-2 py-1 rounded text-[10px] font-bold whitespace-nowrap" style="background:rgba(255,61,90,0.15);color:#ff3d5a;border:1px solid rgba(255,61,90,0.3);">
              Leak @ 207.24 m
            </div>
          </div>
        </div>

        <!-- Distance labels -->
        <div class="flex justify-between mt-10">
          <div class="flex flex-col items-start">
            <span class="text-[10px] font-medium" style="color:#ff9f43;">d₁ = 207.24 m</span>
            <span class="text-[9px]" style="color:#8892b0;">from AP1</span>
          </div>
          <div class="text-center">
            <span class="text-[10px] font-medium" style="color:#8892b0;">Total Length: 500 m</span>
          </div>
          <div class="flex flex-col items-end">
            <span class="text-[10px] font-medium" style="color:#ff9f43;">d₂ = 292.76 m</span>
            <span class="text-[9px]" style="color:#8892b0;">from AP2</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ─── CSS Keyframes (injected once) ───────────────────────────────────
function injectStyles() {
  if (document.getElementById('dashboard-styles')) return;
  const style = document.createElement('style');
  style.id = 'dashboard-styles';
  style.textContent = `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(16px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes pulseGlow {
      0%, 100% {
        box-shadow: 0 0 4px 1px currentColor;
        opacity: 1;
      }
      50% {
        box-shadow: 0 0 12px 4px currentColor;
        opacity: 0.7;
      }
    }

    .animate-pulse-glow > span:first-child {
      animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
    }

    @keyframes ping {
      75%, 100% {
        transform: scale(2);
        opacity: 0;
      }
    }

    .kpi-card {
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    }

    .kpi-card:hover {
      border-color: rgba(0, 212, 255, 0.3) !important;
    }
  `;
  document.head.appendChild(style);
}

// ─── Render Dashboard ────────────────────────────────────────────────
export function renderDashboard(container) {
  isCleanedUp = false;
  animationFrameIds = [];
  injectStyles();

  // KPI card configurations
  const kpiCards = [
    {
      icon: ICONS.pipe,
      value: '500 m',
      label: 'Pipeline Length',
      accent: 'blue',
      countUp: { end: 500, suffix: ' m', decimals: false },
    },
    {
      icon: ICONS.clock,
      value: '0.0668 s',
      label: 'Time Delay (t<sub>d</sub>)',
      accent: 'teal',
      countUp: { end: 0.0668, suffix: ' s', decimals: true },
    },
    {
      icon: ICONS.wave,
      value: '1,280 m/s',
      label: 'Wave Velocity (c)',
      accent: 'cyan',
      countUp: { end: 1280, suffix: ' m/s', decimals: false },
    },
    {
      icon: ICONS.target,
      value: '86.88%',
      label: 'Correlation Confidence',
      accent: 'cyan',
      showProgress: true,
      progressValue: 86.88,
      countUp: { end: 86.88, suffix: '%', decimals: false, isPercent: true },
    },
    {
      icon: ICONS.mapPin,
      value: '207.24 m',
      label: 'Distance from AP1 (d₁)',
      accent: 'orange',
      countUp: { end: 207.24, suffix: ' m', decimals: false, twoDecimal: true },
    },
    {
      icon: ICONS.mapPin,
      value: '292.76 m',
      label: 'Distance from AP2 (d₂)',
      accent: 'orange',
      countUp: { end: 292.76, suffix: ' m', decimals: false, twoDecimal: true },
    },
    {
      icon: ICONS.alertTriangle,
      value: 'LEAK DETECTED',
      label: 'System Alert Status',
      accent: 'red',
      textColor: '#ff3d5a',
      showPulse: true,
      pulseColor: '#ff3d5a',
      isAlert: true,
    },
    {
      icon: ICONS.radio,
      value: 'Active',
      label: 'Monitoring State',
      accent: 'green',
      textColor: '#00e676',
      showPulse: true,
      pulseColor: '#00e676',
      showBadge: true,
      badgeText: 'Live',
    },
  ];

  container.innerHTML = `
    <div class="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-1.5 text-[11px] mb-4 opacity-0" style="color:#8892b0;animation:fadeInUp 0.4s ease-out 50ms forwards;">
        <span style="color:#00d4ff;">Dashboard</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-3 h-3 opacity-50"><polyline points="9 18 15 12 9 6"/></svg>
        <span>Overview</span>
      </nav>

      <!-- Page Header -->
      <div class="mb-8 opacity-0" style="animation:fadeInUp 0.5s ease-out 100ms forwards;">
        <h1 class="text-2xl lg:text-3xl font-bold tracking-tight" style="color:#e8eaf6;">Dashboard Overview</h1>
        <p class="mt-1 text-sm" style="color:#8892b0;">Real-time pipeline integrity monitoring and leak detection status</p>
      </div>

      <!-- KPI Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        ${kpiCards.map((card, i) => buildKpiCard(card, i)).join('')}
      </div>

      <!-- Leak Localization Summary -->
      ${buildLeakSummary()}

      <!-- Mini Pipeline Diagram -->
      ${buildPipelineDiagram()}
    </div>
  `;

  // ─── Post-render: Animate counters ────────────────────────────────
  requestAnimationFrame(() => {
    if (isCleanedUp) return;

    const kpiValues = container.querySelectorAll('.kpi-value[data-countup]');
    kpiValues.forEach((el) => {
      const config = JSON.parse(el.getAttribute('data-countup'));
      if (!config) return;

      const { end, suffix = '', decimals = false, isPercent = false, twoDecimal = false } = config;

      if (decimals) {
        // Animate decimal values (like 0.0668)
        animateDecimalCounter(el, end, 1500, suffix);
      } else if (isPercent) {
        animatePercentCounter(el, end, 1500, suffix);
      } else if (twoDecimal) {
        animateTwoDecimalCounter(el, end, 1500, suffix);
      } else {
        animateCounter(el, end, 1500, false, suffix);
      }
    });

    // Animate progress bars
    const progressBars = container.querySelectorAll('.progress-fill');
    progressBars.forEach((bar) => {
      const targetWidth = bar.getAttribute('data-target-width');
      setTimeout(() => {
        if (!isCleanedUp) {
          bar.style.width = targetWidth;
        }
      }, 600);
    });
  });
}

// ─── Specialized Counter Animators ───────────────────────────────────
function animateDecimalCounter(element, endValue, duration, suffix) {
  if (isCleanedUp) return;
  const startTime = performance.now();

  function update(currentTime) {
    if (isCleanedUp) return;
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const currentValue = eased * endValue;
    element.textContent = currentValue.toFixed(4) + suffix;

    if (progress < 1) {
      const id = requestAnimationFrame(update);
      animationFrameIds.push(id);
    }
  }

  const id = requestAnimationFrame(update);
  animationFrameIds.push(id);
}

function animatePercentCounter(element, endValue, duration, suffix) {
  if (isCleanedUp) return;
  const startTime = performance.now();

  function update(currentTime) {
    if (isCleanedUp) return;
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const currentValue = eased * endValue;
    element.textContent = currentValue.toFixed(2) + suffix;

    if (progress < 1) {
      const id = requestAnimationFrame(update);
      animationFrameIds.push(id);
    }
  }

  const id = requestAnimationFrame(update);
  animationFrameIds.push(id);
}

function animateTwoDecimalCounter(element, endValue, duration, suffix) {
  if (isCleanedUp) return;
  const startTime = performance.now();

  function update(currentTime) {
    if (isCleanedUp) return;
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const currentValue = eased * endValue;
    element.textContent = currentValue.toFixed(2) + suffix;

    if (progress < 1) {
      const id = requestAnimationFrame(update);
      animationFrameIds.push(id);
    }
  }

  const id = requestAnimationFrame(update);
  animationFrameIds.push(id);
}

// ─── Cleanup ─────────────────────────────────────────────────────────
export function cleanupDashboard() {
  isCleanedUp = true;
  animationFrameIds.forEach((id) => cancelAnimationFrame(id));
  animationFrameIds = [];
}
