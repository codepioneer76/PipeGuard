export function renderReports(container) {
  container.innerHTML = `
    <div class="animate-fade-in-up">
      <header class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">Reports</h1>
        <p class="text-gray-400">Generate and export pipeline analysis reports</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Report Preview -->
        <div class="lg:col-span-2 space-y-6">
          <div class="glass-card">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-semibold text-white">Pipeline Leak Detection Report</h2>
              <span class="text-sm text-gray-400">Generated: ${new Date().toLocaleDateString()}</span>
            </div>
            
            <div class="bg-navy-900 rounded-xl p-6 border border-navy-700 h-[500px] overflow-y-auto custom-scrollbar">
              <!-- Report Content -->
              <div class="space-y-8">
                <!-- Header -->
                <div class="border-b border-navy-700 pb-4">
                  <h3 class="text-2xl font-bold text-white mb-1">System: PipeGuard v1.0</h3>
                  <p class="text-gray-400">IoT-Based Pipeline Leak Detection and Localization System</p>
                </div>

                <!-- 1. Executive Summary -->
                <section>
                  <h4 class="text-lg font-semibold text-cyan-400 mb-3">1. Executive Summary</h4>
                  <p class="text-gray-300 leading-relaxed">
                    Continuous acoustic monitoring of the 500m pipeline segment has identified a probable leak anomaly. Cross-correlation analysis of signals from Access Point 1 (Logger 3) and Access Point 2 (Logger 4) yields a high-confidence localization result.
                  </p>
                </section>

                <!-- 2. Pipeline Parameters -->
                <section>
                  <h4 class="text-lg font-semibold text-cyan-400 mb-3">2. Pipeline Parameters</h4>
                  <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                      <thead>
                        <tr class="bg-navy-800 text-gray-300">
                          <th class="p-3 border-b border-navy-700">Parameter</th>
                          <th class="p-3 border-b border-navy-700">Symbol</th>
                          <th class="p-3 border-b border-navy-700">Value</th>
                        </tr>
                      </thead>
                      <tbody class="text-gray-300">
                        <tr>
                          <td class="p-3 border-b border-navy-800">Pipeline Length</td>
                          <td class="p-3 border-b border-navy-800">d</td>
                          <td class="p-3 border-b border-navy-800">500 m</td>
                        </tr>
                        <tr class="bg-navy-800/50">
                          <td class="p-3 border-b border-navy-800">Time Delay</td>
                          <td class="p-3 border-b border-navy-800">td</td>
                          <td class="p-3 border-b border-navy-800">0.0668 s</td>
                        </tr>
                        <tr>
                          <td class="p-3 border-b border-navy-800">Wave Velocity</td>
                          <td class="p-3 border-b border-navy-800">c</td>
                          <td class="p-3 border-b border-navy-800">1280 m/s</td>
                        </tr>
                        <tr class="bg-navy-800/50">
                          <td class="p-3 border-b border-navy-800">Correlation Coeff.</td>
                          <td class="p-3 border-b border-navy-800">rxy</td>
                          <td class="p-3 border-b border-navy-800">0.8688</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>

                <!-- 3. Leak Detection Results -->
                <section>
                  <h4 class="text-lg font-semibold text-cyan-400 mb-3">3. Leak Detection Results</h4>
                  <div class="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <div class="flex items-center gap-3 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff3d5a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                      <span class="text-xl font-bold text-red-400">LEAK DETECTED</span>
                    </div>
                    <ul class="list-disc list-inside text-gray-300 space-y-1 ml-1">
                      <li>Distance from Access Point 1 (d₁): <strong class="text-white">207.24 m</strong></li>
                      <li>Distance from Access Point 2 (d₂): <strong class="text-white">292.76 m</strong></li>
                      <li>Localization Confidence: <strong class="text-white">86.88%</strong></li>
                    </ul>
                  </div>
                </section>

                 <!-- 4. Recommendations -->
                 <section>
                  <h4 class="text-lg font-semibold text-cyan-400 mb-3">4. Recommendations</h4>
                  <p class="text-gray-300 leading-relaxed">
                    Immediate physical inspection recommended at the 207m mark from Access Point 1. Acoustic signature strongly correlates with a high-pressure fluid escape.
                  </p>
                </section>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar Actions & History -->
        <div class="space-y-6">
          <div class="glass-card">
            <h3 class="text-lg font-semibold text-white mb-4">Export Options</h3>
            <div class="space-y-3">
              <button id="btn-export-pdf" class="w-full btn-primary flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                Export as PDF
              </button>
              <button class="w-full btn-secondary flex items-center justify-center gap-2 px-6 py-3 rounded-xl transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                Export as CSV Data
              </button>
              <button class="w-full btn-secondary flex items-center justify-center gap-2 px-6 py-3 rounded-xl transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
                Print Report
              </button>
            </div>
          </div>

          <div class="glass-card">
            <h3 class="text-lg font-semibold text-white mb-4">Recent Reports</h3>
            <div class="space-y-4">
              <div class="flex items-start justify-between p-3 rounded-lg hover:bg-navy-800 transition-colors cursor-pointer border border-transparent hover:border-navy-700">
                <div class="flex items-center gap-3">
                  <div class="bg-cyan-500/10 p-2 rounded-lg text-cyan-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-white">Analysis_Report_Jun10.pdf</p>
                    <p class="text-xs text-gray-400">Jun 10, 2024 • 2.4 MB</p>
                  </div>
                </div>
                <button class="text-gray-400 hover:text-cyan-400 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                </button>
              </div>

              <div class="flex items-start justify-between p-3 rounded-lg hover:bg-navy-800 transition-colors cursor-pointer border border-transparent hover:border-navy-700">
                <div class="flex items-center gap-3">
                  <div class="bg-cyan-500/10 p-2 rounded-lg text-cyan-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-white">Monthly_Summary_May.pdf</p>
                    <p class="text-xs text-gray-400">Jun 1, 2024 • 5.1 MB</p>
                  </div>
                </div>
                <button class="text-gray-400 hover:text-cyan-400 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Toast Notification Container -->
    <div id="toast-container" class="fixed bottom-4 right-4 z-50 flex flex-col gap-2"></div>
  `;

  // Bind Export PDF Button
  const btnExport = document.getElementById('btn-export-pdf');
  if (btnExport) {
    btnExport.addEventListener('click', () => {
      btnExport.innerHTML = `
        <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Generating PDF...
      `;
      
      // Simulate generation delay
      setTimeout(() => {
        btnExport.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
          Export as PDF
        `;
        showToast('Report generated successfully', 'success');
      }, 1500);
    });
  }
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = `glass-card flex items-center gap-3 px-4 py-3 shadow-lg transform transition-all duration-300 translate-y-full opacity-0 border-l-4 ${type === 'success' ? 'border-l-green-500' : 'border-l-cyan-500'}`;
  
  const icon = type === 'success' 
    ? `<svg class="text-green-500" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`
    : `<svg class="text-cyan-500" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;

  toast.innerHTML = `
    ${icon}
    <p class="text-white text-sm font-medium">${message}</p>
  `;
  
  container.appendChild(toast);
  
  // Animate in
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-full', 'opacity-0');
  });
  
  // Remove after 3s
  setTimeout(() => {
    toast.classList.add('translate-y-full', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

export function cleanupReports() {
  // Nothing to clean up
}
