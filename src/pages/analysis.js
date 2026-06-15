import * as echarts from 'echarts';
import { PIPELINE_DATA, generateLogger3Spectrum, generateLogger4Spectrum, generateCrossCorrelationData } from '../data/constants.js';

let chartInstances = [];
let resizeHandler = null;

export function renderAnalysis(container) {
  const spectrumData3 = generateLogger3Spectrum();
  const spectrumData4 = generateLogger4Spectrum();
  const crossCorrelationData = generateCrossCorrelationData();

  container.innerHTML = `
    <div class="space-y-8 pb-12">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white tracking-tight">Signal &amp; Correlation Analysis</h1>
        <p class="text-[#8892b0] mt-2 text-base">Frequency spectrum analysis and cross-correlation leak detection results</p>
      </div>

      <!-- Section A: Logger 3 Filtered Spectrum -->
      <div class="rounded-2xl bg-[#131a2e]/80 border border-[#1e2a45] backdrop-blur-xl shadow-lg p-6">
        <div class="mb-4">
          <h2 class="text-lg font-semibold text-white flex items-center gap-2">
            <span class="inline-block w-3 h-3 rounded-full bg-[#00d4ff]"></span>
            Logger 3 — Filtered Spectrum Analysis
          </h2>
          <p class="text-[#8892b0] text-sm mt-1 ml-5">Acoustic signal spectrum from Access Point 1</p>
        </div>
        <div id="chart-logger3-spectrum" style="width:100%;height:350px;"></div>
      </div>

      <!-- Section B: Logger 4 Filtered Spectrum -->
      <div class="rounded-2xl bg-[#131a2e]/80 border border-[#1e2a45] backdrop-blur-xl shadow-lg p-6">
        <div class="mb-4">
          <h2 class="text-lg font-semibold text-white flex items-center gap-2">
            <span class="inline-block w-3 h-3 rounded-full bg-[#00bfa6]"></span>
            Logger 4 — Filtered Spectrum Analysis
          </h2>
          <p class="text-[#8892b0] text-sm mt-1 ml-5">Acoustic signal spectrum from Access Point 2</p>
        </div>
        <div id="chart-logger4-spectrum" style="width:100%;height:350px;"></div>
      </div>

      <!-- Section C: Cross Correlation -->
      <div class="rounded-2xl bg-[#131a2e]/80 border border-[#1e2a45] backdrop-blur-xl shadow-lg p-6">
        <div class="mb-4">
          <h2 class="text-lg font-semibold text-white flex items-center gap-2">
            <span class="inline-block w-3 h-3 rounded-full bg-[#3b82f6]"></span>
            Cross Correlation Analysis (500–510 Hz)
          </h2>
          <p class="text-[#8892b0] text-sm mt-1 ml-5">Time-delay estimation between Logger 3 and Logger 4</p>
        </div>
        <div id="chart-cross-correlation" style="width:100%;height:400px;"></div>
      </div>

      <!-- Section D: Mathematical Analysis Panel -->
      <div class="rounded-2xl bg-[#131a2e]/80 border border-[#1e2a45] backdrop-blur-xl shadow-lg p-6">
        <div class="mb-6">
          <h2 class="text-lg font-semibold text-white flex items-center gap-2">
            <svg class="w-5 h-5 text-[#00d4ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
            </svg>
            Leak Localization — Mathematical Derivation
          </h2>
        </div>

        <!-- Leak Distance Formula -->
        <div class="mb-8">
          <h3 class="text-sm font-semibold text-[#8892b0] uppercase tracking-wider mb-3">Leak Distance Formula</h3>
          <div class="bg-[#0a0e1a] rounded-xl border border-[#1e2a45] p-5 text-center">
            <div class="text-2xl font-mono tracking-wide">
              <span class="text-[#00d4ff] italic">d</span><sub class="text-[#00d4ff]">1</sub>
              <span class="text-white mx-2">=</span>
              <span class="text-white">(</span>
              <span class="text-[#00d4ff] italic">d</span>
              <span class="text-white mx-1">−</span>
              <span class="text-[#00d4ff] italic">c</span>
              <span class="text-white mx-1">×</span>
              <span class="text-[#00d4ff] italic">t</span><sub class="text-[#00d4ff]">d</sub>
              <span class="text-white">)</span>
              <span class="text-white mx-1">/</span>
              <span class="text-white">2</span>
            </div>
          </div>
        </div>

        <!-- Variable Definitions -->
        <div class="mb-8">
          <h3 class="text-sm font-semibold text-[#8892b0] uppercase tracking-wider mb-3">Variable Definitions</h3>
          <div class="bg-[#0a0e1a] rounded-xl border border-[#1e2a45] overflow-hidden">
            <table class="w-full text-sm">
              <tbody>
                <tr class="border-b border-[#1e2a45]">
                  <td class="px-5 py-3 font-mono text-[#00d4ff] italic w-24">d</td>
                  <td class="px-5 py-3 text-[#8892b0]">Pipeline length</td>
                  <td class="px-5 py-3 text-white font-semibold text-right">500 m</td>
                </tr>
                <tr class="border-b border-[#1e2a45]">
                  <td class="px-5 py-3 font-mono text-[#00d4ff] italic">c</td>
                  <td class="px-5 py-3 text-[#8892b0]">Wave propagation velocity</td>
                  <td class="px-5 py-3 text-white font-semibold text-right">1,280 m/s</td>
                </tr>
                <tr>
                  <td class="px-5 py-3 font-mono text-[#00d4ff] italic">t<sub>d</sub></td>
                  <td class="px-5 py-3 text-[#8892b0]">Time delay from cross-correlation</td>
                  <td class="px-5 py-3 text-white font-semibold text-right">0.0668 s</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Step-by-Step Calculation -->
        <div class="mb-8">
          <h3 class="text-sm font-semibold text-[#8892b0] uppercase tracking-wider mb-3">Step-by-Step Calculation</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- d1 calculation -->
            <div class="bg-[#0a0e1a] rounded-xl border border-[#1e2a45] p-5">
              <div class="text-xs text-[#8892b0] uppercase tracking-wider mb-3 font-semibold">Distance from Logger 3 (d₁)</div>
              <div class="space-y-2 font-mono text-base">
                <div>
                  <span class="text-[#00d4ff] italic">d</span><sub class="text-[#00d4ff]">1</sub>
                  <span class="text-white"> = (</span>
                  <span class="text-[#00d4ff] italic">d</span>
                  <span class="text-white"> − </span>
                  <span class="text-[#00d4ff] italic">c</span>
                  <span class="text-white"> × </span>
                  <span class="text-[#00d4ff] italic">t</span><sub class="text-[#00d4ff]">d</sub>
                  <span class="text-white">) / 2</span>
                </div>
                <div>
                  <span class="text-[#00d4ff] italic">d</span><sub class="text-[#00d4ff]">1</sub>
                  <span class="text-white"> = (500 − 1280 × 0.0668) / 2</span>
                </div>
                <div>
                  <span class="text-[#00d4ff] italic">d</span><sub class="text-[#00d4ff]">1</sub>
                  <span class="text-white"> = (500 − 85.504) / 2</span>
                </div>
                <div>
                  <span class="text-[#00d4ff] italic">d</span><sub class="text-[#00d4ff]">1</sub>
                  <span class="text-white"> = 414.496 / 2</span>
                </div>
                <div class="pt-1 border-t border-[#1e2a45]">
                  <span class="text-[#00d4ff] italic">d</span><sub class="text-[#00d4ff]">1</sub>
                  <span class="text-white"> = </span>
                  <span class="text-[#00e676] font-bold text-lg">207.248 m</span>
                </div>
              </div>
            </div>
            <!-- d2 calculation -->
            <div class="bg-[#0a0e1a] rounded-xl border border-[#1e2a45] p-5">
              <div class="text-xs text-[#8892b0] uppercase tracking-wider mb-3 font-semibold">Distance from Logger 4 (d₂)</div>
              <div class="space-y-2 font-mono text-base">
                <div>
                  <span class="text-[#00d4ff] italic">d</span><sub class="text-[#00d4ff]">2</sub>
                  <span class="text-white"> = </span>
                  <span class="text-[#00d4ff] italic">d</span>
                  <span class="text-white"> − </span>
                  <span class="text-[#00d4ff] italic">d</span><sub class="text-[#00d4ff]">1</sub>
                </div>
                <div>
                  <span class="text-[#00d4ff] italic">d</span><sub class="text-[#00d4ff]">2</sub>
                  <span class="text-white"> = 500 − 207.248</span>
                </div>
                <div class="pt-1 border-t border-[#1e2a45]">
                  <span class="text-[#00d4ff] italic">d</span><sub class="text-[#00d4ff]">2</sub>
                  <span class="text-white"> = </span>
                  <span class="text-[#00e676] font-bold text-lg">292.752 m</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Final Result -->
        <div class="mb-8">
          <h3 class="text-sm font-semibold text-[#8892b0] uppercase tracking-wider mb-3">Final Result</h3>
          <div class="bg-[#0a0e1a] rounded-xl border-2 border-[#00e676]/40 p-5 space-y-3">
            <div class="flex items-start gap-3">
              <div class="w-2 h-2 rounded-full bg-[#00e676] mt-2 shrink-0"></div>
              <p class="text-white text-base">
                Leak localized at <span class="text-[#00e676] font-bold">207.24 m</span> from Access Point 1 (Logger 3)
              </p>
            </div>
            <div class="flex items-start gap-3">
              <div class="w-2 h-2 rounded-full bg-[#00e676] mt-2 shrink-0"></div>
              <p class="text-white text-base">
                Leak localized at <span class="text-[#00e676] font-bold">292.76 m</span> from Access Point 2 (Logger 4)
              </p>
            </div>
          </div>
        </div>

        <!-- Scientific Interpretation -->
        <div>
          <h3 class="text-sm font-semibold text-[#8892b0] uppercase tracking-wider mb-3">Scientific Interpretation</h3>
          <div class="bg-[#0a0e1a] rounded-xl border border-[#1e2a45] p-5 space-y-4">
            <div class="flex items-start gap-3">
              <svg class="w-4 h-4 text-[#00d4ff] mt-1 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              <p class="text-[#c8cde0] text-sm leading-relaxed">
                The cross-correlation coefficient of <span class="text-white font-semibold">0.8688</span> indicates a strong correlation between the two logger signals.
              </p>
            </div>
            <div class="flex items-start gap-3">
              <svg class="w-4 h-4 text-[#00d4ff] mt-1 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              <p class="text-[#c8cde0] text-sm leading-relaxed">
                This high confidence level confirms reliable leak detection and localization.
              </p>
            </div>
            <div class="flex items-start gap-3">
              <svg class="w-4 h-4 text-[#00d4ff] mt-1 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              <p class="text-[#c8cde0] text-sm leading-relaxed">
                The dominant frequency band of <span class="text-white font-semibold">500–510 Hz</span> is consistent with typical acoustic leak signatures in pressurized pipelines.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Initialize all charts
  initLogger3Chart(spectrumData3);
  initLogger4Chart(spectrumData4);
  initCrossCorrelationChart(crossCorrelationData);

  // Resize handler
  resizeHandler = () => {
    chartInstances.forEach(chart => {
      if (chart && !chart.isDisposed()) {
        chart.resize();
      }
    });
  };
  window.addEventListener('resize', resizeHandler);
}

function createTooltipConfig(unit1Label, unit2Label) {
  return {
    trigger: 'axis',
    backgroundColor: '#1a2340',
    borderColor: '#2a3a5c',
    borderWidth: 1,
    textStyle: {
      color: '#e8eaf6',
      fontSize: 13,
      fontFamily: 'Inter, sans-serif'
    },
    axisPointer: {
      type: 'cross',
      lineStyle: { color: '#2a3a5c' },
      crossStyle: { color: '#2a3a5c' }
    },
    formatter: function (params) {
      const p = params[0];
      return `<div style="font-family:Inter,sans-serif">
        <div style="color:#8892b0;margin-bottom:4px">${unit1Label}: <span style="color:#e8eaf6;font-weight:600">${Number(p.value[0]).toFixed(1)}</span></div>
        <div style="color:#8892b0">${unit2Label}: <span style="color:#e8eaf6;font-weight:600">${Number(p.value[1]).toFixed(2)}</span></div>
      </div>`;
    }
  };
}

function initLogger3Chart(data) {
  const el = document.getElementById('chart-logger3-spectrum');
  if (!el) return;

  const chart = echarts.init(el);
  chartInstances.push(chart);

  // Find peak
  let peakIdx = 0;
  let peakVal = -Infinity;
  data.forEach((d, i) => {
    if (d[1] > peakVal) {
      peakVal = d[1];
      peakIdx = i;
    }
  });
  const peakFreq = data[peakIdx][0];

  const option = {
    backgroundColor: 'transparent',
    animation: true,
    animationDuration: 1500,
    animationEasing: 'cubicOut',
    title: {
      text: 'Logger 3 Filtered Spectrum',
      left: 'center',
      top: 8,
      textStyle: {
        color: '#e8eaf6',
        fontSize: 15,
        fontWeight: 600,
        fontFamily: 'Inter, sans-serif'
      }
    },
    tooltip: createTooltipConfig('Frequency (Hz)', 'Power'),
    grid: {
      left: 80,
      right: 40,
      top: 60,
      bottom: 55
    },
    xAxis: {
      type: 'value',
      name: 'Frequency (Hz)',
      nameLocation: 'middle',
      nameGap: 35,
      nameTextStyle: {
        color: '#8892b0',
        fontSize: 13,
        fontFamily: 'Inter, sans-serif'
      },
      min: 0,
      max: 1000,
      axisLabel: {
        color: '#8892b0',
        fontSize: 11,
        fontFamily: 'Inter, sans-serif'
      },
      axisLine: {
        lineStyle: { color: '#2a3a5c' }
      },
      splitLine: {
        lineStyle: { color: '#1e2a45', type: 'dashed' }
      },
      axisTick: {
        lineStyle: { color: '#2a3a5c' }
      }
    },
    yAxis: {
      type: 'value',
      name: 'Power',
      nameTextStyle: {
        color: '#8892b0',
        fontSize: 13,
        fontFamily: 'Inter, sans-serif'
      },
      axisLabel: {
        color: '#8892b0',
        fontSize: 11,
        fontFamily: 'Inter, sans-serif',
        formatter: function (val) {
          if (val === 0) return '0';
          const exp = Math.floor(Math.log10(Math.abs(val)));
          const mantissa = val / Math.pow(10, exp);
          if (exp === 4) return mantissa.toFixed(1) + '×10⁴';
          if (exp === 3) return mantissa.toFixed(1) + '×10³';
          return val.toExponential(1);
        }
      },
      axisLine: {
        lineStyle: { color: '#2a3a5c' }
      },
      splitLine: {
        lineStyle: { color: '#1e2a45', type: 'dashed' }
      },
      axisTick: {
        lineStyle: { color: '#2a3a5c' }
      }
    },
    series: [
      {
        type: 'line',
        data: data,
        smooth: false,
        symbol: 'none',
        lineStyle: {
          color: '#00d4ff',
          width: 1.5
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0, 212, 255, 0.25)' },
            { offset: 1, color: 'rgba(0, 212, 255, 0.01)' }
          ])
        },
        markPoint: {
          data: [
            {
              coord: [peakFreq, peakVal],
              symbol: 'circle',
              symbolSize: 10,
              itemStyle: { color: '#00d4ff', borderColor: '#fff', borderWidth: 2 },
              label: {
                show: true,
                formatter: `Peak: ${Math.round(peakFreq)} Hz`,
                position: 'top',
                color: '#e8eaf6',
                fontSize: 12,
                fontWeight: 600,
                fontFamily: 'Inter, sans-serif',
                backgroundColor: '#1a2340',
                borderColor: '#00d4ff',
                borderWidth: 1,
                borderRadius: 4,
                padding: [4, 8]
              }
            }
          ],
          animation: true
        },
        markLine: {
          silent: true,
          symbol: 'none',
          data: [
            {
              xAxis: peakFreq,
              lineStyle: { color: '#00d4ff', type: 'dashed', width: 1, opacity: 0.4 }
            }
          ],
          label: { show: false }
        }
      }
    ],
    graphic: [
      {
        type: 'text',
        left: 100,
        bottom: 60,
        style: {
          text: 'Dominant leak frequency detected',
          fill: '#8892b0',
          fontSize: 11,
          fontFamily: 'Inter, sans-serif',
          fontStyle: 'italic'
        }
      }
    ]
  };

  chart.setOption(option);
}

function initLogger4Chart(data) {
  const el = document.getElementById('chart-logger4-spectrum');
  if (!el) return;

  const chart = echarts.init(el);
  chartInstances.push(chart);

  // Find peak
  let peakIdx = 0;
  let peakVal = -Infinity;
  data.forEach((d, i) => {
    if (d[1] > peakVal) {
      peakVal = d[1];
      peakIdx = i;
    }
  });
  const peakFreq = data[peakIdx][0];

  const option = {
    backgroundColor: 'transparent',
    animation: true,
    animationDuration: 1500,
    animationEasing: 'cubicOut',
    title: {
      text: 'Logger 4 Filtered Spectrum',
      left: 'center',
      top: 8,
      textStyle: {
        color: '#e8eaf6',
        fontSize: 15,
        fontWeight: 600,
        fontFamily: 'Inter, sans-serif'
      }
    },
    tooltip: createTooltipConfig('Frequency (Hz)', 'Power'),
    grid: {
      left: 80,
      right: 40,
      top: 60,
      bottom: 55
    },
    xAxis: {
      type: 'value',
      name: 'Frequency (Hz)',
      nameLocation: 'middle',
      nameGap: 35,
      nameTextStyle: {
        color: '#8892b0',
        fontSize: 13,
        fontFamily: 'Inter, sans-serif'
      },
      min: 0,
      max: 1000,
      axisLabel: {
        color: '#8892b0',
        fontSize: 11,
        fontFamily: 'Inter, sans-serif'
      },
      axisLine: {
        lineStyle: { color: '#2a3a5c' }
      },
      splitLine: {
        lineStyle: { color: '#1e2a45', type: 'dashed' }
      },
      axisTick: {
        lineStyle: { color: '#2a3a5c' }
      }
    },
    yAxis: {
      type: 'value',
      name: 'Power',
      nameTextStyle: {
        color: '#8892b0',
        fontSize: 13,
        fontFamily: 'Inter, sans-serif'
      },
      axisLabel: {
        color: '#8892b0',
        fontSize: 11,
        fontFamily: 'Inter, sans-serif',
        formatter: function (val) {
          if (val === 0) return '0';
          const exp = Math.floor(Math.log10(Math.abs(val)));
          const mantissa = val / Math.pow(10, exp);
          if (exp === 4) return mantissa.toFixed(1) + '×10⁴';
          if (exp === 3) return mantissa.toFixed(1) + '×10³';
          return val.toExponential(1);
        }
      },
      axisLine: {
        lineStyle: { color: '#2a3a5c' }
      },
      splitLine: {
        lineStyle: { color: '#1e2a45', type: 'dashed' }
      },
      axisTick: {
        lineStyle: { color: '#2a3a5c' }
      }
    },
    series: [
      {
        type: 'line',
        data: data,
        smooth: false,
        symbol: 'none',
        lineStyle: {
          color: '#00bfa6',
          width: 1.5
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0, 191, 166, 0.25)' },
            { offset: 1, color: 'rgba(0, 191, 166, 0.01)' }
          ])
        },
        markPoint: {
          data: [
            {
              coord: [peakFreq, peakVal],
              symbol: 'circle',
              symbolSize: 10,
              itemStyle: { color: '#00bfa6', borderColor: '#fff', borderWidth: 2 },
              label: {
                show: true,
                formatter: `Peak: ${Math.round(peakFreq)} Hz`,
                position: 'top',
                color: '#e8eaf6',
                fontSize: 12,
                fontWeight: 600,
                fontFamily: 'Inter, sans-serif',
                backgroundColor: '#1a2340',
                borderColor: '#00bfa6',
                borderWidth: 1,
                borderRadius: 4,
                padding: [4, 8]
              }
            }
          ],
          animation: true
        },
        markLine: {
          silent: true,
          symbol: 'none',
          data: [
            {
              xAxis: peakFreq,
              lineStyle: { color: '#00bfa6', type: 'dashed', width: 1, opacity: 0.4 }
            }
          ],
          label: { show: false }
        }
      }
    ],
    graphic: [
      {
        type: 'text',
        left: 100,
        bottom: 60,
        style: {
          text: 'Dominant leak frequency band: 500–510 Hz',
          fill: '#8892b0',
          fontSize: 11,
          fontFamily: 'Inter, sans-serif',
          fontStyle: 'italic'
        }
      }
    ]
  };

  chart.setOption(option);
}

function initCrossCorrelationChart(data) {
  const el = document.getElementById('chart-cross-correlation');
  if (!el) return;

  const chart = echarts.init(el);
  chartInstances.push(chart);

  // Find peak correlation
  let peakIdx = 0;
  let peakVal = -Infinity;
  data.forEach((d, i) => {
    if (d[1] > peakVal) {
      peakVal = d[1];
      peakIdx = i;
    }
  });
  const peakLag = data[peakIdx][0];
  const peakCorr = data[peakIdx][1];

  const option = {
    backgroundColor: 'transparent',
    animation: true,
    animationDuration: 1500,
    animationEasing: 'cubicOut',
    title: {
      text: 'Cross Correlation (500–510 Hz)',
      left: 'center',
      top: 8,
      textStyle: {
        color: '#e8eaf6',
        fontSize: 15,
        fontWeight: 600,
        fontFamily: 'Inter, sans-serif'
      }
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#1a2340',
      borderColor: '#2a3a5c',
      borderWidth: 1,
      textStyle: {
        color: '#e8eaf6',
        fontSize: 13,
        fontFamily: 'Inter, sans-serif'
      },
      axisPointer: {
        type: 'cross',
        lineStyle: { color: '#2a3a5c' },
        crossStyle: { color: '#2a3a5c' }
      },
      formatter: function (params) {
        const p = params[0];
        return `<div style="font-family:Inter,sans-serif">
          <div style="color:#8892b0;margin-bottom:4px">Lag Time: <span style="color:#e8eaf6;font-weight:600">${Number(p.value[0]).toFixed(4)} s</span></div>
          <div style="color:#8892b0">Correlation: <span style="color:#e8eaf6;font-weight:600">${Number(p.value[1]).toFixed(4)}</span></div>
        </div>`;
      }
    },
    grid: {
      left: 80,
      right: 50,
      top: 60,
      bottom: 55
    },
    xAxis: {
      type: 'value',
      name: 'Lag Time (s)',
      nameLocation: 'middle',
      nameGap: 35,
      nameTextStyle: {
        color: '#8892b0',
        fontSize: 13,
        fontFamily: 'Inter, sans-serif'
      },
      min: -10,
      max: 10,
      axisLabel: {
        color: '#8892b0',
        fontSize: 11,
        fontFamily: 'Inter, sans-serif'
      },
      axisLine: {
        lineStyle: { color: '#2a3a5c' }
      },
      splitLine: {
        lineStyle: { color: '#1e2a45', type: 'dashed' }
      },
      axisTick: {
        lineStyle: { color: '#2a3a5c' }
      }
    },
    yAxis: {
      type: 'value',
      name: 'Correlation Coefficient',
      nameTextStyle: {
        color: '#8892b0',
        fontSize: 13,
        fontFamily: 'Inter, sans-serif'
      },
      min: -1,
      max: 1,
      axisLabel: {
        color: '#8892b0',
        fontSize: 11,
        fontFamily: 'Inter, sans-serif'
      },
      axisLine: {
        lineStyle: { color: '#2a3a5c' }
      },
      splitLine: {
        lineStyle: { color: '#1e2a45', type: 'dashed' }
      },
      axisTick: {
        lineStyle: { color: '#2a3a5c' }
      }
    },
    series: [
      {
        type: 'line',
        data: data,
        smooth: false,
        symbol: 'none',
        lineStyle: {
          color: '#3b82f6',
          width: 1.5
        },
        markPoint: {
          data: [
            {
              coord: [peakLag, peakCorr],
              symbol: 'circle',
              symbolSize: 14,
              itemStyle: { color: '#ff3d5a', borderColor: '#fff', borderWidth: 2 },
              label: {
                show: true,
                formatter: `Peak: td = ${peakLag.toFixed(4)} s`,
                position: 'top',
                distance: 15,
                color: '#e8eaf6',
                fontSize: 12,
                fontWeight: 600,
                fontFamily: 'Inter, sans-serif',
                backgroundColor: '#1a2340',
                borderColor: '#ff3d5a',
                borderWidth: 1,
                borderRadius: 4,
                padding: [4, 8]
              }
            }
          ],
          animation: true
        },
        markLine: {
          silent: true,
          symbol: 'none',
          data: [
            {
              xAxis: peakLag,
              lineStyle: { color: '#ff3d5a', type: 'dashed', width: 1.5 },
              label: { show: false }
            },
            {
              yAxis: 0,
              lineStyle: { color: '#2a3a5c', type: 'solid', width: 1, opacity: 0.5 },
              label: { show: false }
            }
          ]
        }
      }
    ],
    graphic: [
      {
        type: 'group',
        right: 60,
        top: 70,
        children: [
          {
            type: 'rect',
            shape: { width: 320, height: 80, r: 6 },
            style: {
              fill: 'rgba(26, 35, 64, 0.92)',
              stroke: '#2a3a5c',
              lineWidth: 1
            }
          },
          {
            type: 'text',
            left: 12,
            top: 10,
            style: {
              text: 'Maximum correlation peak indicates time',
              fill: '#8892b0',
              fontSize: 11,
              fontFamily: 'Inter, sans-serif'
            }
          },
          {
            type: 'text',
            left: 12,
            top: 28,
            style: {
              text: 'delay between logger signals.',
              fill: '#8892b0',
              fontSize: 11,
              fontFamily: 'Inter, sans-serif'
            }
          },
          {
            type: 'text',
            left: 12,
            top: 50,
            style: {
              text: `td = ${peakLag.toFixed(4)} s,  rxy = ${peakCorr.toFixed(4)}`,
              fill: '#e8eaf6',
              fontSize: 12,
              fontWeight: 'bold',
              fontFamily: 'Inter, sans-serif'
            }
          }
        ]
      }
    ]
  };

  chart.setOption(option);
}

export function cleanupAnalysis() {
  // Dispose all chart instances
  chartInstances.forEach(chart => {
    if (chart && !chart.isDisposed()) {
      chart.dispose();
    }
  });
  chartInstances = [];

  // Remove resize handler
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler);
    resizeHandler = null;
  }
}
