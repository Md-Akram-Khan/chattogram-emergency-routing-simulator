/* ==========================================================================
   GRAPH SEARCH ALGORITHMS SUITE
   Implementations of BFS, DFS, UCS, IDS, A*, and Greedy Best-First Search
   with real-time performance instrumentation & step visualization.
   ========================================================================== */

class PriorityQueue {
  constructor() {
    this.elements = [];
  }
  enqueue(element, priority) {
    this.elements.push({ element, priority });
    this.elements.sort((a, b) => a.priority - b.priority);
  }
  dequeue() {
    return this.elements.shift().element;
  }
  isEmpty() {
    return this.elements.length === 0;
  }
  size() {
    return this.elements.length;
  }
}

const GraphSearchSuite = {
  /**
   * Helper: Builds Adjacency List from DHAKA_GRAPH
   */
  getAdjacencyList(graph, envState) {
    const adj = {};
    Object.keys(graph.nodes).forEach(id => { adj[id] = []; });

    graph.edges.forEach(edge => {
      const cost = DynamicCostSystem.calculateEdgeCost(edge, envState);
      if (cost !== Infinity) {
        adj[edge.u].push({ neighbor: edge.v, edge: edge, cost: cost });
        adj[edge.v].push({ neighbor: edge.u, edge: edge, cost: cost });
      }
    });

    return adj;
  },

  /**
   * Helper: Calculates final path metrics (cost, distance, time)
   */
  calculatePathMetrics(path, graph, envState) {
    let totalCost = 0;
    let totalDistance = 0;

    for (let i = 0; i < path.length - 1; i++) {
      const u = path[i];
      const v = path[i + 1];
      const edge = graph.edges.find(e => (e.u === u && e.v === v) || (e.u === v && e.v === u));
      if (edge) {
        totalCost += DynamicCostSystem.calculateEdgeCost(edge, envState);
        totalDistance += edge.distance_km;
      }
    }

    const estimatedTimeMins = Math.round((totalDistance / 35.0 * 60) * (totalCost / (totalDistance || 1)) * 10) / 10;

    return {
      totalCost: Math.round(totalCost * 100) / 100,
      totalDistance: Math.round(totalDistance * 100) / 100,
      estimatedTimeMins: estimatedTimeMins
    };
  },

  // =========================================================================
  // 1. BREADTH-FIRST SEARCH (BFS)
  // =========================================================================
  runBFS(startId, targetId, graph, envState) {
    const startTime = performance.now();
    const adj = this.getAdjacencyList(graph, envState);
    const queue = [startId];
    const visited = new Set([startId]);
    const parent = {};
    const visitedNodesOrder = [];
    let maxQueueSize = 1;
    let nodesExpanded = 0;

    while (queue.length > 0) {
      maxQueueSize = Math.max(maxQueueSize, queue.length);
      const current = queue.shift();
      visitedNodesOrder.push(current);
      nodesExpanded++;

      if (current === targetId) {
        break;
      }

      for (const item of adj[current]) {
        if (!visited.has(item.neighbor)) {
          visited.add(item.neighbor);
          parent[item.neighbor] = current;
          queue.push(item.neighbor);
        }
      }
    }

    const endTime = performance.now();
    const found = visited.has(targetId);
    const path = [];

    if (found) {
      let curr = targetId;
      while (curr) {
        path.unshift(curr);
        curr = parent[curr];
      }
    }

    const metrics = this.calculatePathMetrics(path, graph, envState);

    return {
      algoName: "BFS (Breadth-First Search)",
      algoKey: "bfs",
      found: found,
      path: path,
      visitedNodesOrder: visitedNodesOrder,
      nodesExpanded: nodesExpanded,
      maxQueueSize: maxQueueSize,
      executionTimeMs: Math.round((endTime - startTime) * 1000) / 1000,
      totalCost: metrics.totalCost,
      totalDistance: metrics.totalDistance,
      estimatedTimeMins: metrics.estimatedTimeMins
    };
  },

  // =========================================================================
  // 2. DEPTH-FIRST SEARCH (DFS)
  // =========================================================================
  runDFS(startId, targetId, graph, envState) {
    const startTime = performance.now();
    const adj = this.getAdjacencyList(graph, envState);
    const stack = [startId];
    const visited = new Set();
    const parent = {};
    const visitedNodesOrder = [];
    let maxQueueSize = 1;
    let nodesExpanded = 0;

    while (stack.length > 0) {
      maxQueueSize = Math.max(maxQueueSize, stack.length);
      const current = stack.pop();

      if (!visited.has(current)) {
        visited.add(current);
        visitedNodesOrder.push(current);
        nodesExpanded++;

        if (current === targetId) {
          break;
        }

        for (const item of adj[current]) {
          if (!visited.has(item.neighbor)) {
            parent[item.neighbor] = current;
            stack.push(item.neighbor);
          }
        }
      }
    }

    const endTime = performance.now();
    const found = visited.has(targetId);
    const path = [];

    if (found) {
      let curr = targetId;
      while (curr) {
        path.unshift(curr);
        curr = parent[curr];
      }
    }

    const metrics = this.calculatePathMetrics(path, graph, envState);

    return {
      algoName: "DFS (Depth-First Search)",
      algoKey: "dfs",
      found: found,
      path: path,
      visitedNodesOrder: visitedNodesOrder,
      nodesExpanded: nodesExpanded,
      maxQueueSize: maxQueueSize,
      executionTimeMs: Math.round((endTime - startTime) * 1000) / 1000,
      totalCost: metrics.totalCost,
      totalDistance: metrics.totalDistance,
      estimatedTimeMins: metrics.estimatedTimeMins
    };
  },

  // =========================================================================
  // 3. UNIFORM COST SEARCH (UCS / Dijkstra)
  // =========================================================================
  runUCS(startId, targetId, graph, envState) {
    const startTime = performance.now();
    const adj = this.getAdjacencyList(graph, envState);
    const pq = new PriorityQueue();
    const gCost = {};
    const parent = {};
    const visitedNodesOrder = [];
    let maxQueueSize = 1;
    let nodesExpanded = 0;

    Object.keys(graph.nodes).forEach(id => { gCost[id] = Infinity; });
    gCost[startId] = 0;
    pq.enqueue(startId, 0);

    const visited = new Set();

    while (!pq.isEmpty()) {
      maxQueueSize = Math.max(maxQueueSize, pq.size());
      const current = pq.dequeue();

      if (visited.has(current)) continue;
      visited.add(current);
      visitedNodesOrder.push(current);
      nodesExpanded++;

      if (current === targetId) break;

      for (const item of adj[current]) {
        const newCost = gCost[current] + item.cost;
        if (newCost < gCost[item.neighbor]) {
          gCost[item.neighbor] = newCost;
          parent[item.neighbor] = current;
          pq.enqueue(item.neighbor, newCost);
        }
      }
    }

    const endTime = performance.now();
    const found = gCost[targetId] !== Infinity;
    const path = [];

    if (found) {
      let curr = targetId;
      while (curr) {
        path.unshift(curr);
        curr = parent[curr];
      }
    }

    const metrics = this.calculatePathMetrics(path, graph, envState);

    return {
      algoName: "UCS (Uniform Cost Search)",
      algoKey: "ucs",
      found: found,
      path: path,
      visitedNodesOrder: visitedNodesOrder,
      nodesExpanded: nodesExpanded,
      maxQueueSize: maxQueueSize,
      executionTimeMs: Math.round((endTime - startTime) * 1000) / 1000,
      totalCost: metrics.totalCost,
      totalDistance: metrics.totalDistance,
      estimatedTimeMins: metrics.estimatedTimeMins
    };
  },

  // =========================================================================
  // 4. ITERATIVE DEEPENING SEARCH (IDS)
  // =========================================================================
  runIDS(startId, targetId, graph, envState, maxDepth = 15) {
    const startTime = performance.now();
    const adj = this.getAdjacencyList(graph, envState);
    const visitedNodesOrder = [];
    let nodesExpanded = 0;
    let maxQueueSize = 1;
    let foundPath = null;

    const depthLimitedSearch = (node, target, depth, path, visitedThisBranch) => {
      visitedNodesOrder.push(node);
      nodesExpanded++;
      maxQueueSize = Math.max(maxQueueSize, path.length);

      if (node === target) return path;
      if (depth <= 0) return null;

      for (const item of adj[node]) {
        if (!visitedThisBranch.has(item.neighbor)) {
          visitedThisBranch.add(item.neighbor);
          const res = depthLimitedSearch(item.neighbor, target, depth - 1, [...path, item.neighbor], visitedThisBranch);
          if (res) return res;
          visitedThisBranch.delete(item.neighbor);
        }
      }
      return null;
    };

    for (let depth = 0; depth <= maxDepth; depth++) {
      const visitedThisBranch = new Set([startId]);
      foundPath = depthLimitedSearch(startId, targetId, depth, [startId], visitedThisBranch);
      if (foundPath) break;
    }

    const endTime = performance.now();
    const found = !!foundPath;
    const path = foundPath || [];
    const metrics = this.calculatePathMetrics(path, graph, envState);

    return {
      algoName: "IDS (Iterative Deepening Search)",
      algoKey: "ids",
      found: found,
      path: path,
      visitedNodesOrder: visitedNodesOrder,
      nodesExpanded: nodesExpanded,
      maxQueueSize: maxQueueSize,
      executionTimeMs: Math.round((endTime - startTime) * 1000) / 1000,
      totalCost: metrics.totalCost,
      totalDistance: metrics.totalDistance,
      estimatedTimeMins: metrics.estimatedTimeMins
    };
  },

  // =========================================================================
  // 5. A* SEARCH (A-Star)
  // =========================================================================
  runAStar(startId, targetId, graph, envState, weight = 1.0) {
    const startTime = performance.now();
    const adj = this.getAdjacencyList(graph, envState);
    const pq = new PriorityQueue();
    const gCost = {};
    const fCost = {};
    const parent = {};
    const visitedNodesOrder = [];
    let maxQueueSize = 1;
    let nodesExpanded = 0;

    Object.keys(graph.nodes).forEach(id => {
      gCost[id] = Infinity;
      fCost[id] = Infinity;
    });

    gCost[startId] = 0;
    const initialH = DynamicCostSystem.calculateHeuristic(startId, targetId, graph);
    fCost[startId] = initialH * weight;
    pq.enqueue(startId, fCost[startId]);

    const visited = new Set();

    while (!pq.isEmpty()) {
      maxQueueSize = Math.max(maxQueueSize, pq.size());
      const current = pq.dequeue();

      if (visited.has(current)) continue;
      visited.add(current);
      visitedNodesOrder.push(current);
      nodesExpanded++;

      if (current === targetId) break;

      for (const item of adj[current]) {
        const tentativeGCost = gCost[current] + item.cost;
        if (tentativeGCost < gCost[item.neighbor]) {
          parent[item.neighbor] = current;
          gCost[item.neighbor] = tentativeGCost;
          const hCost = DynamicCostSystem.calculateHeuristic(item.neighbor, targetId, graph);
          fCost[item.neighbor] = tentativeGCost + (hCost * weight);
          pq.enqueue(item.neighbor, fCost[item.neighbor]);
        }
      }
    }

    const endTime = performance.now();
    const found = gCost[targetId] !== Infinity;
    const path = [];

    if (found) {
      let curr = targetId;
      while (curr) {
        path.unshift(curr);
        curr = parent[curr];
      }
    }

    const metrics = this.calculatePathMetrics(path, graph, envState);

    return {
      algoName: "A* Search",
      algoKey: "astar",
      found: found,
      path: path,
      visitedNodesOrder: visitedNodesOrder,
      nodesExpanded: nodesExpanded,
      maxQueueSize: maxQueueSize,
      executionTimeMs: Math.round((endTime - startTime) * 1000) / 1000,
      totalCost: metrics.totalCost,
      totalDistance: metrics.totalDistance,
      estimatedTimeMins: metrics.estimatedTimeMins
    };
  },

  // =========================================================================
  // 6. GREEDY BEST-FIRST SEARCH (GBFS)
  // =========================================================================
  runGreedyBFS(startId, targetId, graph, envState) {
    const startTime = performance.now();
    const adj = this.getAdjacencyList(graph, envState);
    const pq = new PriorityQueue();
    const parent = {};
    const visitedNodesOrder = [];
    const visited = new Set();
    let maxQueueSize = 1;
    let nodesExpanded = 0;

    const initialH = DynamicCostSystem.calculateHeuristic(startId, targetId, graph);
    pq.enqueue(startId, initialH);

    while (!pq.isEmpty()) {
      maxQueueSize = Math.max(maxQueueSize, pq.size());
      const current = pq.dequeue();

      if (visited.has(current)) continue;
      visited.add(current);
      visitedNodesOrder.push(current);
      nodesExpanded++;

      if (current === targetId) break;

      for (const item of adj[current]) {
        if (!visited.has(item.neighbor)) {
          if (!parent[item.neighbor]) {
            parent[item.neighbor] = current;
          }
          const hCost = DynamicCostSystem.calculateHeuristic(item.neighbor, targetId, graph);
          pq.enqueue(item.neighbor, hCost);
        }
      }
    }

    const endTime = performance.now();
    const found = visited.has(targetId);
    const path = [];

    if (found) {
      let curr = targetId;
      while (curr) {
        path.unshift(curr);
        curr = parent[curr];
      }
    }

    const metrics = this.calculatePathMetrics(path, graph, envState);

    return {
      algoName: "Greedy Best-First Search",
      algoKey: "gbfs",
      found: found,
      path: path,
      visitedNodesOrder: visitedNodesOrder,
      nodesExpanded: nodesExpanded,
      maxQueueSize: maxQueueSize,
      executionTimeMs: Math.round((endTime - startTime) * 1000) / 1000,
      totalCost: metrics.totalCost,
      totalDistance: metrics.totalDistance,
      estimatedTimeMins: metrics.estimatedTimeMins
    };
  },

  /**
   * Runs all 6 algorithms simultaneously and returns comparison array
   */
  runAllAlgorithms(startId, targetId, graph, envState) {
    return [
      this.runBFS(startId, targetId, graph, envState),
      this.runDFS(startId, targetId, graph, envState),
      this.runUCS(startId, targetId, graph, envState),
      this.runIDS(startId, targetId, graph, envState),
      this.runAStar(startId, targetId, graph, envState),
      this.runGreedyBFS(startId, targetId, graph, envState)
    ];
  }
};

if (typeof window !== 'undefined') {
  window.GraphSearchSuite = GraphSearchSuite;
}
