export function createTopbar() {
  return `
    <div class="h-16 flex items-center justify-between px-6 bg-[#0a0e1a]/90 backdrop-blur-md border-b border-navy-700 z-40 sticky top-0">
      
      <!-- Left side: dynamic title -->
      <div class="flex items-center gap-4">
        <h1 id="topbar-title" class="text-xl font-semibold text-white tracking-wide">
          Dashboard
        </h1>
      </div>

      <!-- Right side: controls -->
      <div class="flex items-center gap-6">
        
        <!-- Live Monitoring Badge -->
        <div class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
          <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse-glow"></span>
          <span class="text-green-400 text-sm font-medium">System Active</span>
        </div>

        <!-- Divider -->
        <div class="h-6 w-px bg-navy-700 hidden sm:block"></div>

        <!-- Notifications -->
        <div class="relative group">
          <button class="relative p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-navy-800 focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            <span class="absolute top-1 right-1.5 flex h-4 w-4">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-4 w-4 bg-red-500 items-center justify-center text-[10px] text-white font-bold border border-[#0a0e1a]">1</span>
            </span>
          </button>
          
          <!-- Dropdown -->
          <div class="absolute right-0 mt-2 w-80 glass-card p-0 hidden group-hover:block hover:block z-50 transform origin-top-right transition-all">
            <div class="p-3 border-b border-navy-700 font-medium text-white flex justify-between items-center">
              Alerts & Notifications
              <span class="text-xs text-cyan-400 cursor-pointer hover:underline">Mark all read</span>
            </div>
            <div class="max-h-64 overflow-y-auto">
              <div class="p-3 border-b border-navy-700 hover:bg-navy-800/50 cursor-pointer transition-colors flex gap-3 items-start">
                <div class="w-2 h-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0 animate-pulse"></div>
                <div>
                  <p class="text-sm text-white font-medium">LEAK DETECTED: 207.24m</p>
                  <p class="text-xs text-gray-400 mt-0.5">High confidence signal from Logger 3</p>
                  <p class="text-xs text-gray-500 mt-1">Just now</p>
                </div>
              </div>
              <div class="p-3 border-b border-navy-700 hover:bg-navy-800/50 cursor-pointer transition-colors flex gap-3 items-start">
                <div class="w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></div>
                <div>
                  <p class="text-sm text-gray-300">System baseline calibrated</p>
                  <p class="text-xs text-gray-500 mt-1">2 hours ago</p>
                </div>
              </div>
            </div>
            <div class="p-2 text-center text-xs text-gray-400 hover:text-white cursor-pointer transition-colors">
              View all history
            </div>
          </div>
        </div>

        <!-- User Profile -->
        <div class="relative group cursor-pointer">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-teal-400 flex items-center justify-center text-white font-bold text-sm shadow-[0_0_10px_rgba(0,212,255,0.3)]">
              ST
            </div>
            <div class="hidden md:block">
              <p class="text-sm font-medium text-white leading-tight">Admin User</p>
              <p class="text-xs text-cyan-400 leading-tight">Lead Engineer</p>
            </div>
            <svg class="text-gray-400 hidden md:block" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </div>
          
          <!-- Dropdown -->
          <div class="absolute right-0 mt-2 w-48 glass-card p-2 hidden group-hover:block hover:block z-50 transform origin-top-right transition-all">
            <a href="#/settings" class="block px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-navy-800 rounded-lg transition-colors flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              Settings
            </a>
            <div class="h-px bg-navy-700 my-1 mx-2"></div>
            <a href="#/login" class="block px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
              Sign out
            </a>
          </div>
        </div>

      </div>
    </div>
  `;
}

export function initTopbar() {
  // Any interactive elements logic here
}
