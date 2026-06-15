import { navigateTo } from '../router.js';

/**
 * PipeGuard — Premium Authentication Screen
 * Renders a full-screen login page with animated background,
 * glassmorphism card, and demo authentication flow.
 */
export function renderLogin(container) {
  // ── Unique ID suffix to avoid collisions ──
  const uid = `pg_${Date.now()}`;

  container.innerHTML = `
    <!-- ═══════════════ LOGIN PAGE ═══════════════ -->
    <style>
      /* ── Keyframes ── */
      @keyframes pg-fadeInUp {
        from { opacity: 0; transform: translateY(32px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes pg-float {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        50%      { transform: translateY(-18px) rotate(2deg); }
      }
      @keyframes pg-drift {
        0%   { transform: translate(0, 0); opacity: 0; }
        10%  { opacity: 1; }
        90%  { opacity: 1; }
        100% { transform: translate(var(--dx), var(--dy)); opacity: 0; }
      }
      @keyframes pg-pulse {
        0%, 100% { opacity: 0.35; }
        50%      { opacity: 0.7; }
      }
      @keyframes pg-gridScroll {
        0%   { background-position: 0 0; }
        100% { background-position: 60px 60px; }
      }
      @keyframes pg-glow {
        0%, 100% { filter: drop-shadow(0 0 6px rgba(0,212,255,0.25)); }
        50%      { filter: drop-shadow(0 0 18px rgba(0,212,255,0.5)); }
      }

      /* ── Full-screen wrapper ── */
      .pg-login-root {
        position: fixed;
        inset: 0;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #0a0e1a 0%, #0f1629 100%);
        font-family: 'Inter', system-ui, -apple-system, sans-serif;
        overflow: hidden;
      }

      /* ── Grid overlay ── */
      .pg-grid-overlay {
        position: absolute;
        inset: 0;
        background-image:
          linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px);
        background-size: 60px 60px;
        animation: pg-gridScroll 20s linear infinite;
        pointer-events: none;
      }

      /* ── Floating SVG shapes ── */
      .pg-floating-shapes {
        position: absolute;
        inset: 0;
        pointer-events: none;
        overflow: hidden;
      }
      .pg-shape {
        position: absolute;
        opacity: 0.07;
        animation: pg-float 8s ease-in-out infinite;
      }
      .pg-shape:nth-child(1) { top: 8%; left: 6%;  animation-duration: 9s; animation-delay: 0s; }
      .pg-shape:nth-child(2) { top: 15%; right: 10%; animation-duration: 11s; animation-delay: 1.5s; }
      .pg-shape:nth-child(3) { bottom: 20%; left: 12%; animation-duration: 10s; animation-delay: 3s; }
      .pg-shape:nth-child(4) { bottom: 10%; right: 8%; animation-duration: 8s; animation-delay: 0.5s; }
      .pg-shape:nth-child(5) { top: 50%; left: 3%; animation-duration: 12s; animation-delay: 2s; }
      .pg-shape:nth-child(6) { top: 35%; right: 4%; animation-duration: 10s; animation-delay: 4s; }

      /* ── Particles ── */
      .pg-particles {
        position: absolute;
        inset: 0;
        pointer-events: none;
        overflow: hidden;
      }
      .pg-particle {
        position: absolute;
        width: 3px;
        height: 3px;
        border-radius: 50%;
        background: rgba(0, 212, 255, 0.5);
        animation: pg-drift var(--dur) linear infinite;
        animation-delay: var(--delay);
      }

      /* ── Glassmorphism card ── */
      .pg-card {
        position: relative;
        z-index: 10;
        width: 100%;
        max-width: 440px;
        padding: 48px;
        border-radius: 24px;
        background: rgba(19, 26, 46, 0.7);
        backdrop-filter: blur(24px);
        -webkit-backdrop-filter: blur(24px);
        border: 1px solid rgba(30, 42, 69, 0.6);
        box-shadow:
          0 32px 64px rgba(0, 0, 0, 0.4),
          0 0 0 1px rgba(0, 212, 255, 0.04),
          inset 0 1px 0 rgba(255, 255, 255, 0.03);
        animation: pg-fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        box-sizing: border-box;
      }
      @media (max-width: 520px) {
        .pg-card {
          margin: 16px;
          padding: 32px 24px;
          border-radius: 20px;
        }
      }

      /* ── Logo icon ── */
      .pg-logo-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px;
        width: 72px;
        height: 72px;
        border-radius: 20px;
        background: linear-gradient(135deg, rgba(0,212,255,0.12) 0%, rgba(0,191,166,0.08) 100%);
        border: 1px solid rgba(0,212,255,0.15);
        animation: pg-glow 4s ease-in-out infinite;
      }
      .pg-logo-icon svg {
        width: 40px;
        height: 40px;
      }

      /* ── Brand text ── */
      .pg-brand-name {
        text-align: center;
        font-size: 28px;
        font-weight: 700;
        letter-spacing: 6px;
        margin: 0 0 8px;
        background: linear-gradient(135deg, #00d4ff 0%, #00bfa6 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      .pg-brand-subtitle {
        text-align: center;
        font-size: 13px;
        font-weight: 400;
        color: #8892b0;
        margin: 0 0 4px;
        line-height: 1.5;
      }
      .pg-brand-tagline {
        text-align: center;
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 3px;
        text-transform: uppercase;
        background: linear-gradient(90deg, #00d4ff, #00bfa6, #00d4ff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin: 0 0 36px;
      }

      /* ── Divider ── */
      .pg-divider {
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(0,212,255,0.2), transparent);
        margin: 0 0 32px;
        border: none;
      }

      /* ── Input group ── */
      .pg-input-group {
        position: relative;
        margin-bottom: 18px;
      }
      .pg-input-icon {
        position: absolute;
        left: 16px;
        top: 50%;
        transform: translateY(-50%);
        width: 18px;
        height: 18px;
        color: #8892b0;
        pointer-events: none;
        transition: color 0.25s;
      }
      .pg-input {
        width: 100%;
        padding: 14px 16px 14px 48px;
        border-radius: 14px;
        border: 1px solid rgba(30, 42, 69, 0.8);
        background: rgba(10, 14, 26, 0.6);
        color: #e8eaf6;
        font-family: 'Inter', system-ui, sans-serif;
        font-size: 14px;
        outline: none;
        transition: border-color 0.25s, box-shadow 0.25s;
        box-sizing: border-box;
      }
      .pg-input::placeholder {
        color: #4a5568;
      }
      .pg-input:focus {
        border-color: rgba(0, 212, 255, 0.5);
        box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.08), 0 0 20px rgba(0, 212, 255, 0.06);
      }
      .pg-input:focus ~ .pg-input-icon,
      .pg-input-group:focus-within .pg-input-icon {
        color: #00d4ff;
      }

      /* ── Remember / Forgot row ── */
      .pg-meta-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 6px 0 28px;
      }
      .pg-remember {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        font-size: 13px;
        color: #8892b0;
        user-select: none;
      }
      .pg-remember input[type="checkbox"] {
        appearance: none;
        -webkit-appearance: none;
        width: 16px;
        height: 16px;
        border: 1px solid rgba(30, 42, 69, 0.8);
        border-radius: 4px;
        background: rgba(10, 14, 26, 0.6);
        cursor: pointer;
        position: relative;
        transition: border-color 0.25s, background 0.25s;
        flex-shrink: 0;
      }
      .pg-remember input[type="checkbox"]:checked {
        background: linear-gradient(135deg, #00d4ff, #00bfa6);
        border-color: #00bfa6;
      }
      .pg-remember input[type="checkbox"]:checked::after {
        content: '';
        position: absolute;
        left: 4.5px;
        top: 1.5px;
        width: 5px;
        height: 9px;
        border: solid #0a0e1a;
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
      }
      .pg-forgot {
        font-size: 13px;
        color: #00d4ff;
        text-decoration: none;
        transition: color 0.25s, text-shadow 0.25s;
        background: none;
        border: none;
        cursor: pointer;
        font-family: 'Inter', system-ui, sans-serif;
      }
      .pg-forgot:hover {
        color: #00bfa6;
        text-shadow: 0 0 12px rgba(0, 212, 255, 0.3);
      }

      /* ── Submit button ── */
      .pg-submit {
        width: 100%;
        padding: 15px 24px;
        border: none;
        border-radius: 14px;
        background: linear-gradient(135deg, #00d4ff 0%, #00bfa6 100%);
        color: #0a0e1a;
        font-family: 'Inter', system-ui, sans-serif;
        font-size: 15px;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        transition: filter 0.25s, transform 0.15s, box-shadow 0.25s;
        box-shadow: 0 4px 24px rgba(0, 212, 255, 0.2);
        letter-spacing: 0.5px;
        box-sizing: border-box;
      }
      .pg-submit:hover {
        filter: brightness(1.15);
        transform: translateY(-1px);
        box-shadow: 0 6px 32px rgba(0, 212, 255, 0.35);
      }
      .pg-submit:active {
        transform: scale(0.98) translateY(0);
        box-shadow: 0 2px 16px rgba(0, 212, 255, 0.15);
      }
      .pg-submit:disabled {
        opacity: 0.8;
        cursor: not-allowed;
        transform: none;
      }
      .pg-submit svg {
        width: 18px;
        height: 18px;
        transition: transform 0.25s;
      }
      .pg-submit:hover svg {
        transform: translateX(3px);
      }

      /* ── Loading spinner ── */
      .pg-spinner {
        width: 18px;
        height: 18px;
        border: 2px solid rgba(10, 14, 26, 0.3);
        border-top-color: #0a0e1a;
        border-radius: 50%;
        animation: pg-spin 0.6s linear infinite;
        flex-shrink: 0;
      }
      @keyframes pg-spin {
        to { transform: rotate(360deg); }
      }

      /* ── Footer ── */
      .pg-footer {
        text-align: center;
        margin-top: 36px;
        padding-top: 24px;
        border-top: 1px solid rgba(30, 42, 69, 0.4);
      }
      .pg-footer-system {
        font-size: 11px;
        color: #4a5568;
        letter-spacing: 1.5px;
        text-transform: uppercase;
        margin: 0 0 6px;
      }
      .pg-footer-copy {
        font-size: 11px;
        color: #3a4256;
        margin: 0;
      }

      /* ── Corner accents ── */
      .pg-corner {
        position: absolute;
        width: 40px;
        height: 40px;
        pointer-events: none;
        opacity: 0.15;
      }
      .pg-corner--tl { top: 12px; left: 12px; }
      .pg-corner--br { bottom: 12px; right: 12px; transform: rotate(180deg); }
    </style>

    <div class="pg-login-root" id="${uid}_root">
      <!-- Grid overlay -->
      <div class="pg-grid-overlay"></div>

      <!-- Floating pipeline/circuit SVG shapes -->
      <div class="pg-floating-shapes">
        <!-- Pipe elbow 1 -->
        <svg class="pg-shape" width="120" height="120" viewBox="0 0 120 120" fill="none">
          <path d="M20 100 L20 50 Q20 20 50 20 L100 20" stroke="#00d4ff" stroke-width="6" stroke-linecap="round" fill="none"/>
          <circle cx="20" cy="100" r="6" fill="#00d4ff"/>
          <circle cx="100" cy="20" r="6" fill="#00bfa6"/>
        </svg>
        <!-- Pipeline straight 2 -->
        <svg class="pg-shape" width="140" height="60" viewBox="0 0 140 60" fill="none">
          <rect x="10" y="18" width="120" height="24" rx="12" stroke="#00bfa6" stroke-width="4" fill="none"/>
          <line x1="40" y1="18" x2="40" y2="42" stroke="#00bfa6" stroke-width="2"/>
          <line x1="70" y1="18" x2="70" y2="42" stroke="#00bfa6" stroke-width="2"/>
          <line x1="100" y1="18" x2="100" y2="42" stroke="#00bfa6" stroke-width="2"/>
        </svg>
        <!-- Valve symbol 3 -->
        <svg class="pg-shape" width="100" height="100" viewBox="0 0 100 100" fill="none">
          <path d="M10 50 L40 30 L40 70 Z" stroke="#00d4ff" stroke-width="3" fill="none"/>
          <path d="M90 50 L60 30 L60 70 Z" stroke="#00d4ff" stroke-width="3" fill="none"/>
          <line x1="50" y1="30" x2="50" y2="10" stroke="#00d4ff" stroke-width="3"/>
          <circle cx="50" cy="8" r="4" stroke="#00d4ff" stroke-width="2" fill="none"/>
        </svg>
        <!-- T-junction 4 -->
        <svg class="pg-shape" width="110" height="110" viewBox="0 0 110 110" fill="none">
          <path d="M10 40 L100 40" stroke="#00bfa6" stroke-width="5" stroke-linecap="round"/>
          <path d="M55 40 L55 100" stroke="#00bfa6" stroke-width="5" stroke-linecap="round"/>
          <circle cx="55" cy="40" r="8" stroke="#00d4ff" stroke-width="2" fill="none"/>
        </svg>
        <!-- Sensor node 5 -->
        <svg class="pg-shape" width="90" height="90" viewBox="0 0 90 90" fill="none">
          <circle cx="45" cy="45" r="20" stroke="#00d4ff" stroke-width="3" fill="none"/>
          <circle cx="45" cy="45" r="8" stroke="#00d4ff" stroke-width="2" fill="none"/>
          <circle cx="45" cy="45" r="3" fill="#00d4ff"/>
          <line x1="45" y1="5" x2="45" y2="25" stroke="#00d4ff" stroke-width="2"/>
          <line x1="45" y1="65" x2="45" y2="85" stroke="#00d4ff" stroke-width="2"/>
          <line x1="5" y1="45" x2="25" y2="45" stroke="#00d4ff" stroke-width="2"/>
          <line x1="65" y1="45" x2="85" y2="45" stroke="#00d4ff" stroke-width="2"/>
        </svg>
        <!-- Circuit path 6 -->
        <svg class="pg-shape" width="130" height="80" viewBox="0 0 130 80" fill="none">
          <path d="M10 40 L30 40 L40 15 L60 65 L80 15 L100 65 L110 40 L130 40" stroke="#00bfa6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        </svg>
      </div>

      <!-- Drifting particles -->
      <div class="pg-particles" id="${uid}_particles"></div>

      <!-- Login Card -->
      <div class="pg-card">
        <!-- Corner accents -->
        <svg class="pg-corner pg-corner--tl" viewBox="0 0 40 40" fill="none">
          <path d="M0 40 L0 8 Q0 0 8 0 L40 0" stroke="#00d4ff" stroke-width="1.5"/>
        </svg>
        <svg class="pg-corner pg-corner--br" viewBox="0 0 40 40" fill="none">
          <path d="M0 40 L0 8 Q0 0 8 0 L40 0" stroke="#00bfa6" stroke-width="1.5"/>
        </svg>

        <!-- Logo -->
        <div class="pg-logo-icon">
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Shield outline -->
            <path d="M24 4 L40 12 L40 24 C40 34 33 41 24 44 C15 41 8 34 8 24 L8 12 Z"
                  stroke="url(#logoGrad)" stroke-width="2.5" fill="none" stroke-linejoin="round"/>
            <!-- Water droplet inside -->
            <path d="M24 16 C24 16 18 23 18 27 C18 30.3 20.7 33 24 33 C27.3 33 30 30.3 30 27 C30 23 24 16 24 16Z"
                  fill="url(#logoGrad)" opacity="0.85"/>
            <!-- Pipe segments -->
            <path d="M4 20 L10 20" stroke="url(#logoGrad)" stroke-width="2.5" stroke-linecap="round"/>
            <path d="M38 20 L44 20" stroke="url(#logoGrad)" stroke-width="2.5" stroke-linecap="round"/>
            <defs>
              <linearGradient id="logoGrad" x1="0" y1="0" x2="48" y2="48">
                <stop offset="0%" stop-color="#00d4ff"/>
                <stop offset="100%" stop-color="#00bfa6"/>
              </linearGradient>
            </defs>
          </svg>
        </div>

        <!-- Brand -->
        <h1 class="pg-brand-name">PIPEGUARD</h1>
        <p class="pg-brand-subtitle">Smart Pipeline Leak Detection &amp; Localization Dashboard</p>
        <p class="pg-brand-tagline">Detect. Localize. Protect.</p>

        <hr class="pg-divider"/>

        <!-- Form -->
        <form id="${uid}_form" autocomplete="off">
          <!-- Email -->
          <div class="pg-input-group">
            <svg class="pg-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="3"/>
              <path d="M2 7 L12 13 L22 7"/>
            </svg>
            <input class="pg-input" type="email" id="${uid}_email" placeholder="Enter your email" required autocomplete="email"/>
          </div>

          <!-- Password -->
          <div class="pg-input-group">
            <svg class="pg-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="3"/>
              <path d="M7 11 V7 C7 4.24 9.24 2 12 2 C14.76 2 17 4.24 17 7 V11"/>
              <circle cx="12" cy="16.5" r="1.5" fill="currentColor" stroke="none"/>
            </svg>
            <input class="pg-input" type="password" id="${uid}_password" placeholder="Enter your password" required autocomplete="current-password"/>
          </div>

          <!-- Remember / Forgot -->
          <div class="pg-meta-row">
            <label class="pg-remember">
              <input type="checkbox" checked/>
              <span>Remember me</span>
            </label>
            <button type="button" class="pg-forgot">Forgot password?</button>
          </div>

          <!-- Submit -->
          <button type="submit" class="pg-submit" id="${uid}_submit">
            <span id="${uid}_btnText">Sign In</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" id="${uid}_btnArrow">
              <path d="M5 12 L19 12"/>
              <path d="M13 6 L19 12 L13 18"/>
            </svg>
          </button>
        </form>

        <!-- Footer -->
        <div class="pg-footer">
          <p class="pg-footer-system">Pipeline Integrity Monitoring System v1.0</p>
          <p class="pg-footer-copy">&copy; ${new Date().getFullYear()} PipeGuard Systems. All rights reserved.</p>
        </div>
      </div>
    </div>
  `;

  // ── Generate particles ──
  const particleContainer = document.getElementById(`${uid}_particles`);
  if (particleContainer) {
    const particleCount = 30;
    for (let i = 0; i < particleCount; i++) {
      const dot = document.createElement('div');
      dot.className = 'pg-particle';
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const dx = (Math.random() - 0.5) * 300;
      const dy = (Math.random() - 0.5) * 300;
      const dur = 12 + Math.random() * 18;
      const delay = Math.random() * 15;
      const size = 2 + Math.random() * 2;
      dot.style.cssText = `
        left: ${left}%;
        top: ${top}%;
        width: ${size}px;
        height: ${size}px;
        --dx: ${dx}px;
        --dy: ${dy}px;
        --dur: ${dur}s;
        --delay: -${delay}s;
      `;
      particleContainer.appendChild(dot);
    }
  }

  // ── Form submission ──
  const form = document.getElementById(`${uid}_form`);
  const submitBtn = document.getElementById(`${uid}_submit`);
  const btnText = document.getElementById(`${uid}_btnText`);
  const btnArrow = document.getElementById(`${uid}_btnArrow`);

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Disable button & show loading state
      submitBtn.disabled = true;
      btnArrow.style.display = 'none';
      btnText.textContent = 'Authenticating...';

      // Insert spinner
      const spinner = document.createElement('span');
      spinner.className = 'pg-spinner';
      spinner.id = `${uid}_spinner`;
      submitBtn.appendChild(spinner);

      // Navigate after delay (demo — accepts any credentials)
      setTimeout(() => {
        navigateTo('#/dashboard');
      }, 1500);
    });
  }
}
