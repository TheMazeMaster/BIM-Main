// BIM Masterwheel — Full Configuration & Logic Specification

/**
 * GLOBAL LOGIC OVERVIEW
 */
const globalDivisionCount = 132; // The full 360° wheel is divided into 132 equal radial segments

/**
 * TIER CONTROL SYSTEM
 * Each tier (T0 - T6) is defined by a config object.
 * Only outerRadius is set per tier; innerRadius is inferred from the previous tier.
 */
const tiers = [
  {
    key: "T0",
    outerRadius: 20,
    ringWidth: 20, // Explicit ring thickness control
    rotationLocked: true, // T0 does not rotate with the rest of the wheel

    label: "Flow",
    labelStyle: {
      type: "centered",       // Centered text in the circle
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
      width: 1.0,
      color: "#000000"
    },

    showLabels: true,
    visible: true
  },

  // T1 - T6 remain as before, to be updated next...
  // T5 and T6 now draw thin boundaries using `strokeDefaults.normal` on every
  // segment.
];

/**
 * GLOBAL OPTIONS
 */
const renderOptions = {
  debugGuides: false,
  debugRenderOutlines: true,
  strokeDefaults: {
    normal: 0.25,
    wide: 1.0
  },
  fontDefaults: {
    fontFamily: "sans-serif"
  }
};

/**
 * OVERLAY ENGINE (OPTIONAL)
 */
const overlays = [
  {
    visible: true,
    type: "radialGradient",
    radiusRange: [120, 500],
    from: "#ffffff00",
    to: "#00000033"
  }
];

// `radialLines` overlays draw straight lines from `innerRadius` to `radius`
// at each angle provided. `innerRadius` defaults to 0 if omitted.
// Angles are offset by the wheel's current rotation so lines stay aligned.
// Set `visible: false` on any overlay object to hide it without removing the
// configuration entry.
