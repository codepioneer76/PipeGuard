/**
 * PipeGuard IoT Dashboard — Main Application Entry
 * ==================================================
 * Central orchestrator that wires up the SPA router, manages the
 * persistent sidebar + topbar layout, and registers every page route
 * with its render / cleanup lifecycle hooks.
 */

// ── Global styles ───────────────────────────────────────────────────
import './style.css';

// ── Router ──────────────────────────────────────────────────────────
import { initRouter, registerRoute, getCurrentRoute } from './router.js';

// ── Shared layout components ────────────────────────────────────────
import { createSidebar, initSidebar } from './components/sidebar.js';
import { createTopbar, initTopbar }   from './components/topbar.js';

// ── Page modules (render + cleanup) ────────────────────────────────
import { renderLogin }                            from './pages/login.js';
import { renderDashboard,     cleanupDashboard }   from './pages/dashboard.js';
import { renderVisualization,  cleanupVisualization } from './pages/visualization.js';
import { renderAnalysis,       cleanupAnalysis }   from './pages/analysis.js';
import { renderReports,        cleanupReports }    from './pages/reports.js';
import { renderDataImport,     cleanupDataImport } from './pages/data-import.js';
import { renderSettings,       cleanupSettings }   from './pages/settings.js';

// ─────────────────────────────────────────────────────────────────────
// Route → human-readable title mapping (shown in the topbar)
// ─────────────────────────────────────────────────────────────────────
const routeTitles = {
  '#/dashboard':     'Dashboard Overview',
  '#/visualization': 'Pipeline Leak Visualization',
  '#/analysis':      'Signal & Correlation Analysis',
  '#/reports':       'Reports',
  '#/data-import':   'Data Import',
  '#/settings':      'Settings',
};

// ─────────────────────────────────────────────────────────────────────
// Layout management
// ─────────────────────────────────────────────────────────────────────
// The layout (sidebar + topbar + content area) is created once and
// reused across every authenticated page.  Navigating to the login
// page tears it down so login can occupy the full viewport.
// ─────────────────────────────────────────────────────────────────────

/** Whether the persistent layout shell is currently in the DOM. */
let layoutCreated = false;

/**
 * Build the sidebar + topbar + content-area shell inside `appContainer`.
 * No-ops if the layout already exists.
 */
function createLayout(appContainer) {
  if (layoutCreated) return;

  appContainer.innerHTML = `
    <div class="flex h-screen overflow-hidden">
      <!-- Collapsible sidebar -->
      <aside id="sidebar-container" class="flex-shrink-0 transition-all duration-300">
        ${createSidebar()}
      </aside>

      <!-- Main column: topbar + scrollable content -->
      <div class="flex-1 flex flex-col min-w-0">
        <header id="topbar-container">
          ${createTopbar()}
        </header>
        <main id="page-content" class="flex-1 overflow-y-auto p-6 lg:p-8" style="background: #0a0e1a;">
        </main>
      </div>
    </div>
  `;

  // Attach event listeners for sidebar & topbar interactivity
  initSidebar();
  initTopbar();
  layoutCreated = true;
}

/**
 * Mark the layout as destroyed so the next authenticated route
 * will recreate it from scratch.
 */
function destroyLayout() {
  layoutCreated = false;
}

// ─────────────────────────────────────────────────────────────────────
// UI helpers — keep topbar title & sidebar highlight in sync
// ─────────────────────────────────────────────────────────────────────

/**
 * Set the topbar heading to the title that matches the current hash.
 * @param {string} hash  e.g. '#/dashboard'
 */
function updateTopbarTitle(hash) {
  const titleEl = document.getElementById('topbar-title');
  if (titleEl) {
    titleEl.textContent = routeTitles[hash] || 'PipeGuard';
  }
}

/**
 * Toggle the `active` class on sidebar navigation items so only the
 * link matching `hash` is highlighted.
 * @param {string} hash  e.g. '#/visualization'
 */
function updateSidebarActive(hash) {
  const items = document.querySelectorAll('.sidebar-item');
  items.forEach(item => {
    const href = item.getAttribute('data-href');
    if (href === hash) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

// ─────────────────────────────────────────────────────────────────────
// Route registration
// ─────────────────────────────────────────────────────────────────────
// Each call to `registerRoute(hash, renderFn, cleanupFn)` tells the
// router what to do when the URL hash changes.  `cleanupFn` is called
// *before* the next route renders so pages can tear down ECharts
// instances, cancel timers, etc.
// ─────────────────────────────────────────────────────────────────────

// Login — full-screen, no layout
registerRoute('#/login', (appContainer) => {
  destroyLayout();
  renderLogin(appContainer);
}, null);

// Dashboard
registerRoute('#/dashboard', (appContainer) => {
  createLayout(appContainer);
  const content = document.getElementById('page-content');
  if (content) {
    content.innerHTML = '';
    renderDashboard(content);
  }
  updateTopbarTitle('#/dashboard');
  updateSidebarActive('#/dashboard');
}, cleanupDashboard);

// Visualization
registerRoute('#/visualization', (appContainer) => {
  createLayout(appContainer);
  const content = document.getElementById('page-content');
  if (content) {
    content.innerHTML = '';
    renderVisualization(content);
  }
  updateTopbarTitle('#/visualization');
  updateSidebarActive('#/visualization');
}, cleanupVisualization);

// Analysis
registerRoute('#/analysis', (appContainer) => {
  createLayout(appContainer);
  const content = document.getElementById('page-content');
  if (content) {
    content.innerHTML = '';
    renderAnalysis(content);
  }
  updateTopbarTitle('#/analysis');
  updateSidebarActive('#/analysis');
}, cleanupAnalysis);

// Reports
registerRoute('#/reports', (appContainer) => {
  createLayout(appContainer);
  const content = document.getElementById('page-content');
  if (content) {
    content.innerHTML = '';
    renderReports(content);
  }
  updateTopbarTitle('#/reports');
  updateSidebarActive('#/reports');
}, cleanupReports);

// Data Import
registerRoute('#/data-import', (appContainer) => {
  createLayout(appContainer);
  const content = document.getElementById('page-content');
  if (content) {
    content.innerHTML = '';
    renderDataImport(content);
  }
  updateTopbarTitle('#/data-import');
  updateSidebarActive('#/data-import');
}, cleanupDataImport);

// Settings
registerRoute('#/settings', (appContainer) => {
  createLayout(appContainer);
  const content = document.getElementById('page-content');
  if (content) {
    content.innerHTML = '';
    renderSettings(content);
  }
  updateTopbarTitle('#/settings');
  updateSidebarActive('#/settings');
}, cleanupSettings);

// ─────────────────────────────────────────────────────────────────────
// Bootstrap
// ─────────────────────────────────────────────────────────────────────
const app = document.getElementById('app');
initRouter(app);
