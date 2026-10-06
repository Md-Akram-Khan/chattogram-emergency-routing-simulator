/* ==========================================================================
   CHATTOGRAM DYNAMIC COST & HEURISTIC EVALUATION SYSTEM
   Calculates dynamic cost values under Chattogram urban conditions:
   Tidal Waterlogging (Jolaboddhota), Port Lorry Traffic, Hill Slopes, & Night Safety.
   ========================================================================== */

const DynamicCostSystem = {
  defaultEnv: {
    trafficLevel: 2.2,       // 1.0 (Light), 1.5 (Moderate), 2.2 (Heavy Port Lorry), 3.5 (Gridlock)
    floodLevel: 1.2,         // 0.0 (None), 0.5 (Ankle), 1.2 (Knee - High Tide), 2.5 (Severe Inundation)
    timeOfDay: "night",      // "day" | "night"
    season: "monsoon",       // "dry" | "monsoon" | "winter"
    safetyPriority: 1.5,     // Safety weight multiplier
    blockedEdges: new Set(), // Blocked edge IDs
    blockedNodes: new Set()  // Blocked node IDs
  },

  /**
   * Calculates dynamic cost for traversing an edge in Chattogram City
   */
  calculateEdgeCost(edge, env = this.defaultEnv) {
    if (env.blockedEdges && env.blockedEdges.has(edge.id)) return Infinity;
    if (env.blockedNodes && (env.blockedNodes.has(edge.u) || env.blockedNodes.has(edge.v))) return Infinity;

    // 1. Road Surface & Capacity Weight (w_road)
    let w_road = 1.0;
    switch (edge.road_type) {
      case "arterial": w_road = 0.9; break;   // Wide Trunk Highway / CDA Avenue
      case "avenue":   w_road = 1.0; break;   // Main Avenue / Link Road
      case "street":   w_road = 1.25; break;  // Secondary Street
      case "alley":    w_road = 1.70; break;  // Narrow Old City Alley (Khatunganj / Andarkilla)
      case "broken":   w_road = 2.20; break;  // Damaged / Broken Surface
      default:         w_road = 1.2;
    }

    // 2. Traffic Multiplier (Port Container Lorry & Rush Hour Impact)
    const portSensitivity = (edge.name.includes("Port") || edge.name.includes("Saltgola")) ? 1.5 : 1.0;
    const trafficMultiplier = 1.0 + (env.trafficLevel * portSensitivity * (env.timeOfDay === "day" ? 1.0 : 0.6));

    // 3. Tidal Surge & Rain Waterlogging (Jolaboddhota Multiplier)
    const monsoonFactor = (env.season === "monsoon") ? 1.8 : 1.0;
    const floodMultiplier = 1.0 + (env.floodLevel * edge.flood_susceptibility * monsoonFactor);

    // 4. Day vs Night Safety Modifier
    let safetyMultiplier = 1.0;
    if (env.timeOfDay === "night") {
      const safetyDeficit = (1.0 - edge.night_safety);
      safetyMultiplier = 1.0 + (safetyDeficit * env.safetyPriority * 2.2);
    } else {
      safetyMultiplier = 1.0 + ((1.0 - edge.night_safety) * 0.15);
    }

    // 5. Junction & Signal Wait Delay
    const junctionDelayMins = (edge.junction_delay_sec / 60.0) * (env.timeOfDay === "day" ? 1.2 : 0.6);

    // Total Dynamic Cost = (Distance * RoadFactor * Traffic * Flood * Safety) + JunctionDelay
    const dynamicCost = (edge.distance_km * w_road * trafficMultiplier * floodMultiplier * safetyMultiplier) + junctionDelayMins;

    return Math.round(dynamicCost * 100) / 100;
  },

  /**
   * Calculates Haversine distance in kilometers
   */
  haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  },

  /**
   * Admissible Heuristic Function H(n) for A* and Greedy BFS
   */
  calculateHeuristic(nodeId, targetNodeId, graph = window.CHATTOGRAM_GRAPH) {
    if (!graph || !graph.nodes) graph = window.CHATTOGRAM_GRAPH || window.DHAKA_GRAPH;
    const sourceNode = graph.nodes[nodeId];
    const targetNode = graph.nodes[targetNodeId];

    if (!sourceNode || !targetNode) return 0;

    const straightDist = this.haversineDistance(
      sourceNode.lat, sourceNode.lng,
      targetNode.lat, targetNode.lng
    );

    return Math.round(straightDist * 0.8 * 100) / 100;
  }
};

if (typeof window !== 'undefined') {
  window.DynamicCostSystem = DynamicCostSystem;
}
