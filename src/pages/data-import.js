import * as XLSX from 'xlsx';

let fileInput = null;
let dropZone = null;
let dragOverHandler = null;
let dragLeaveHandler = null;
let dropHandler = null;
let clickHandler = null;
let fileChangeHandler = null;

function createUploadIcon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 mx-auto mb-4 text-[#8892b0] group-hover:text-[#00d4ff] transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
    <path stroke-linecap="round" stroke-linejoin="round" d="M12 16V4m0 0L8 8m4-4l4 4" />
    <path stroke-linecap="round" stroke-linejoin="round" d="M20 16.7428C21.2215 15.734 22 14.2079 22 12.5C22 9.46243 19.5376 7 16.5 7C16.2815 7 16.0771 6.886 15.9661 6.69774C14.6621 4.48484 12.2544 3 9.5 3C5.35786 3 2 6.35786 2 10.5C2 12.5661 2.83545 14.4371 4.18362 15.7935" />
  </svg>`;
}

function parseExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        resolve(jsonData);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

function renderParsedTable(container, data) {
  if (!data || data.length === 0) return;

  const headers = data[0];
  const rows = data.slice(1).filter(row => row.some(cell => cell !== undefined && cell !== ''));

  const expectedHeaders = ['Parameter', 'Label', 'Value', 'Units'];
  const isExpectedFormat = expectedHeaders.every((h, i) =>
    headers[i] && headers[i].toString().toLowerCase() === h.toLowerCase()
  );

  const tableEl = document.getElementById('pg-parsed-table');
  if (!tableEl) return;

  tableEl.innerHTML = `
    <div class="animate-fade-in-up">
      <h3 class="text-xl font-semibold text-white mb-1">Parsed Data</h3>
      <p class="text-sm text-[#8892b0] mb-4">${rows.length} records found ${isExpectedFormat ? '— <span class="text-[#00e676]">Format matched</span>' : ''}</p>
      <div class="overflow-x-auto rounded-xl border border-[#1e2a45]">
        <table class="w-full text-sm text-left">
          <thead>
            <tr class="bg-[#0a0e1a]/80 border-b border-[#1e2a45]">
              ${headers.map(h => `<th class="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#00d4ff]">${h || ''}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${rows.map((row, i) => `
              <tr class="${i % 2 === 0 ? 'bg-[#131a2e]/60' : 'bg-[#0f1629]/60'} border-b border-[#1e2a45]/50 hover:bg-[#1e2a45]/40 transition-colors duration-200">
                ${headers.map((_, j) => {
                  const cell = row[j] !== undefined ? row[j] : '';
                  const isValueCol = isExpectedFormat && j === 2;
                  return `<td class="px-5 py-3 ${isValueCol ? 'text-[#00d4ff] font-semibold' : 'text-[#e8eaf6]'}">${cell}</td>`;
                }).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function handleFile(file, container) {
  if (!file) return;

  const ext = file.name.split('.').pop().toLowerCase();
  if (ext !== 'xlsx' && ext !== 'xls') {
    showUploadError('Please upload a valid .xlsx file');
    return;
  }

  const dropLabel = document.getElementById('pg-drop-label');
  if (dropLabel) {
    dropLabel.innerHTML = `
      <div class="flex items-center gap-3 text-[#00e676]">
        <svg class="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        <span>Processing ${file.name}...</span>
      </div>
    `;
  }

  parseExcelFile(file).then(data => {
    if (dropLabel) {
      dropLabel.innerHTML = `
        <div class="flex items-center gap-3 text-[#00e676]">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span>${file.name} — uploaded successfully</span>
        </div>
      `;
    }
    renderParsedTable(container, data);
  }).catch(() => {
    showUploadError('Failed to parse file. Please check the format.');
  });
}

function showUploadError(msg) {
  const dropLabel = document.getElementById('pg-drop-label');
  if (dropLabel) {
    dropLabel.innerHTML = `
      <div class="flex items-center gap-3 text-[#ff3d5a]">
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
        <span>${msg}</span>
      </div>
    `;
  }
}

export function renderDataImport(container) {
  container.innerHTML = `
    <div class="max-w-6xl mx-auto space-y-8">

      <!-- Page Header -->
      <div class="animate-fade-in-up">
        <h1 class="text-3xl md:text-4xl font-bold text-white tracking-tight">Data Import</h1>
        <p class="mt-2 text-[#8892b0] text-base">Import pipeline sensor data from Excel files</p>
      </div>

      <!-- Upload Zone -->
      <div class="animate-fade-in-up" style="animation-delay: 0.08s;">
        <div id="pg-drop-zone"
             class="group relative bg-[#131a2e]/70 backdrop-blur-xl border-2 border-dashed border-[#1e2a45] rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 hover:border-[#00d4ff] hover:shadow-[0_0_30px_rgba(0,212,255,0.1)]">
          ${createUploadIcon()}
          <div id="pg-drop-label">
            <p class="text-lg font-medium text-[#e8eaf6] mb-1">Drag & drop your .xlsx file here</p>
            <p class="text-sm text-[#8892b0]">or click to browse</p>
          </div>
          <input type="file" id="pg-file-input" accept=".xlsx,.xls" class="hidden" />
        </div>
      </div>

      <!-- Parsed Data Table -->
      <div id="pg-parsed-table"></div>

      <!-- Import History & Summary Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <!-- Import History -->
        <div class="lg:col-span-2 bg-[#131a2e]/70 backdrop-blur-xl border border-[#1e2a45] rounded-2xl p-6 animate-fade-in-up" style="animation-delay: 0.16s;">
          <h3 class="text-xl font-semibold text-white mb-5 flex items-center gap-2">
            <svg class="w-5 h-5 text-[#00d4ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Import History
          </h3>
          <div class="space-y-3">

            <!-- Entry 1 -->
            <div class="flex items-center justify-between bg-[#0a0e1a]/50 rounded-xl px-5 py-4 border border-[#1e2a45]/50 hover:border-[#1e2a45] transition-colors duration-200">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-lg bg-[#00e676]/10 flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-[#00e676]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-[#e8eaf6]">pipeline_data_2024.xlsx</p>
                  <p class="text-xs text-[#8892b0]">June 10, 2024 · 6 records</p>
                </div>
              </div>
              <span class="text-xs font-medium px-3 py-1 rounded-full bg-[#00e676]/10 text-[#00e676]">Success</span>
            </div>

            <!-- Entry 2 -->
            <div class="flex items-center justify-between bg-[#0a0e1a]/50 rounded-xl px-5 py-4 border border-[#1e2a45]/50 hover:border-[#1e2a45] transition-colors duration-200">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-lg bg-[#00e676]/10 flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-[#00e676]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-[#e8eaf6]">sensor_calibration.xlsx</p>
                  <p class="text-xs text-[#8892b0]">June 8, 2024 · 12 records</p>
                </div>
              </div>
              <span class="text-xs font-medium px-3 py-1 rounded-full bg-[#00e676]/10 text-[#00e676]">Success</span>
            </div>

            <!-- Entry 3 -->
            <div class="flex items-center justify-between bg-[#0a0e1a]/50 rounded-xl px-5 py-4 border border-[#1e2a45]/50 hover:border-[#1e2a45] transition-colors duration-200">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-lg bg-[#00e676]/10 flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-[#00e676]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-[#e8eaf6]">logger_raw_data.xlsx</p>
                  <p class="text-xs text-[#8892b0]">June 5, 2024 · 1,024 records</p>
                </div>
              </div>
              <span class="text-xs font-medium px-3 py-1 rounded-full bg-[#00e676]/10 text-[#00e676]">Success</span>
            </div>

          </div>
        </div>

        <!-- Import Summary Card -->
        <div class="bg-[#131a2e]/70 backdrop-blur-xl border border-[#1e2a45] rounded-2xl p-6 animate-fade-in-up" style="animation-delay: 0.24s;">
          <h3 class="text-xl font-semibold text-white mb-5 flex items-center gap-2">
            <svg class="w-5 h-5 text-[#00d4ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Import Summary
          </h3>
          <div class="space-y-5">
            <div class="flex items-center justify-between">
              <span class="text-sm text-[#8892b0]">Total Imports</span>
              <span class="text-lg font-bold text-white">3</span>
            </div>
            <div class="w-full h-px bg-[#1e2a45]"></div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-[#8892b0]">Last Import</span>
              <span class="text-sm font-medium text-[#e8eaf6]">June 10, 2024</span>
            </div>
            <div class="w-full h-px bg-[#1e2a45]"></div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-[#8892b0]">Total Records</span>
              <span class="text-lg font-bold text-[#00d4ff]">1,042</span>
            </div>
            <div class="w-full h-px bg-[#1e2a45]"></div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-[#8892b0]">Status</span>
              <span class="flex items-center gap-2 text-sm font-medium text-[#00e676]">
                <span class="w-2 h-2 rounded-full bg-[#00e676] animate-pulse"></span>
                All Successful
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  `;

  // Wire up drag-and-drop and file input
  dropZone = document.getElementById('pg-drop-zone');
  fileInput = document.getElementById('pg-file-input');

  dragOverHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.add('border-[#00d4ff]', 'bg-[#00d4ff]/5', 'shadow-[0_0_40px_rgba(0,212,255,0.15)]');
  };

  dragLeaveHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.remove('border-[#00d4ff]', 'bg-[#00d4ff]/5', 'shadow-[0_0_40px_rgba(0,212,255,0.15)]');
  };

  dropHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.remove('border-[#00d4ff]', 'bg-[#00d4ff]/5', 'shadow-[0_0_40px_rgba(0,212,255,0.15)]');
    const file = e.dataTransfer.files[0];
    handleFile(file, container);
  };

  clickHandler = () => {
    fileInput.click();
  };

  fileChangeHandler = (e) => {
    const file = e.target.files[0];
    handleFile(file, container);
  };

  dropZone.addEventListener('dragover', dragOverHandler);
  dropZone.addEventListener('dragleave', dragLeaveHandler);
  dropZone.addEventListener('drop', dropHandler);
  dropZone.addEventListener('click', clickHandler);
  fileInput.addEventListener('change', fileChangeHandler);
}

export function cleanupDataImport() {
  if (dropZone) {
    if (dragOverHandler) dropZone.removeEventListener('dragover', dragOverHandler);
    if (dragLeaveHandler) dropZone.removeEventListener('dragleave', dragLeaveHandler);
    if (dropHandler) dropZone.removeEventListener('drop', dropHandler);
    if (clickHandler) dropZone.removeEventListener('click', clickHandler);
  }
  if (fileInput && fileChangeHandler) {
    fileInput.removeEventListener('change', fileChangeHandler);
  }
  dropZone = null;
  fileInput = null;
  dragOverHandler = null;
  dragLeaveHandler = null;
  dropHandler = null;
  clickHandler = null;
  fileChangeHandler = null;
}
