/* ==========================================================================
   CHART.JS VISUALIZATION ENGINE
   Renders performance graphs, node expansion metrics, execution times,
   and multi-criteria algorithm comparison radar charts.
   ========================================================================== */

const ChartEngine = {
  charts: {},

  /**
   * Initializes or updates all 4 benchmark charts with comparison data
   */
  renderBenchmarkCharts(results) {
    if (!results || results.length === 0) return;

    const labels = results.map(r => r.algoName.split(" ")[0]); // E.g. "BFS", "DFS", "UCS", "IDS", "A*", "Greedy"
    const colors = [
      "#3b82f6", // BFS
      "#8b5cf6", // DFS
      "#10b981", // UCS
      "#ec4899", // IDS
      "#00f2fe", // A*
      "#f59e0b"  // GBFS
    ];

    // Chart 1: Nodes Expanded Bar Chart
    this.renderNodesChart(labels, results.map(r => r.nodesExpanded), colors);

    // Chart 2: Execution Time (ms) Bar Chart
    this.renderTimeChart(labels, results.map(r => r.executionTimeMs), colors);

    // Chart 3: Dynamic Cost vs Physical Distance
    this.renderCostDistanceChart(labels, results.map(r => r.totalCost), results.map(r => r.totalDistance));

    // Chart 4: Radar Multi-Criteria Chart
    this.renderRadarChart(labels, results);
  },

  renderNodesChart(labels, data, colors) {
    const ctx = document.getElementById("chart-nodes");
    if (!ctx) return;

    if (this.charts.nodesChart) this.charts.nodesChart.destroy();

    this.charts.nodesChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [{
          label: "Nodes Expanded (Fewer is Better)",
          data: data,
          backgroundColor: colors.map(c => c + "99"),
          borderColor: colors,
          borderWidth: 1.5,
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: "#9ca3af", font: { family: "Inter" } } }
        },
        scales: {
          x: { ticks: { color: "#9ca3af" }, grid: { color: "rgba(255,255,255,0.05)" } },
          y: { ticks: { color: "#9ca3af" }, grid: { color: "rgba(255,255,255,0.05)" }, beginAtZero: true }
        }
      }
    });
  },

  renderTimeChart(labels, data, colors) {
    const ctx = document.getElementById("chart-time");
    if (!ctx) return;

    if (this.charts.timeChart) this.charts.timeChart.destroy();

    this.charts.timeChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [{
          label: "Execution Time (ms)",
          data: data,
          backgroundColor: colors.map(c => c + "99"),
          borderColor: colors,
          borderWidth: 1.5,
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: "#9ca3af", font: { family: "Inter" } } }
        },
        scales: {
          x: { ticks: { color: "#9ca3af" }, grid: { color: "rgba(255,255,255,0.05)" } },
          y: { ticks: { color: "#9ca3af" }, grid: { color: "rgba(255,255,255,0.05)" }, beginAtZero: true }
        }
      }
    });
  },

  renderCostDistanceChart(labels, costData, distanceData) {
    const ctx = document.getElementById("chart-cost-distance");
    if (!ctx) return;

    if (this.charts.costDistChart) this.charts.costDistChart.destroy();

    this.charts.costDistChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Total Dynamic Cost Metric",
            data: costData,
            backgroundColor: "rgba(0, 242, 254, 0.7)",
            borderColor: "#00f2fe",
            borderWidth: 1
          },
          {
            label: "Physical Distance (km)",
            data: distanceData,
            backgroundColor: "rgba(16, 185, 129, 0.7)",
            borderColor: "#10b981",
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: "#9ca3af", font: { family: "Inter" } } }
        },
        scales: {
          x: { ticks: { color: "#9ca3af" }, grid: { color: "rgba(255,255,255,0.05)" } },
          y: { ticks: { color: "#9ca3af" }, grid: { color: "rgba(255,255,255,0.05)" }, beginAtZero: true }
        }
      }
    });
  },

  renderRadarChart(labels, results) {
    const ctx = document.getElementById("chart-radar");
    if (!ctx) return;

    if (this.charts.radarChart) this.charts.radarChart.destroy();

    // Select top 3 benchmark contenders: UCS, A*, and BFS
    const ucs = results.find(r => r.algoKey === "ucs") || results[2];
    const astar = results.find(r => r.algoKey === "astar") || results[4];
    const gbfs = results.find(r => r.algoKey === "gbfs") || results[5];

    const maxCost = Math.max(...results.map(r => r.totalCost || 1));
    const maxNodes = Math.max(...results.map(r => r.nodesExpanded || 1));

    // Score out of 100
    const calcScore = (cost, nodes, time) => [
      Math.max(10, Math.round((1 - cost / (maxCost * 1.2)) * 100)),
      Math.max(10, Math.round((1 - nodes / (maxNodes * 1.2)) * 100)),
      Math.max(20, Math.round(100 - time * 10)),
      Math.round(85 - (cost * 2)),
      Math.round(90)
    ];

    this.charts.radarChart = new Chart(ctx, {
      type: "radar",
      data: {
        labels: ["Cost Optimality", "Node Efficiency", "Execution Speed", "Safety Score", "Completeness"],
        datasets: [
          {
            label: "A* Search",
            data: calcScore(astar.totalCost, astar.nodesExpanded, astar.executionTimeMs),
            borderColor: "#00f2fe",
            backgroundColor: "rgba(0, 242, 254, 0.2)"
          },
          {
            label: "UCS / Dijkstra",
            data: calcScore(ucs.totalCost, ucs.nodesExpanded, ucs.executionTimeMs),
            borderColor: "#10b981",
            backgroundColor: "rgba(16, 185, 129, 0.2)"
          },
          {
            label: "Greedy BFS",
            data: calcScore(gbfs.totalCost, gbfs.nodesExpanded, gbfs.executionTimeMs),
            borderColor: "#f59e0b",
            backgroundColor: "rgba(245, 158, 11, 0.2)"
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: "#9ca3af", font: { family: "Inter" } } }
        },
        scales: {
          r: {
            angleLines: { color: "rgba(255,255,255,0.1)" },
            grid: { color: "rgba(255,255,255,0.1)" },
            pointLabels: { color: "#9ca3af", font: { size: 11, family: "Inter" } },
            ticks: { display: false }
          }
        }
      }
    });
  }
};

if (typeof window !== 'undefined') {
  window.ChartEngine = ChartEngine;
}
