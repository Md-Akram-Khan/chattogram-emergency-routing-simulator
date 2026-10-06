/* ==========================================================================
   MAIN APPLICATION CONTROLLER (APP.JS) - EXTENDED CHATTOGRAM METRO EDITION
   Handles 45 High-Density Nodes, 60+ Interconnected Paths, Instant Slider
   Reactivity, Prominent Beacon Markers, and Extended Preset Scenarios.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const state = {
    graph: window.CHATTOGRAM_GRAPH || window.DHAKA_GRAPH,
    startNodeId: "epz_circle",
    targetNodeId: "cmch",
    selectedAlgo: "astar",
    envState: {
      trafficLevel: 2.2,
      floodLevel: 1.2,
      timeOfDay: "night",
      season: "monsoon",
      safetyPriority: 1.5,
      blockedEdges: new Set(),
      blockedNodes: new Set()
    },
    map: null,
    nodeMarkers: {},
    edgePolylines: {},
    pathPolyline: null,
    animationTimer: null,
    currentResults: []
  };

  // -------------------------------------------------------------------------
  // 1. LEAFLET MAP & TILE INITIALIZATION (FULL CHATTOGRAM METRO)
  // -------------------------------------------------------------------------
  function initMap() {
    const googleStreets = L.tileLayer("https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
      attribution: '&copy; <a href="https://maps.google.com">Google Maps</a>',
      maxZoom: 20
    });

    const googleSatellite = L.tileLayer("https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}", {
      attribution: '&copy; <a href="https://maps.google.com">Google Maps Satellite</a>',
      maxZoom: 20
    });

    const googleTerrain = L.tileLayer("https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}", {
      attribution: '&copy; <a href="https://maps.google.com">Google Maps Terrain</a>',
      maxZoom: 20
    });

    const cartoDark = L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      subdomains: "abcd",
      maxZoom: 19
    });

    // Centered on Chattogram Metro (Lat 22.3450, Lng 91.8150)
    state.map = L.map("map", {
      center: [22.3450, 91.8150],
      zoom: 12.5,
      zoomControl: true,
      layers: [googleStreets]
    });

    const baseMaps = {
      "🗺️ Google Maps (Streets)": googleStreets,
      "🛰️ Google Maps (Satellite)": googleSatellite,
      "⛰️ Google Maps (Terrain)": googleTerrain,
      "🌙 Dark Command Center": cartoDark
    };

    L.control.layers(baseMaps, null, { position: 'topright' }).addTo(state.map);

    renderGraphOnMap();
  }

  // -------------------------------------------------------------------------
  // 2. DYNAMIC GRAPH & PROMINENT MARKERS MAP RENDERING
  // -------------------------------------------------------------------------
  function renderGraphOnMap() {
    Object.values(state.nodeMarkers).forEach(m => state.map.removeLayer(m));
    Object.values(state.edgePolylines).forEach(p => state.map.removeLayer(p.polyline));
    if (state.pathPolyline) {
      state.map.removeLayer(state.pathPolyline);
      state.pathPolyline = null;
    }
    state.nodeMarkers = {};
    state.edgePolylines = {};

    // Render Edges dynamically
    state.graph.edges.forEach(edge => {
      const uNode = state.graph.nodes[edge.u];
      const vNode = state.graph.nodes[edge.v];
      if (!uNode || !vNode) return;

      const isBlocked = state.envState.blockedEdges.has(edge.id);
      const edgeCost = DynamicCostSystem.calculateEdgeCost(edge, state.envState);

      let color = "#10b981"; // Green (Low cost)
      if (isBlocked) {
        color = "#ef4444"; // Red / Blocked
      } else if (edgeCost > 9.0) {
        color = "#ef4444"; // Crimson (Severe cost)
      } else if (edgeCost > 4.5) {
        color = "#f59e0b"; // Amber (Moderate)
      } else if (edge.road_type === "arterial") {
        color = "#00f2fe"; // Cyan Arterial
      }

      const polyline = L.polyline([[uNode.lat, uNode.lng], [vNode.lat, vNode.lng]], {
        color: color,
        weight: isBlocked ? 5 : (edge.road_type === "arterial" ? 4.5 : 3),
        opacity: isBlocked ? 0.95 : 0.75,
        dashArray: isBlocked ? "6, 6" : null
      }).addTo(state.map);

      polyline.bindPopup(`
        <div style="font-family: Inter, sans-serif; font-size: 0.85rem; padding: 4px;">
          <strong style="color: #00f2fe;">${edge.name}</strong><br/>
          <b>Distance:</b> ${edge.distance_km} km<br/>
          <b>Road Type:</b> ${edge.road_type.toUpperCase()}<br/>
          <b>Current Dynamic Cost:</b> <span style="color: ${color}; font-weight: bold; font-size: 1rem;">${edgeCost === Infinity ? 'BLOCKED ⛔' : edgeCost}</span><br/>
          <b>Tidal Flood Risk:</b> ${Math.round(edge.flood_susceptibility * 100)}%<br/>
          <b>Night Safety:</b> ${Math.round(edge.night_safety * 100)}%<br/>
          <button id="toggle-block-${edge.id}" class="btn-secondary" style="margin-top: 8px; padding: 5px 10px; font-size: 0.78rem;">
            ${isBlocked ? '🔓 Unblock Road' : '⛔ Block Road (Obstacle)'}
          </button>
        </div>
      `);

      polyline.on("popupopen", () => {
        const btn = document.getElementById(`toggle-block-${edge.id}`);
        if (btn) {
          btn.addEventListener("click", () => {
            if (state.envState.blockedEdges.has(edge.id)) {
              state.envState.blockedEdges.delete(edge.id);
            } else {
              state.envState.blockedEdges.add(edge.id);
            }
            state.map.closePopup();
            triggerDynamicRecalculation();
          });
        }
      });

      state.edgePolylines[edge.id] = { polyline, edge };
    });

    // Render Nodes with PROMINENT START & GOAL BEACON MARKERS
    Object.values(state.graph.nodes).forEach(node => {
      const isStart = (node.id === state.startNodeId);
      const isTarget = (node.id === state.targetNodeId);

      let customIcon;

      if (isStart) {
        customIcon = L.divIcon({
          className: "beacon-marker beacon-start",
          html: `
            <div class="beacon-ripple"></div>
            <div class="beacon-core">🏁</div>
            <div class="beacon-tag">START: ${node.name}</div>
          `,
          iconSize: [44, 44],
          iconAnchor: [22, 22]
        });
      } else if (isTarget) {
        customIcon = L.divIcon({
          className: "beacon-marker beacon-target",
          html: `
            <div class="beacon-ripple"></div>
            <div class="beacon-core">🏥</div>
            <div class="beacon-tag">GOAL: ${node.name}</div>
          `,
          iconSize: [44, 44],
          iconAnchor: [22, 22]
        });
      } else {
        customIcon = L.divIcon({
          className: "node-marker-standard",
          iconSize: [14, 14],
          iconAnchor: [7, 7]
        });
      }

      const marker = L.marker([node.lat, node.lng], {
        icon: customIcon,
        zIndexOffset: isStart || isTarget ? 1000 : 0
      }).addTo(state.map);

      marker.bindPopup(`
        <div style="font-family: Inter, sans-serif; font-size: 0.85rem; padding: 4px;">
          <strong style="color: #00f2fe; font-size: 0.95rem;">${node.name}</strong><br/>
          <span style="color: #94a3b8;">${node.description}</span><br/>
          <div style="margin-top: 10px; display: flex; gap: 6px;">
            <button id="set-start-${node.id}" class="btn-secondary" style="padding: 4px 8px; font-size: 0.75rem;">Set as Start 🏁</button>
            <button id="set-target-${node.id}" class="btn-secondary" style="padding: 4px 8px; font-size: 0.75rem;">Set as Goal 🏥</button>
          </div>
        </div>
      `);

      marker.on("popupopen", () => {
        const startBtn = document.getElementById(`set-start-${node.id}`);
        const targetBtn = document.getElementById(`set-target-${node.id}`);
        if (startBtn) {
          startBtn.addEventListener("click", () => {
            state.startNodeId = node.id;
            document.getElementById("select-start").value = node.id;
            state.map.closePopup();
            triggerDynamicRecalculation();
          });
        }
        if (targetBtn) {
          targetBtn.addEventListener("click", () => {
            state.targetNodeId = node.id;
            document.getElementById("select-target").value = node.id;
            state.map.closePopup();
            triggerDynamicRecalculation();
          });
        }
      });

      state.nodeMarkers[node.id] = marker;
    });
  }

  // -------------------------------------------------------------------------
  // 3. DYNAMIC RE-CALCULATION & SIMULATION ENGINE
  // -------------------------------------------------------------------------
  function triggerDynamicRecalculation() {
    renderGraphOnMap();
    runSimulation();
  }

  function runSimulation() {
    if (state.animationTimer) clearInterval(state.animationTimer);

    if (state.selectedAlgo === "all") {
      state.currentResults = window.GraphSearchSuite.runAllAlgorithms(
        state.startNodeId, state.targetNodeId, state.graph, state.envState
      );
      const best = state.currentResults.find(r => r.algoKey === "astar") || state.currentResults[0];
      animateSingleResult(best);
    } else {
      let res;
      switch (state.selectedAlgo) {
        case "bfs": res = window.GraphSearchSuite.runBFS(state.startNodeId, state.targetNodeId, state.graph, state.envState); break;
        case "dfs": res = window.GraphSearchSuite.runDFS(state.startNodeId, state.targetNodeId, state.graph, state.envState); break;
        case "ucs": res = window.GraphSearchSuite.runUCS(state.startNodeId, state.targetNodeId, state.graph, state.envState); break;
        case "ids": res = window.GraphSearchSuite.runIDS(state.startNodeId, state.targetNodeId, state.graph, state.envState); break;
        case "astar": res = window.GraphSearchSuite.runAStar(state.startNodeId, state.targetNodeId, state.graph, state.envState); break;
        case "gbfs": res = window.GraphSearchSuite.runGreedyBFS(state.startNodeId, state.targetNodeId, state.graph, state.envState); break;
      }
      state.currentResults = [res];
      animateSingleResult(res);
    }

    populateComparisonTable(state.currentResults);
    window.ChartEngine.renderBenchmarkCharts(
      state.selectedAlgo === "all" ? state.currentResults : window.GraphSearchSuite.runAllAlgorithms(
        state.startNodeId, state.targetNodeId, state.graph, state.envState
      )
    );
  }

  function animateSingleResult(result) {
    if (!result.found || result.path.length === 0) {
      document.getElementById("stat-cost").textContent = "NO PATH";
      document.getElementById("stat-dist").textContent = "--";
      document.getElementById("stat-time").textContent = "--";
      document.getElementById("stat-nodes").textContent = result.nodesExpanded;
      return;
    }

    document.getElementById("stat-cost").textContent = result.totalCost;
    document.getElementById("stat-dist").textContent = result.totalDistance + " km";
    document.getElementById("stat-time").textContent = result.estimatedTimeMins + " mins";
    document.getElementById("stat-nodes").textContent = result.nodesExpanded;

    highlightFinalPath(result.path);
  }

  function highlightFinalPath(path) {
    if (state.pathPolyline) {
      state.map.removeLayer(state.pathPolyline);
    }

    const latLngs = path.map(id => [state.graph.nodes[id].lat, state.graph.nodes[id].lng]);

    state.pathPolyline = L.polyline(latLngs, {
      color: "#00f2fe",
      weight: 7,
      opacity: 0.95,
      className: "animated-path-dash"
    }).addTo(state.map);

    const startNode = state.graph.nodes[path[0]];
    const targetNode = state.graph.nodes[path[path.length - 1]];
    if (startNode && targetNode) {
      const waypoints = path.slice(1, -1).map(id => `${state.graph.nodes[id].lat},${state.graph.nodes[id].lng}`).join('|');
      const gmapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${startNode.lat},${startNode.lng}&destination=${targetNode.lat},${targetNode.lng}${waypoints ? '&waypoints=' + encodeURIComponent(waypoints) : ''}&travelmode=driving`;
      
      const gmapsBtn = document.getElementById("btn-open-gmaps");
      if (gmapsBtn) {
        gmapsBtn.onclick = () => window.open(gmapsUrl, "_blank");
        gmapsBtn.style.display = "flex";
      }
    }
  }

  // -------------------------------------------------------------------------
  // 4. COMPARISON TABLE POPULATOR
  // -------------------------------------------------------------------------
  function populateComparisonTable(results) {
    const tbody = document.getElementById("table-results-body");
    if (!tbody) return;

    tbody.innerHTML = "";

    const minCost = Math.min(...results.map(r => r.totalCost));
    const minNodes = Math.min(...results.map(r => r.nodesExpanded));

    results.forEach(res => {
      const tr = document.createElement("tr");

      const isBestCost = res.totalCost === minCost && res.found;
      const isBestNodes = res.nodesExpanded === minNodes && res.found;

      tr.innerHTML = `
        <td>
          <span class="badge-algo" style="border: 1px solid var(--border-color);">
            ${res.algoName}
          </span>
          ${isBestCost ? '<span class="badge-win">Cost Optimal</span>' : ''}
          ${isBestNodes ? '<span class="badge-win" style="color:#00f2fe; border-color:#00f2fe;">Efficient</span>' : ''}
        </td>
        <td>
          <span style="color: ${res.found ? '#10b981' : '#ef4444'}; font-weight: 600;">
            ${res.found ? 'FOUND' : 'NO PATH'}
          </span>
        </td>
        <td style="font-family: var(--font-mono); font-weight: bold; color: var(--accent-cyan);">
          ${res.totalCost}
        </td>
        <td style="font-family: var(--font-mono);">
          ${res.totalDistance} km
        </td>
        <td style="font-family: var(--font-mono);">
          ${res.estimatedTimeMins} mins
        </td>
        <td style="font-family: var(--font-mono);">
          ${res.nodesExpanded}
        </td>
        <td style="font-family: var(--font-mono);">
          ${res.maxQueueSize}
        </td>
        <td style="font-family: var(--font-mono); color: var(--accent-amber);">
          ${res.executionTimeMs} ms
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  // -------------------------------------------------------------------------
  // 5. EVENT LISTENERS
  // -------------------------------------------------------------------------
  function bindEvents() {
    document.querySelectorAll(".nav-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
        document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));
        btn.classList.add("active");

        const tabId = btn.getAttribute("data-tab");
        const pane = document.getElementById(tabId);
        if (pane) pane.classList.add("active");

        if (tabId === "tab-map" && state.map) {
          setTimeout(() => state.map.invalidateSize(), 200);
        }
      });
    });

    const startSelect = document.getElementById("select-start");
    const targetSelect = document.getElementById("select-target");

    startSelect.innerHTML = "";
    targetSelect.innerHTML = "";

    // Sort nodes alphabetically for clear selection
    const sortedNodes = Object.values(state.graph.nodes).sort((a, b) => a.name.localeCompare(b.name));

    sortedNodes.forEach(n => {
      const opt1 = new Option(n.name, n.id);
      const opt2 = new Option(n.name, n.id);
      startSelect.add(opt1);
      targetSelect.add(opt2);
    });

    startSelect.value = state.startNodeId;
    targetSelect.value = state.targetNodeId;

    startSelect.addEventListener("change", (e) => {
      state.startNodeId = e.target.value;
      triggerDynamicRecalculation();
    });

    targetSelect.addEventListener("change", (e) => {
      state.targetNodeId = e.target.value;
      triggerDynamicRecalculation();
    });

    document.getElementById("select-algo").addEventListener("change", (e) => {
      state.selectedAlgo = e.target.value;
      triggerDynamicRecalculation();
    });

    const trafficSlider = document.getElementById("slider-traffic");
    const floodSlider = document.getElementById("slider-flood");

    trafficSlider.addEventListener("input", (e) => {
      state.envState.trafficLevel = parseFloat(e.target.value);
      document.getElementById("val-traffic").textContent = state.envState.trafficLevel + "x";
      triggerDynamicRecalculation();
    });

    floodSlider.addEventListener("input", (e) => {
      state.envState.floodLevel = parseFloat(e.target.value);
      document.getElementById("val-flood").textContent = state.envState.floodLevel + "m";
      triggerDynamicRecalculation();
    });

    document.querySelectorAll("[data-time]").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("[data-time]").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        state.envState.timeOfDay = btn.getAttribute("data-time");
        triggerDynamicRecalculation();
      });
    });

    document.getElementById("select-season").addEventListener("change", (e) => {
      state.envState.season = e.target.value;
      triggerDynamicRecalculation();
    });

    document.getElementById("btn-run-sim").addEventListener("click", () => {
      triggerDynamicRecalculation();
    });

    document.querySelectorAll("[data-preset]").forEach(btn => {
      btn.addEventListener("click", () => {
        const presetKey = btn.getAttribute("data-preset");
        applyPresetScenario(presetKey);
      });
    });

    document.getElementById("btn-export-csv").addEventListener("click", () => {
      exportResultsToCSV();
    });
  }

  function applyPresetScenario(key) {
    state.envState.blockedEdges.clear();

    switch (key) {
      case "monsoon-flood":
        state.startNodeId = "halishahar_block_l";
        state.targetNodeId = "cmch";
        state.envState.trafficLevel = 1.8;
        state.envState.floodLevel = 2.2;
        state.envState.timeOfDay = "day";
        state.envState.season = "monsoon";
        break;

      case "port-fire":
        state.startNodeId = "epz_circle";
        state.targetNodeId = "imperial_hosp";
        state.envState.trafficLevel = 3.2;
        state.envState.floodLevel = 0.0;
        state.envState.timeOfDay = "day";
        state.envState.season = "dry";
        break;

      case "midnight-cardiac":
        state.startNodeId = "chattogram_airport";
        state.targetNodeId = "evercare_hosp";
        state.envState.trafficLevel = 1.0;
        state.envState.floodLevel = 0.4;
        state.envState.timeOfDay = "night";
        state.envState.season = "winter";
        break;

      case "old-ctg-block":
        state.startNodeId = "khatunganj";
        state.targetNodeId = "cmch";
        state.envState.trafficLevel = 2.5;
        state.envState.floodLevel = 1.2;
        state.envState.blockedEdges.add("e23"); // Block Khatunganj Trade Lane
        break;

      case "bypass-route":
        state.startNodeId = "oxygen_depot";
        state.targetNodeId = "bitid_faujdarhat";
        state.envState.trafficLevel = 2.0;
        state.envState.floodLevel = 0.5;
        state.envState.timeOfDay = "day";
        state.envState.season = "dry";
        break;
    }

    document.getElementById("select-start").value = state.startNodeId;
    document.getElementById("select-target").value = state.targetNodeId;
    document.getElementById("slider-traffic").value = state.envState.trafficLevel;
    document.getElementById("val-traffic").textContent = state.envState.trafficLevel + "x";
    document.getElementById("slider-flood").value = state.envState.floodLevel;
    document.getElementById("val-flood").textContent = state.envState.floodLevel + "m";
    document.getElementById("select-season").value = state.envState.season;

    document.querySelectorAll("[data-time]").forEach(b => {
      if (b.getAttribute("data-time") === state.envState.timeOfDay) b.classList.add("active");
      else b.classList.remove("active");
    });

    triggerDynamicRecalculation();
  }

  function exportResultsToCSV() {
    if (state.currentResults.length === 0) return;

    let csv = "Algorithm,Found,Dynamic Cost,Distance (km),Estimated Time (mins),Nodes Expanded,Max Queue Size,Execution Time (ms)\n";
    state.currentResults.forEach(r => {
      csv += `"${r.algoName}",${r.found},${r.totalCost},${r.totalDistance},${r.estimatedTimeMins},${r.nodesExpanded},${r.maxQueueSize},${r.executionTimeMs}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chattogram_extended_benchmark_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  initMap();
  bindEvents();
  triggerDynamicRecalculation();
});
