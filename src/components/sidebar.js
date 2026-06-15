import { getCurrentRoute } from '../router.js';

export function createSidebar() {
  return `
    <div class="h-full flex flex-col bg-[#0d1221] border-r border-navy-700 w-[260px] transition-all duration-300" id="sidebar-wrapper">
      
      <!-- Top Brand Area -->
      <div class="h-16 flex items-center px-6 border-b border-navy-700">
        <div class="flex items-center gap-3">
          <div class="text-cyan-400">
            <!-- Pipeline icon -->
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 12h8"/>
              <path d="M14 12h8"/>
              <circle cx="11" cy="12" r="3"/>
              <path d="M11 9V6"/>
              <path d="M9 6h4"/>
            </svg>
          </div>
          <span class="text-white font-bold tracking-[0.2em] text-sm uppercase sidebar-text">PIPEGUARD</span>
        </div>
      </div>

      <!-- Navigation Links -->
      <nav class="flex-1 overflow-y-auto py-6 px-3 space-y-2 custom-scrollbar">
        
        <a href="#/dashboard" class="sidebar-item flex items-center gap-3 px-3 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-navy-800 transition-all border-l-4 border-transparent" data-href="#/dashboard">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
          <span class="font-medium sidebar-text whitespace-nowrap">Dashboard</span>
        </a>

        <a href="#/visualization" class="sidebar-item flex items-center gap-3 px-3 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-navy-800 transition-all border-l-4 border-transparent" data-href="#/visualization">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
          <span class="font-medium sidebar-text whitespace-nowrap">Leak Visualization</span>
        </a>

        <a href="#/analysis" class="sidebar-item flex items-center gap-3 px-3 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-navy-800 transition-all border-l-4 border-transparent" data-href="#/analysis">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          <span class="font-medium sidebar-text whitespace-nowrap">Signal Analysis</span>
        </a>

        <a href="#/reports" class="sidebar-item flex items-center gap-3 px-3 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-navy-800 transition-all border-l-4 border-transparent" data-href="#/reports">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
          <span class="font-medium sidebar-text whitespace-nowrap">Reports</span>
        </a>

        <a href="#/data-import" class="sidebar-item flex items-center gap-3 px-3 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-navy-800 transition-all border-l-4 border-transparent" data-href="#/data-import">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
          <span class="font-medium sidebar-text whitespace-nowrap">Data Import</span>
        </a>

        <a href="#/settings" class="sidebar-item flex items-center gap-3 px-3 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-navy-800 transition-all border-l-4 border-transparent mt-8" data-href="#/settings">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          <span class="font-medium sidebar-text whitespace-nowrap">Settings</span>
        </a>

      </nav>

      <!-- Bottom Toggle & Version -->
      <div class="p-4 border-t border-navy-700">
        <button id="sidebar-toggle" class="flex items-center justify-center w-full py-2 text-gray-500 hover:text-white hover:bg-navy-800 rounded-lg transition-colors">
          <svg id="sidebar-chevron" class="transition-transform duration-300" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <div class="mt-4 text-center text-xs text-gray-600 sidebar-text">
          PipeGuard v1.0
        </div>
      </div>

    </div>
  `;
}

export function initSidebar() {
  const toggleBtn = document.getElementById('sidebar-toggle');
  const wrapper = document.getElementById('sidebar-wrapper');
  const chevron = document.getElementById('sidebar-chevron');
  const textElements = document.querySelectorAll('.sidebar-text');
  
  let isCollapsed = false;

  if (toggleBtn && wrapper) {
    toggleBtn.addEventListener('click', () => {
      isCollapsed = !isCollapsed;
      
      if (isCollapsed) {
        wrapper.classList.remove('w-[260px]');
        wrapper.classList.add('w-[80px]');
        chevron.style.transform = 'rotate(180deg)';
        textElements.forEach(el => el.style.opacity = '0');
        setTimeout(() => textElements.forEach(el => el.classList.add('hidden')), 150);
      } else {
        wrapper.classList.remove('w-[80px]');
        wrapper.classList.add('w-[260px]');
        chevron.style.transform = 'rotate(0deg)';
        textElements.forEach(el => el.classList.remove('hidden'));
        setTimeout(() => textElements.forEach(el => el.style.opacity = '1'), 10);
      }
    });
  }
}
