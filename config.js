// BIM Masterwheel — Full Configuration & Logic Specification

// ---------- GLOBALS ----------
const globalDivisionCount = 132;

// ---------- HELPER FUNCTIONS ----------
// Helper: Convert a list of weights into an array of cumulative angles
// matching the global division count. This is used so tiers sharing
// subdivisions can align perfectly without manually redefining angles.
function weightsToAngles(weights) {
  const step = 360 / globalDivisionCount;
  const angles = [];
  let index = 0;
  weights.forEach(weight => {
    for (let i = 0; i < weight; i++) {
      angles.push(index * step);
      index++;
    }
  });
  return angles;
}

// Base weights for T4 (33 segments × 4 divisions)
const t4Weights = Array(33).fill(4);

// Derive the starting angle of each of the 132 global divisions from T4
// so deeper tiers can share the exact boundary positions.
const t4DivisionAngles = weightsToAngles(t4Weights);

// Angles for each of the 33 primary T4 segments
const t4SegmentAngles = t4DivisionAngles.filter((_, i) => i % 4 === 0);

// Tier 3 weights (10 instinct blocks)
const t3Weights = [20, 12, 12, 12, 12, 12, 12, 12, 12, 16];

// Angles marking the start of each T3 block
const t3Angles = (() => {
  const total = t3Weights.reduce((a, b) => a + b, 0);
  const angles = [];
  let sum = 0;
  const step = 360 / total;
  t3Weights.forEach(w => {
    angles.push(sum * step);
    sum += w;
  });
  return angles;
})();

const renderOptions = {
  debugGuides: false,
  debugRenderOutlines: true,
  strokeDefaults: {
    normal: 0.25,
    wide: 1.0
  },
  fontDefaults: {
    fontFamily: "sans-serif"
  },
};

// ---------- TIER LIST ----------
/**
 * TIER CONTROL SYSTEM (T0 – T6)
 * Each tier defines radius, divisions, labels, styles, fill, and stroke logic.
 */
const tiers = [  // Master configuration for all wheel rings
  // Tier 0
  {
    key: "T0",
    outerRadius: 20,
    ringWidth: 20,
    rotationLocked: true,
    label: "Flow",
    labelStyle: {
      type: "centered",
      fontSize: 12,
      fontWeight: "bold",
      anchor: "middle",
      verticalAlign: "middle"
    },
    fill: {
      mode: "solid",
      startColor: "#ffffff",
      endColor: "#ffffff"
    },
    stroke: {
      show: true,
      width: renderOptions.strokeDefaults.wide,
      color: "#000000"
    },
    showLabels: true,
    visible: true
  },
  // Tier 1
  {
    key: "T1",
    innerRadius: 20,
    outerRadius: 40,
    rotationLocked: true,
    label: "Universal Objectives",
    labelStyle: {
      type: "arcText",
      fontSize: 10,
      fontWeight: "normal",
      anchor: "middle",
      verticalAlign: "middle",
      positionAngle: 180,
      radiusOffset: 0
    },
    fill: {
      mode: "solid",
      startColor: "#ffffff",
      endColor: "#ffffff"
    },
    stroke: { show: true, width: renderOptions.strokeDefaults.wide, color: "#000000" },
    showLabels: true,
    visible: true
  },
  // Tier 2
  {
    key: "T2",
    innerRadius: 40,
    outerRadius: 60,
    rotationLocked: true,
    label: "Lens of Experience",
    labelStyle: {
      type: "arcText",
      fontSize: 10,
      fontWeight: "normal",
      anchor: "middle",
      verticalAlign: "middle",
      positionAngle: 180,
      radiusOffset: 0
    },
    fill: {
      mode: "solid",
      startColor: "#ffffff",
      endColor: "#ffffff"
    },
    stroke: { show: true, width: renderOptions.strokeDefaults.wide },
    showLabels: true,
    visible: true
  },
  // Tier 3
  {
    key: "T3",
    innerRadius: 60,
    outerRadius: 120,
    rotationLocked: false,
    divisionWeights: [20, 12, 12, 12, 12, 12, 12, 12, 12, 16],
    labelList: [
      "Fight", "Fight ↔ Flight", "Flight", "Flight ↔ Freeze",
      "Freeze", "Freeze ↔ Flop", "Flop", "Flop ↔ Friend",
      "Friend", "Friend ↔ Fight"
    ],
    labelStyle: {
      type: "radial",
      fontSize: 7,
      fontWeight: "bold",
      anchor: "middle",
      verticalAlign: "middle"
    },
    fill: {
      mode: "manual",
      colorList: [
        "#e03636", "#ff8636", "#fef72c", "#77ff23",
        "#39c65c", "#68afe3", "#3699f8", "#4a45ff",
        "#b336f8", "#d736af"
      ]
    },
    stroke: {
      show: true,
      width: renderOptions.strokeDefaults.wide,
      every: 1,
      includeFirst: true
    },
    showLabels: true,
    visible: true
  },
  // Tier 4
  {
    key: "T4",
    innerRadius: 120,
    outerRadius: 500,
    rotationLocked: false,
    divisionWeights: t4Weights,
    labelList: [
      "Aggression", "Confrontation", "Dominance", "Defensiveness", "Retaliation",
    "Reactive Evasion", "Chaotic Engagement", "Defensive Provocation",
    "Withdrawal", "Avoidance", "Evasion",
    "Anxious Withdrawal", "Hesitant Escape", "Overwhelmed Avoidance",
    "Shutdown", "Dissociation", "Immobilization",
    "Compliant Dissociation", "Passive Appeasement", "Fearful Merging",
    "Compliance", "People-Pleasing", "Appeasement",
    "Over-Attached Caretaking", "Sacrificial Bonding", "Hyper-Social Seeking",
    "Nurturing", "Bond-Building", "Support",
    "Protective Nurturing", "Boundary Enforcing Care", "Assertive Support", "Directive Help"
     ],
    labelStyle: {
      type: "radial",
      fontSize: 6,
      fontWeight: "bold",
      anchor: "middle",
      verticalAlign: "middle",
      offset: -140
    },
    fill: {
      mode: "gradient-manual",
      gradientPairs: [
       // red
       ["#e03636","#e44f50"],
       ["#e03636","#e44f50"],
       ["#e03636","#e44f50"],
       ["#e03636","#e44f50"],
       ["#e03636","#e44f50"],
       // orange
       ["#ff8636","#fe9d5c"],
       ["#ff8636","#fe9d5c"],
       ["#ff8636","#fe9d5c"],
       // yellow
       ["#fef72c","#fef958"],
       ["#fef72c","#fef958"],
       ["#fef72c","#fef958"],
       // light-green
       ["#77ff23","#90ff4b"],
       ["#77ff23","#90ff4b"],
       ["#77ff23","#90ff4b"],
       // green
       ["#39c65c","#4fcd6e"],
       ["#39c65c","#4fcd6e"],
       ["#39c65c","#4fcd6e"],
       // light-blue
       ["#68afe3","#84bee8"],
       ["#68afe3","#84bee8"],
       ["#68afe3","#84bee8"],
       // blue
       ["#3699f8","#55a8f9"],
       ["#3699f8","#55a8f9"],
       ["#3699f8","#55a8f9"],
       // dark-blue
       ["#4a45ff","#6c67ff"],
       ["#4a45ff","#6c67ff"],
       ["#4a45ff","#6c67ff"],
       // purple
       ["#b336f8","#c361f9"],
       ["#b336f8","#c361f9"],
       ["#b336f8","#c361f9"],
       // magenta
       ["#d736af","#e062c1"],
       ["#d736af","#e062c1"],
       ["#d736af","#e062c1"],
       ["#d736af","#e062c1"]
     ]
    },
    stroke: {
      show: true,
      width: renderOptions.strokeDefaults.wide,
      normal: 0.25,
      wide: 1.0,
      every: 1,
      includeFirst: true
    },
    showLabels: true,
    visible: true
  },
  // Tier 5
  {
    key: "T5",
    innerRadius: 220,
    outerRadius: 250,
    rotationLocked: false,
    divisionWeights: t4DivisionAngles.map(() => 1),
    labelList: (() => {
      const mods = ["Light", "Mid", "High", "Intense"];
      return Array(33).fill(0).flatMap(() => mods);
    })(),
    labelStyle: {
      type: "radial",
      fontSize: 6,
      fontWeight: "lighter",
      anchor: "middle",
      verticalAlign: "middle"
    },
    fill: {
      mode: "solid",
      startColor: "#00000000",
      endColor: "#00000000"
    },
    overlay: {
      mode: "shade",
      color: "#000000",
      strength: .08
    },
    stroke: {
      show: true,
      width: renderOptions.strokeDefaults.wide
    },
    showLabels: true,
    visible: true
  },
  // Tier 6
  {
    key: "T6",
    innerRadius: 250,
    outerRadius: 500,
    rotationLocked: false,
    divisionWeights: t4DivisionAngles.map(() => 1),
    labelListSource: "behavior",
    availableSources: ["overlayContent"],
    labelStyle: {
      type: "radial",
      fontSize: 6,
      fontWeight: "normal",
      anchor: "start",
      verticalAlign: "middle"
    },
    fill: {
      mode: "solid",
      startColor: "#00000000",
      endColor: "#00000000"
    },
    overlay: {
      mode: "tint",
      color: "#ffffff",
      strength: .3
    },
    stroke: {
      show: true,
      width: renderOptions.strokeDefaults.wide
    },
    showLabels: true,
    visible: true
  }
];

// ---------- OVERLAY SETUP ----------
// Angles for T5 sub-division lines (based on T5 weights)
const t5Angles = (() => {
  const weights = tiers[5].divisionWeights;
  const total = weights.reduce((a, b) => a + b, 0);
  let sum = 0;
  return weights.map(w => {
    sum += w;
    return (sum / total) * 360;
  });
})();

// Skip every 4th T5 angle to avoid duplicate T4 boundaries
const filteredT5 = t5Angles.filter((_, i) => (i + 1) % 4 !== 0);

/**
 * OVERLAYS (Optional)
 */
const overlays = [
  {
    visible: true,
    type: "radialGradient",
    radiusRange: [120, 500],
    from: "#ffffff00",
    to: "#00000033"
     },
  {
    visible: true,
    type: "radialLines",
    angles: t3Angles,
    innerRadius: 60,
    radius: tiers[3].outerRadius,
    width: renderOptions.strokeDefaults.wide - 0.3,
    color: "#000"
  },
  {
    visible: true,
    type: "radialLines",
    angles: t4SegmentAngles,
    innerRadius: 120,
    radius: 500,
    width: renderOptions.strokeDefaults.wide-.3,
    color: "#000"
  },
  {
    visible: true,
    type: "radialLines",
    angles: filteredT5,
    innerRadius: tiers[5].innerRadius,
    radius: tiers[6].outerRadius,
    width: renderOptions.strokeDefaults.normal,
    color: "#000"
  },
  {
    visible: true,
    type: 'ringOutline',
    radius: 220,
    width: renderOptions.strokeDefaults.wide,
    color: '#000'
  },
  {
    visible: true,
    type: 'ringOutline',
    radius: 250,
    width: renderOptions.strokeDefaults.wide,
    color: '#000'
  },
  {
    visible: true,
    type: 'ringOutline',
    radius: 500,
    width: renderOptions.strokeDefaults.wide,
    color: '#000'
  }
];

// `radialLines` overlays draw straight lines from `innerRadius` to `radius`
// at each angle provided. `innerRadius` defaults to 0 if omitted.

// ---------- FINAL EXPORT ----------
/**
 * EXPORT FULL CONFIG
 */
export const wheelConfig = {
  centerX: 500,
  centerY: 500,
  globalDivisionCount,
  renderOptions,
  tiers,
  overlays,
  availableSources: ["overlayContent"]
};
