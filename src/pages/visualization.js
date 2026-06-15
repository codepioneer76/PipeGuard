import { PIPELINE_DATA } from '../data/constants.js';

// Store intervals/timeouts for cleanup
let _animationIntervals = [];
let _animationTimeouts = [];

export function renderVisualization(container) {
  // Pipeline parameters
  const pipelineLength = 500; // meters
  const leakPosition = 207.2368; // meters from AP1
  const reversePosition = 292.7632; // meters from AP2
  const leakPercent = (leakPosition / pipelineLength) * 100; // 41.4474%
  const confidence = 86.88;
  const timeDelay = 0.0668;
  const waveVelocity = 1280;

  // SVG coordinates
  const svgWidth = 1200;
  const svgHeight = 340;
  const pipeStartX = 100;
  const pipeEndX = 1100;
  const pipeSpan = pipeEndX - pipeStartX;
  const pipeY = 120;
  const pipeHeight = 40;
  const leakX = pipeStartX + (pipeSpan * leakPosition / pipelineLength); // ~514.47

  // Measurement scale
  const scaleY = pipeY + pipeHeight + 90;
  const scaleTicks = [];
  for (let m = 0; m <= pipelineLength; m += 25) {
    const x = pipeStartX + (pipeSpan * m / pipelineLength);
    const isMajor = m % 50 === 0;
    scaleTicks.push(`
      <line x1="${x}" y1="${scaleY}" x2="${x}" y2="${scaleY + (isMajor ? 10 : 6)}" 
            stroke="#8892b0" stroke-width="${isMajor ? 1.5 : 0.8}" />
      ${isMajor ? `<text x="${x}" y="${scaleY + 24}" text-anchor="middle" 
                         fill="#8892b0" font-size="10" font-family="Inter, sans-serif">${m}m</text>` : ''}
    `);
  }

  // Flow chevrons — create groups that will be animated via CSS
  const chevronCount = 12;
  const chevronSpacing = pipeSpan / chevronCount;
  const chevrons = [];
  for (let i = 0; i < chevronCount; i++) {
    const cx = pipeStartX + (i * chevronSpacing) + chevronSpacing / 2;
    chevrons.push(`
      <g class="flow-chevron" style="animation-delay: ${i * 0.15}s">
        <text x="${cx}" y="${pipeY + pipeHeight / 2 + 4}" text-anchor="middle"
              fill="rgba(255,255,255,0.12)" font-size="14" font-family="Inter, sans-serif"
              font-weight="700">›››</text>
      </g>
    `);
  }

  // Distance labels along pipeline
  const leftMidX = pipeStartX + (leakX - pipeStartX) / 2;
  const rightMidX = leakX + (pipeEndX - leakX) / 2;

  container.innerHTML = `
    <div class="animate-fade-in-up" style="padding: 24px 32px 48px;">
      
      <!-- Page Header -->
      <div style="margin-bottom: 32px;">
        <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 8px; flex-wrap: wrap;">
          <h1 style="font-family: 'Inter', sans-serif; font-size: 28px; font-weight: 700; color: #e8eaf6; margin: 0; letter-spacing: -0.5px;">
            Pipeline Leak Visualization
          </h1>
          <span class="animate-pulse-glow" style="
            display: inline-flex; align-items: center; gap: 6px;
            background: rgba(255, 61, 90, 0.15); border: 1px solid rgba(255, 61, 90, 0.4);
            color: #ff3d5a; font-size: 12px; font-weight: 700; padding: 4px 14px;
            border-radius: 20px; text-transform: uppercase; letter-spacing: 1.2px;
            font-family: 'Inter', sans-serif;
          ">
            <span style="width: 8px; height: 8px; background: #ff3d5a; border-radius: 50%; display: inline-block;"></span>
            Leak Detected
          </span>
        </div>
        <p style="font-family: 'Inter', sans-serif; font-size: 14px; color: #8892b0; margin: 0; letter-spacing: 0.2px;">
          Precise leak localization using cross-correlation analysis
        </p>
      </div>

      <!-- Main Pipeline SVG Diagram -->
      <div style="
        background: #131a2e; border: 1px solid #1e2a45; border-radius: 16px;
        padding: 40px 24px 32px; margin-bottom: 24px;
        box-shadow: 0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03);
      ">
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 24px; padding-left: 8px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span style="font-family: 'Inter', sans-serif; font-size: 15px; font-weight: 600; color: #e8eaf6;">
            Pipeline Cross-Section — Leak Localization Diagram
          </span>
        </div>
        
        <svg viewBox="0 0 ${svgWidth} ${svgHeight}" preserveAspectRatio="xMidYMid meet"
             style="width: 100%; height: auto; display: block; overflow: visible;"
             xmlns="http://www.w3.org/2000/svg">
          
          <defs>
            <!-- Pipeline metallic gradient -->
            <linearGradient id="pipeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#6b7a8d"/>
              <stop offset="25%" stop-color="#5a6878"/>
              <stop offset="50%" stop-color="#4a5568"/>
              <stop offset="75%" stop-color="#3d4a5c"/>
              <stop offset="100%" stop-color="#2d3748"/>
            </linearGradient>

            <!-- Pipeline left section: green to yellow -->
            <linearGradient id="pipeLeftOverlay" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#00e676" stop-opacity="0.25"/>
              <stop offset="85%" stop-color="#ff9f43" stop-opacity="0.3"/>
              <stop offset="100%" stop-color="#ff3d5a" stop-opacity="0.5"/>
            </linearGradient>

            <!-- Pipeline right section: red to yellow to green -->
            <linearGradient id="pipeRightOverlay" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#ff3d5a" stop-opacity="0.5"/>
              <stop offset="15%" stop-color="#ff9f43" stop-opacity="0.3"/>
              <stop offset="100%" stop-color="#00e676" stop-opacity="0.25"/>
            </linearGradient>

            <!-- Leak glow radial gradient -->
            <radialGradient id="leakGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#ff3d5a" stop-opacity="0.6"/>
              <stop offset="50%" stop-color="#ff3d5a" stop-opacity="0.2"/>
              <stop offset="100%" stop-color="#ff3d5a" stop-opacity="0"/>
            </radialGradient>

            <!-- AP glow -->
            <radialGradient id="apGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#00d4ff" stop-opacity="0.4"/>
              <stop offset="100%" stop-color="#00d4ff" stop-opacity="0"/>
            </radialGradient>

            <!-- Pipeline highlight (3D top shine) -->
            <linearGradient id="pipeShine" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="rgba(255,255,255,0.15)"/>
              <stop offset="30%" stop-color="rgba(255,255,255,0)"/>
            </linearGradient>

            <!-- Clip paths for left/right pipeline sections -->
            <clipPath id="clipLeft">
              <rect x="${pipeStartX}" y="${pipeY - 5}" width="${leakX - pipeStartX}" height="${pipeHeight + 10}"/>
            </clipPath>
            <clipPath id="clipRight">
              <rect x="${leakX}" y="${pipeY - 5}" width="${pipeEndX - leakX}" height="${pipeHeight + 10}"/>
            </clipPath>

            <!-- Drop filter -->
            <filter id="dropShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#ff3d5a" flood-opacity="0.4"/>
            </filter>

            <!-- Glow filter for leak -->
            <filter id="leakFilter" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            <!-- Soft glow for access points -->
            <filter id="apFilter" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          <!-- ===== PIPELINE BODY ===== -->
          <!-- Shadow -->
          <rect x="${pipeStartX}" y="${pipeY + 3}" width="${pipeSpan}" height="${pipeHeight}"
                rx="20" ry="20" fill="rgba(0,0,0,0.3)" filter="url(#dropShadow)"/>

          <!-- Base pipeline with metallic gradient -->
          <rect x="${pipeStartX}" y="${pipeY}" width="${pipeSpan}" height="${pipeHeight}"
                rx="20" ry="20" fill="url(#pipeGradient)" stroke="#2d3748" stroke-width="1.5"/>

          <!-- Left color overlay -->
          <rect x="${pipeStartX}" y="${pipeY}" width="${pipeSpan}" height="${pipeHeight}"
                rx="20" ry="20" fill="url(#pipeLeftOverlay)" clip-path="url(#clipLeft)"/>

          <!-- Right color overlay -->
          <rect x="${pipeStartX}" y="${pipeY}" width="${pipeSpan}" height="${pipeHeight}"
                rx="20" ry="20" fill="url(#pipeRightOverlay)" clip-path="url(#clipRight)"/>

          <!-- 3D shine on top -->
          <rect x="${pipeStartX}" y="${pipeY}" width="${pipeSpan}" height="${pipeHeight}"
                rx="20" ry="20" fill="url(#pipeShine)"/>

          <!-- Pipeline edge highlight (top line) -->
          <line x1="${pipeStartX + 20}" y1="${pipeY + 1}" x2="${pipeEndX - 20}" y2="${pipeY + 1}"
                stroke="rgba(255,255,255,0.08)" stroke-width="1"/>

          <!-- ===== FLOW CHEVRONS ===== -->
          <g class="animate-flow">
            ${chevrons.join('')}
          </g>

          <!-- ===== LEAK GLOW ZONE ===== -->
          <ellipse cx="${leakX}" cy="${pipeY + pipeHeight / 2}" rx="35" ry="30"
                   fill="url(#leakGlow)" class="animate-pulse-glow"/>

          <!-- ===== LEAK POINT ===== -->
          <!-- Ripple rings -->
          <circle cx="${leakX}" cy="${pipeY + pipeHeight / 2}" r="15" fill="none"
                  stroke="#ff3d5a" stroke-width="1.5" opacity="0"
                  class="animate-ripple" style="animation-delay: 0s;"/>
          <circle cx="${leakX}" cy="${pipeY + pipeHeight / 2}" r="15" fill="none"
                  stroke="#ff3d5a" stroke-width="1.5" opacity="0"
                  class="animate-ripple" style="animation-delay: 0.7s;"/>
          <circle cx="${leakX}" cy="${pipeY + pipeHeight / 2}" r="15" fill="none"
                  stroke="#ff3d5a" stroke-width="1.5" opacity="0"
                  class="animate-ripple" style="animation-delay: 1.4s;"/>

          <!-- Leak dot -->
          <circle cx="${leakX}" cy="${pipeY + pipeHeight / 2}" r="12"
                  fill="#ff3d5a" stroke="#ff6b81" stroke-width="2"
                  filter="url(#leakFilter)" class="animate-pulse-glow"/>
          <circle cx="${leakX}" cy="${pipeY + pipeHeight / 2}" r="5"
                  fill="#fff" opacity="0.9"/>

          <!-- Warning triangle above leak -->
          <g transform="translate(${leakX}, ${pipeY - 28})">
            <polygon points="0,-14 12,8 -12,8" fill="#ff3d5a" stroke="#fff" stroke-width="1.2"
                     filter="url(#leakFilter)"/>
            <text x="0" y="4" text-anchor="middle" fill="#fff" font-size="11" font-weight="800"
                  font-family="Inter, sans-serif">!</text>
          </g>

          <!-- Drop/splash below leak -->
          <g transform="translate(${leakX}, ${pipeY + pipeHeight + 8})" class="animate-pulse-glow">
            <!-- Main drop -->
            <path d="M0,0 C-3,6 -5,12 0,18 C5,12 3,6 0,0Z" fill="#ff3d5a" opacity="0.8"/>
            <!-- Splash left -->
            <circle cx="-6" cy="22" r="2" fill="#ff3d5a" opacity="0.5"/>
            <!-- Splash right -->
            <circle cx="5" cy="20" r="1.5" fill="#ff3d5a" opacity="0.4"/>
            <!-- Splash center -->
            <circle cx="0" cy="24" r="2.5" fill="#ff3d5a" opacity="0.6"/>
          </g>

          <!-- ===== ACCESS POINT 1 (Left) ===== -->
          <g>
            <!-- Glow background -->
            <circle cx="${pipeStartX}" cy="${pipeY + pipeHeight / 2}" r="32"
                    fill="url(#apGlow)"/>
            <!-- AP circle -->
            <circle cx="${pipeStartX}" cy="${pipeY + pipeHeight / 2}" r="20"
                    fill="#0a1628" stroke="#00d4ff" stroke-width="2.5"
                    filter="url(#apFilter)"/>
            <!-- Inner fill -->
            <circle cx="${pipeStartX}" cy="${pipeY + pipeHeight / 2}" r="15"
                    fill="rgba(0, 212, 255, 0.15)"/>
            <!-- Sensor icon (wave symbol) -->
            <g transform="translate(${pipeStartX}, ${pipeY + pipeHeight / 2})">
              <path d="M-6,-4 C-3,-8 3,-8 6,-4" fill="none" stroke="#00d4ff" stroke-width="1.5" stroke-linecap="round"/>
              <path d="M-4,0 C-2,-3 2,-3 4,0" fill="none" stroke="#00d4ff" stroke-width="1.5" stroke-linecap="round"/>
              <circle cx="0" cy="3" r="2" fill="#00d4ff"/>
            </g>
            <!-- Label above -->
            <text x="${pipeStartX}" y="${pipeY - 48}" text-anchor="middle"
                  fill="#e8eaf6" font-size="13" font-weight="700" font-family="Inter, sans-serif">
              Access Point 1
            </text>
            <text x="${pipeStartX}" y="${pipeY - 33}" text-anchor="middle"
                  fill="#8892b0" font-size="11" font-family="Inter, sans-serif">
              (Logger 3)
            </text>
          </g>

          <!-- ===== ACCESS POINT 2 (Right) ===== -->
          <g>
            <!-- Glow background -->
            <circle cx="${pipeEndX}" cy="${pipeY + pipeHeight / 2}" r="32"
                    fill="url(#apGlow)"/>
            <!-- AP circle -->
            <circle cx="${pipeEndX}" cy="${pipeY + pipeHeight / 2}" r="20"
                    fill="#0a1628" stroke="#00d4ff" stroke-width="2.5"
                    filter="url(#apFilter)"/>
            <!-- Inner fill -->
            <circle cx="${pipeEndX}" cy="${pipeY + pipeHeight / 2}" r="15"
                    fill="rgba(0, 212, 255, 0.15)"/>
            <!-- Sensor icon -->
            <g transform="translate(${pipeEndX}, ${pipeY + pipeHeight / 2})">
              <path d="M-6,-4 C-3,-8 3,-8 6,-4" fill="none" stroke="#00d4ff" stroke-width="1.5" stroke-linecap="round"/>
              <path d="M-4,0 C-2,-3 2,-3 4,0" fill="none" stroke="#00d4ff" stroke-width="1.5" stroke-linecap="round"/>
              <circle cx="0" cy="3" r="2" fill="#00d4ff"/>
            </g>
            <!-- Label above -->
            <text x="${pipeEndX}" y="${pipeY - 48}" text-anchor="middle"
                  fill="#e8eaf6" font-size="13" font-weight="700" font-family="Inter, sans-serif">
              Access Point 2
            </text>
            <text x="${pipeEndX}" y="${pipeY - 33}" text-anchor="middle"
                  fill="#8892b0" font-size="11" font-family="Inter, sans-serif">
              (Logger 4)
            </text>
          </g>

          <!-- ===== DISTANCE LABELS ON PIPELINE ===== -->
          <!-- Left segment distance -->
          <g>
            <line x1="${pipeStartX + 30}" y1="${pipeY - 10}" x2="${leakX - 15}" y2="${pipeY - 10}"
                  stroke="rgba(0, 212, 255, 0.3)" stroke-width="1" stroke-dasharray="4,3"/>
            <line x1="${pipeStartX + 30}" y1="${pipeY - 14}" x2="${pipeStartX + 30}" y2="${pipeY - 6}"
                  stroke="rgba(0, 212, 255, 0.4)" stroke-width="1"/>
            <line x1="${leakX - 15}" y1="${pipeY - 14}" x2="${leakX - 15}" y2="${pipeY - 6}"
                  stroke="rgba(0, 212, 255, 0.4)" stroke-width="1"/>
            <rect x="${leftMidX - 40}" y="${pipeY - 22}" width="80" height="18" rx="4"
                  fill="rgba(0, 191, 166, 0.15)" stroke="rgba(0, 191, 166, 0.3)" stroke-width="0.8"/>
            <text x="${leftMidX}" y="${pipeY - 10}" text-anchor="middle"
                  fill="#00bfa6" font-size="11" font-weight="700" font-family="Inter, sans-serif">
              207.24 m
            </text>
          </g>

          <!-- Right segment distance -->
          <g>
            <line x1="${leakX + 15}" y1="${pipeY - 10}" x2="${pipeEndX - 30}" y2="${pipeY - 10}"
                  stroke="rgba(0, 212, 255, 0.3)" stroke-width="1" stroke-dasharray="4,3"/>
            <line x1="${leakX + 15}" y1="${pipeY - 14}" x2="${leakX + 15}" y2="${pipeY - 6}"
                  stroke="rgba(0, 212, 255, 0.4)" stroke-width="1"/>
            <line x1="${pipeEndX - 30}" y1="${pipeY - 14}" x2="${pipeEndX - 30}" y2="${pipeY - 6}"
                  stroke="rgba(0, 212, 255, 0.4)" stroke-width="1"/>
            <rect x="${rightMidX - 40}" y="${pipeY - 22}" width="80" height="18" rx="4"
                  fill="rgba(0, 191, 166, 0.15)" stroke="rgba(0, 191, 166, 0.3)" stroke-width="0.8"/>
            <text x="${rightMidX}" y="${pipeY - 10}" text-anchor="middle"
                  fill="#00bfa6" font-size="11" font-weight="700" font-family="Inter, sans-serif">
              292.76 m
            </text>
          </g>

          <!-- ===== ANNOTATION ARROW FROM LEAK ===== -->
          <g>
            <!-- Arrow line -->
            <line x1="${leakX}" y1="${pipeY + pipeHeight + 32}" x2="${leakX}" y2="${pipeY + pipeHeight + 52}"
                  stroke="#ff3d5a" stroke-width="1.5" stroke-dasharray="3,2"/>
            <!-- Arrowhead -->
            <polygon points="${leakX},${pipeY + pipeHeight + 55} ${leakX - 4},${pipeY + pipeHeight + 49} ${leakX + 4},${pipeY + pipeHeight + 49}"
                     fill="#ff3d5a"/>
            <!-- Text box background -->
            <rect x="${leakX - 120}" y="${pipeY + pipeHeight + 56}" width="240" height="38" rx="6"
                  fill="rgba(255, 61, 90, 0.08)" stroke="rgba(255, 61, 90, 0.25)" stroke-width="1"/>
            <!-- Text -->
            <text x="${leakX}" y="${pipeY + pipeHeight + 72}" text-anchor="middle"
                  fill="#ff6b81" font-size="10.5" font-weight="600" font-family="Inter, sans-serif">
              Leak Position: 207.24 m from AP1
            </text>
            <text x="${leakX}" y="${pipeY + pipeHeight + 86}" text-anchor="middle"
                  fill="#ff6b81" font-size="10.5" font-weight="600" font-family="Inter, sans-serif">
              Leak Position: 292.76 m from AP2
            </text>
          </g>

          <!-- ===== MEASUREMENT SCALE ===== -->
          <g>
            <!-- Scale line -->
            <line x1="${pipeStartX}" y1="${scaleY}" x2="${pipeEndX}" y2="${scaleY}"
                  stroke="#8892b0" stroke-width="1"/>
            <!-- Tick marks -->
            ${scaleTicks.join('')}
          </g>
        </svg>
      </div>

      <!-- Info Panel — Two Columns -->
      <div style="
        display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px;
      ">
        <!-- Left: Leak Detection Results -->
        <div style="
          background: linear-gradient(135deg, rgba(19, 26, 46, 0.95), rgba(19, 26, 46, 0.8));
          border: 1px solid #1e2a45; border-radius: 14px; padding: 28px 28px 24px;
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 20px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.03);
        ">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px;">
            <div style="
              width: 32px; height: 32px; border-radius: 8px;
              background: rgba(255, 61, 90, 0.12); display: flex; align-items: center; justify-content: center;
            ">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff3d5a" stroke-width="2.5" stroke-linecap="round">
                <path d="M12 2L2 22h20L12 2z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <h3 style="font-family: 'Inter', sans-serif; font-size: 16px; font-weight: 700; color: #e8eaf6; margin: 0;">
              Leak Detection Results
            </h3>
          </div>

          <div style="display: flex; flex-direction: column; gap: 14px;">
            ${_infoRow('Leak Status', `<span style="
              background: rgba(255, 61, 90, 0.15); border: 1px solid rgba(255, 61, 90, 0.35);
              color: #ff3d5a; font-size: 11px; font-weight: 700; padding: 2px 10px;
              border-radius: 12px; text-transform: uppercase; letter-spacing: 0.8px;
            ">DETECTED</span>`)}
            ${_infoRow('Leak Position', `<span style="color: #00d4ff; font-weight: 600;">${leakPosition} m</span> <span style="color: #8892b0; font-size: 12px;">from Access Point 1</span>`)}
            ${_infoRow('Reverse Position', `<span style="color: #00d4ff; font-weight: 600;">${reversePosition} m</span> <span style="color: #8892b0; font-size: 12px;">from Access Point 2</span>`)}
            ${_infoRow('Pipeline Length', `<span style="color: #e8eaf6; font-weight: 600;">${pipelineLength} m</span>`)}
            ${_infoRow('Localization Confidence', `
              <div style="display: flex; align-items: center; gap: 10px;">
                <div style="flex: 1; height: 6px; background: rgba(255,255,255,0.06); border-radius: 3px; overflow: hidden; min-width: 80px;">
                  <div style="width: ${confidence}%; height: 100%; background: linear-gradient(90deg, #00bfa6, #00d4ff); border-radius: 3px;"></div>
                </div>
                <span style="color: #00e676; font-weight: 700; font-size: 14px;">${confidence}%</span>
              </div>
            `)}
          </div>
        </div>

        <!-- Right: Detection Parameters -->
        <div style="
          background: linear-gradient(135deg, rgba(19, 26, 46, 0.95), rgba(19, 26, 46, 0.8));
          border: 1px solid #1e2a45; border-radius: 14px; padding: 28px 28px 24px;
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 20px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.03);
        ">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px;">
            <div style="
              width: 32px; height: 32px; border-radius: 8px;
              background: rgba(0, 212, 255, 0.12); display: flex; align-items: center; justify-content: center;
            ">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" stroke-width="2.5" stroke-linecap="round">
                <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
              </svg>
            </div>
            <h3 style="font-family: 'Inter', sans-serif; font-size: 16px; font-weight: 700; color: #e8eaf6; margin: 0;">
              Detection Parameters
            </h3>
          </div>

          <div style="display: flex; flex-direction: column; gap: 14px;">
            ${_infoRow('Time Delay', `<span style="color: #e8eaf6; font-weight: 600;">${timeDelay} seconds</span>`)}
            ${_infoRow('Wave Velocity', `<span style="color: #e8eaf6; font-weight: 600;">${waveVelocity.toLocaleString()} m/s</span>`)}
            ${_infoRow('Correlation Method', `<span style="color: #00bfa6; font-weight: 600;">Cross-Correlation</span>`)}
            ${_infoRow('Frequency Band', `<span style="color: #e8eaf6; font-weight: 600;">500 – 510 Hz</span>`)}
            ${_infoRow('Detection Algorithm', `<span style="color: #e8eaf6; font-weight: 600;">Peak Detection</span>`)}
          </div>
        </div>
      </div>

      <!-- Methodology Card -->
      <div style="
        background: linear-gradient(135deg, rgba(19, 26, 46, 0.95), rgba(19, 26, 46, 0.8));
        border: 1px solid #1e2a45; border-radius: 14px; padding: 32px 32px 28px;
        backdrop-filter: blur(10px);
        box-shadow: 0 4px 20px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.03);
      ">
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px;">
          <div style="
            width: 32px; height: 32px; border-radius: 8px;
            background: rgba(0, 191, 166, 0.12); display: flex; align-items: center; justify-content: center;
          ">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00bfa6" stroke-width="2.5" stroke-linecap="round">
              <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>
            </svg>
          </div>
          <h3 style="font-family: 'Inter', sans-serif; font-size: 16px; font-weight: 700; color: #e8eaf6; margin: 0;">
            Localization Methodology
          </h3>
        </div>

        <p style="
          font-family: 'Inter', sans-serif; font-size: 13.5px; line-height: 1.75;
          color: #8892b0; margin: 0 0 24px; max-width: 900px;
        ">
          The leak position is calculated using the time delay estimation between two acoustic sensors placed at known 
          positions on the pipeline. Cross-correlation of the filtered signals reveals the time delay, which combined 
          with the wave propagation velocity, precisely locates the leak.
        </p>

        <!-- Formula Section -->
        <div style="
          background: rgba(10, 14, 26, 0.6); border: 1px solid rgba(30, 42, 69, 0.8);
          border-radius: 10px; padding: 24px 28px; display: flex; flex-direction: column; gap: 12px;
        ">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
            <span style="
              font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 600; color: #00bfa6;
              text-transform: uppercase; letter-spacing: 1.5px;
            ">Formula Derivation</span>
            <div style="flex: 1; height: 1px; background: rgba(30, 42, 69, 0.8);"></div>
          </div>

          ${_formulaLine('d₁ = (d − c × t<sub>d</sub>) / 2', true)}
          ${_formulaLine(`d₁ = (${pipelineLength} − ${waveVelocity} × ${timeDelay}) / 2`, false)}
          ${_formulaLine(`d₁ = (${pipelineLength} − ${(waveVelocity * timeDelay).toFixed(3)}) / 2`, false)}
          ${_formulaLine(`d₁ = ${((pipelineLength - waveVelocity * timeDelay) / 2).toFixed(3)} m`, false)}

          <div style="
            margin-top: 8px; padding-top: 12px;
            border-top: 1px solid rgba(30, 42, 69, 0.8);
            display: flex; align-items: center; gap: 12px;
          ">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00e676" stroke-width="2.5" stroke-linecap="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span style="font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 700; color: #00e676;">
              d₁ ≈ 207.24 m
            </span>
            <span style="font-family: 'Inter', sans-serif; font-size: 12px; color: #8892b0; margin-left: 4px;">
              from Access Point 1
            </span>
          </div>

          <!-- Variable legend -->
          <div style="
            margin-top: 12px; padding-top: 12px;
            border-top: 1px solid rgba(30, 42, 69, 0.8);
            display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 8px;
          ">
            ${_legendItem('d', 'Total pipeline length (500 m)')}
            ${_legendItem('c', 'Wave propagation velocity (1,280 m/s)')}
            ${_legendItem('t<sub>d</sub>', 'Estimated time delay (0.0668 s)')}
            ${_legendItem('d₁', 'Distance from Access Point 1')}
          </div>
        </div>
      </div>

    </div>
  `;

  // Add CSS animations via a dynamic style element
  const styleEl = document.createElement('style');
  styleEl.id = 'viz-page-styles';
  styleEl.textContent = `
    .flow-chevron {
      animation: flowMove 2.5s linear infinite;
    }

    @keyframes flowMove {
      0%   { opacity: 0; transform: translateX(-15px); }
      20%  { opacity: 1; }
      80%  { opacity: 1; }
      100% { opacity: 0; transform: translateX(15px); }
    }
  `;
  document.head.appendChild(styleEl);
}

/**
 * Generates a row for the info panel
 */
function _infoRow(label, valueHTML) {
  return `
    <div style="
      display: flex; justify-content: space-between; align-items: center;
      padding: 10px 14px; background: rgba(10, 14, 26, 0.35);
      border-radius: 8px; border: 1px solid rgba(30, 42, 69, 0.5);
    ">
      <span style="font-family: 'Inter', sans-serif; font-size: 13px; color: #8892b0; white-space: nowrap; margin-right: 12px;">
        ${label}
      </span>
      <span style="font-family: 'Inter', sans-serif; font-size: 13px; text-align: right;">
        ${valueHTML}
      </span>
    </div>
  `;
}

/**
 * Generates a formula step line
 */
function _formulaLine(formula, isFirst) {
  return `
    <div style="
      display: flex; align-items: center; gap: 8px;
      padding: ${isFirst ? '12px 16px' : '8px 16px'};
      ${isFirst ? 'background: rgba(0, 191, 166, 0.06); border: 1px solid rgba(0, 191, 166, 0.15); border-radius: 8px;' : ''}
    ">
      <span style="
        font-family: 'Inter', 'Cambria Math', 'Georgia', serif;
        font-size: ${isFirst ? '16px' : '14px'};
        color: ${isFirst ? '#00d4ff' : '#c8cce0'};
        font-weight: ${isFirst ? '600' : '400'};
        font-style: ${isFirst ? 'normal' : 'normal'};
        letter-spacing: 0.5px;
      ">
        ${formula}
      </span>
    </div>
  `;
}

/**
 * Generates a legend item for formula variables
 */
function _legendItem(symbol, description) {
  return `
    <div style="display: flex; align-items: center; gap: 8px; padding: 4px 0;">
      <span style="
        font-family: 'Inter', 'Georgia', serif; font-size: 13px; font-weight: 700;
        color: #00d4ff; min-width: 24px;
      ">${symbol}</span>
      <span style="font-family: 'Inter', sans-serif; font-size: 12px; color: #8892b0;">
        — ${description}
      </span>
    </div>
  `;
}

/**
 * Cleanup: remove intervals, timeouts, and injected styles
 */
export function cleanupVisualization() {
  _animationIntervals.forEach(id => clearInterval(id));
  _animationTimeouts.forEach(id => clearTimeout(id));
  _animationIntervals = [];
  _animationTimeouts = [];

  const styleEl = document.getElementById('viz-page-styles');
  if (styleEl) {
    styleEl.remove();
  }
}
