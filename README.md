# 🚑 Chattogram Port City Emergency Vehicle Dispatch & Routing Simulator

An AI/ML simulation & decision-support web application for Emergency Vehicle Routing (Ambulance / Fire Service / Rescue) across **Chattogram Metropolitan Area (Port City, Bangladesh)**.

The application models dynamic urban constraints including **Monsoon Tidal Surge & Waterlogging (Jolaboddhota)**, **Chattogram Port Container Lorry Congestion**, **Hilly Terrain Landslide Risks**, and **Day vs Night Safety Penalties**. It evaluates **6 Graph Search Algorithms**: BFS, DFS, UCS, IDS, A*, and Greedy Best-First Search.

---

## 🌟 Features

- **45 High-Density Metropolitan Nodes**: Comprehensive coverage of major hospitals (CMCH, Evercare, Imperial, Max, General Hospital, BITID, USTC), port gates (Port Gate 1, Custom House, Saltgola, CEPZ), flyovers, coastal embankments in Halishahar, and highway bypasses.
- **60+ Interconnected Road Paths**: Multiple redundant loops, flyovers, narrow market galis, and bypasses allowing real-time dynamic rerouting.
- **Google Maps Integration**:
  - Toggle between **Google Maps (Streets)**, **Google Maps (Satellite)**, **Google Maps (Terrain)**, and Dark Command Center modes.
  - One-click **"Open Route in Google Maps"** to open turn-by-turn driving directions in Google Maps App/Browser.
- **Real-Time Dynamic Slider Reactivity**: Dragging Traffic, Flood depth, or Day/Night toggles instantly re-evaluates dynamic edge costs and updates map edge color coding in real-time:
  - 🟢 **Green**: Clear / Low Cost Road
  - 🟡 **Amber**: Moderate Traffic / Light Flood
  - 🔴 **Crimson**: Severe Congestion / Submerged Road
  - 🟣 **Purple**: Impassable / Blocked Road
- **Prominent Start & Goal Beacons**: Pulsing glowing markers with floating tags (`🏁 START` and `🏥 GOAL`).
- **Interactive Performance Benchmarks**:
  - Interactive Chart.js graphs (Nodes Expanded, Execution Time ms, Dynamic Cost vs Distance km, Multi-Criteria Radar Chart).
  - Comprehensive comparison matrix table with win badges.
  - **CSV Report Exporter**.

---

## 📐 Real Scenario Dynamic Cost & Heuristic Functions

### 1. Dynamic Edge Cost Function \(C(u, v)\)
$$C(u, v) = \text{Distance}(u, v) \times w_{\text{road}} \times \text{PortLorryTraffic} \times \text{TidalFloodFactor} \times \text{SafetyFactor} + \text{JunctionDelay}$$

- **Road Surface Weight (\(w_{\text{road}}\))**: Trunk Highway (0.9x), Avenue (1.0x), Street (1.25x), Old City Alley (1.70x), Damaged Surface (2.20x).
- **Port Lorry Congestion**: 1.0x to 3.5x with extra sensitivity near Port Gate 1, Saltgola, and CEPZ.
- **Tidal Waterlogging (Jolaboddhota)**: Evaluates high tide and rainwater accumulation in Halishahar, 2 No. Gate, Muradpur, and Agrabad C/A.
- **Day vs Night Safety Modifier**: Penalizes unlit narrow alleys in Andarkilla/Khatunganj during nighttime dispatch.

### 2. Admissible Heuristic Function \(H(n)\)
$$H(n, \text{Goal}) = \text{HaversineDistance}(n.\text{lat}, n.\text{lng}, \text{Goal}.\text{lat}, \text{Goal}.\text{lng}) \times 0.8$$

---

## 🔍 Implemented Graph Search Algorithms

1. **BFS (Breadth-First Search)**: Finds minimum hop count path; ignores traffic/flooding.
2. **DFS (Depth-First Search)**: Uninformed deep search; prone to sub-optimal paths in narrow alleys.
3. **UCS (Uniform Cost Search / Dijkstra)**: Guarantees dynamic cost optimal path.
4. **IDS (Iterative Deepening Search)**: Combines space efficiency of DFS with level completeness.
5. **A* Search**: Optimal informed search ($F = G + H$).
6. **Greedy Best-First Search**: Fast heuristic-guided search ($F = H$).

---

## 🚀 How to Run Locally

No external build tools or server installation required. Simply clone and open:

```bash
# Clone repository
git clone https://github.com/Md-Akram-Khan/chattogram-emergency-routing-simulator.git

# Navigate into directory
cd chattogram-emergency-routing-simulator

# Start Python HTTP Server
python -m http.server 8000
```

Open `http://localhost:8000` in your web browser.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.
