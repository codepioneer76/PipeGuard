export const PIPELINE_DATA = {
  pipelineLength: 500, // meters
  timeDelay: 0.0668, // seconds
  waveVelocity: 1280, // m/s
  correlationCoefficient: 0.8688,
  leakDistanceAP1: 207.2368, // meters from Access Point 1 (calculated: (500 - 1280 * 0.0668) / 2)
  leakDistanceAP2: 292.7632, // meters from Access Point 2 (calculated: 500 - 207.2368)
  leakPositionPercent: 41.4474, // percentage position on pipeline (207.2368/500 * 100)
  leakStatus: 'LEAK DETECTED',
  monitoringState: 'Active',
  dominantFrequencyBand: '500-510 Hz',
  correlationConfidence: 86.88, // percentage
  logger3Label: 'Logger 3',
  logger4Label: 'Logger 4',
  accessPoint1Label: 'Access Point 1',
  accessPoint2Label: 'Access Point 2',
};

// Generate Logger 3 Filtered Spectrum data
// Sharp spike at ~505 Hz, near-zero elsewhere, peak power ~2.0 x 10^4
export function generateLogger3Spectrum() {
  const data = [];
  for (let f = 0; f <= 1000; f += 1) {
    let power = 0;
    // Create sharp peak at 505 Hz
    const dist = Math.abs(f - 505);
    if (dist < 3) {
      power = 20000 * Math.exp(-dist * dist / 0.8);
    } else if (dist < 15) {
      power = 800 * Math.exp(-dist * dist / 30);
    } else {
      power = Math.random() * 50;
    }
    data.push([f, power]);
  }
  return data;
}

// Generate Logger 4 Filtered Spectrum data
// Sharp spike at ~505 Hz, near-zero elsewhere, peak power ~3.0 x 10^4
export function generateLogger4Spectrum() {
  const data = [];
  for (let f = 0; f <= 1000; f += 1) {
    let power = 0;
    const dist = Math.abs(f - 505);
    if (dist < 3) {
      power = 30000 * Math.exp(-dist * dist / 0.8);
    } else if (dist < 15) {
      power = 1200 * Math.exp(-dist * dist / 30);
    } else {
      power = Math.random() * 80;
    }
    data.push([f, power]);
  }
  return data;
}

// Generate Cross Correlation data
// Noisy signal from -10 to +10 seconds, with dominant peak near 0.0668s
// Correlation coefficient range -1 to 1
export function generateCrossCorrelationData() {
  const data = [];
  const step = 0.01;
  for (let t = -10; t <= 10; t += step) {
    let cc = 0;
    // Background noise - decaying oscillation
    const absT = Math.abs(t);
    if (absT < 5) {
      cc = (Math.random() - 0.5) * 0.15 * Math.exp(-absT * 0.3);
      // Add some oscillatory component
      cc += 0.05 * Math.sin(t * 15) * Math.exp(-absT * 0.5);
      cc += 0.03 * Math.sin(t * 30) * Math.exp(-absT * 0.8);
    } else {
      cc = (Math.random() - 0.5) * 0.03;
    }
    // Strong peak near 0.0668 seconds
    const peakDist = Math.abs(t - 0.0668);
    if (peakDist < 0.5) {
      cc += 0.8688 * Math.exp(-peakDist * peakDist / 0.002);
    }
    // Smaller negative peak
    const negPeakDist = Math.abs(t + 0.0668);
    if (negPeakDist < 0.5) {
      cc -= 0.4 * Math.exp(-negPeakDist * negPeakDist / 0.003);
    }
    // Clamp to -1, 1
    cc = Math.max(-1, Math.min(1, cc));
    data.push([parseFloat(t.toFixed(4)), parseFloat(cc.toFixed(6))]);
  }
  return data;
}
