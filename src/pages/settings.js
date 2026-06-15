export function renderSettings(container) {
  container.innerHTML = `
    <div class="animate-fade-in-up">
      <header class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">Settings</h1>
        <p class="text-gray-400">System configuration and preferences</p>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <!-- Pipeline Configuration -->
        <div class="glass-card">
          <div class="flex items-center gap-3 mb-6">
            <svg class="text-cyan-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            <h2 class="text-xl font-semibold text-white">Pipeline Parameters</h2>
          </div>
          
          <form class="space-y-4" onsubmit="event.preventDefault()">
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1">Pipeline Length (m)</label>
              <input type="number" class="w-full input-field" value="500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1">Wave Velocity (m/s)</label>
              <input type="number" class="w-full input-field" value="1280">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1">Sampling Rate (Hz)</label>
              <input type="number" class="w-full input-field" value="44100">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1">Filter Band (Hz)</label>
              <div class="flex items-center gap-2">
                <input type="number" class="w-full input-field" value="500">
                <span class="text-gray-400">-</span>
                <input type="number" class="w-full input-field" value="510">
              </div>
            </div>
            <button type="submit" class="btn-primary w-full mt-2">Save Parameters</button>
          </form>
        </div>

        <!-- Notification Settings -->
        <div class="glass-card">
          <div class="flex items-center gap-3 mb-6">
            <svg class="text-cyan-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            <h2 class="text-xl font-semibold text-white">Notification Settings</h2>
          </div>
          
          <div class="space-y-5">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-white font-medium">Leak Detection Alerts</p>
                <p class="text-sm text-gray-400">Critical alerts when leak is found</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked class="sr-only peer">
                <div class="w-11 h-6 bg-navy-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
              </label>
            </div>
            
            <div class="flex items-center justify-between">
              <div>
                <p class="text-white font-medium">System Status Notifications</p>
                <p class="text-sm text-gray-400">Updates on logger connectivity</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked class="sr-only peer">
                <div class="w-11 h-6 bg-navy-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
              </label>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <p class="text-white font-medium">Email Reports</p>
                <p class="text-sm text-gray-400">Daily summary of pipeline status</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" class="sr-only peer">
                <div class="w-11 h-6 bg-navy-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
              </label>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <p class="text-white font-medium">SMS Alerts</p>
                <p class="text-sm text-gray-400">Text messages for critical alerts</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" class="sr-only peer">
                <div class="w-11 h-6 bg-navy-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
              </label>
            </div>
          </div>
        </div>

        <!-- Display Settings -->
        <div class="glass-card">
          <div class="flex items-center gap-3 mb-6">
            <svg class="text-cyan-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h4l3-9 5 18 3-9h5"/></svg>
            <h2 class="text-xl font-semibold text-white">Display Settings</h2>
          </div>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1">Theme</label>
              <div class="flex gap-4">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="theme" checked class="text-cyan-500 bg-navy-800 border-navy-700 focus:ring-cyan-500">
                  <span class="text-white">Dark Industrial</span>
                </label>
                <label class="flex items-center gap-2 cursor-not-allowed opacity-50">
                  <input type="radio" name="theme" disabled class="text-cyan-500 bg-navy-800 border-navy-700">
                  <span class="text-white">Light Mode (Coming Soon)</span>
                </label>
              </div>
            </div>
            
            <div class="pt-2">
               <div class="flex items-center justify-between">
                <div>
                  <p class="text-white font-medium">Chart Animations</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked class="sr-only peer">
                  <div class="w-11 h-6 bg-navy-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                </label>
              </div>
            </div>

            <div class="pt-2">
              <label class="block text-sm font-medium text-gray-400 mb-1">Auto-refresh Interval</label>
              <select class="w-full input-field appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%22%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%24%2024%22%20fill%3D%22none%22%20stroke%3D%22%238892b0%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_1rem_center] pr-10">
                <option>10 Seconds</option>
                <option selected>30 Seconds</option>
                <option>1 Minute</option>
                <option>5 Minutes</option>
                <option>Never (Manual)</option>
              </select>
            </div>
          </div>
        </div>

        <!-- About System -->
        <div class="glass-card">
          <div class="flex items-center gap-3 mb-6">
            <svg class="text-cyan-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            <h2 class="text-xl font-semibold text-white">About PipeGuard</h2>
          </div>
          
          <div class="space-y-4 text-sm">
            <div class="flex justify-between pb-2 border-b border-navy-700">
              <span class="text-gray-400">System Version</span>
              <span class="text-white font-medium">v1.0.0</span>
            </div>
            <div class="flex justify-between pb-2 border-b border-navy-700">
              <span class="text-gray-400">Build Date</span>
              <span class="text-white font-medium">2024.06.10</span>
            </div>
            <div class="flex justify-between pb-2 border-b border-navy-700">
              <span class="text-gray-400">Methodology</span>
              <span class="text-white font-medium text-right max-w-[200px]">Cross-Correlation Analysis via Acoustic Logging</span>
            </div>
            <div class="flex justify-between pb-2 border-b border-navy-700">
              <span class="text-gray-400">Technologies</span>
              <span class="text-white font-medium text-right">Vite, Tailwind v4, ECharts</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">License</span>
              <span class="text-cyan-400 font-medium">Research Use Only</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  `;
}

export function cleanupSettings() {
  // Nothing to clean up
}
