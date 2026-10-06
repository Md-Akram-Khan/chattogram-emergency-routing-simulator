/* ==========================================================================
   DHAKA SOUTH GRAPH NETWORK DATASET
   Realistic node coordinates and edge metadata for emergency vehicle routing.
   ========================================================================== */

const DHAKA_GRAPH = {
  nodes: {
    "shahbagh": {
      id: "shahbagh",
      name: "Shahbagh Circle",
      type: "hub",
      lat: 23.7388,
      lng: 90.3957,
      description: "Major intersection & hospital zone (BSMMU / BIRDEM)"
    },
    "bsmmu": {
      id: "bsmmu",
      name: "BSMMU Hospital",
      type: "hospital",
      lat: 23.7395,
      lng: 90.3965,
      description: "Bangabandhu Sheikh Mujib Medical University Hospital"
    },
    "dmch": {
      id: "dmch",
      name: "Dhaka Medical College (DMCH)",
      type: "hospital",
      lat: 23.7258,
      lng: 90.3980,
      description: "Primary Apex Level Emergency Hospital in Dhaka"
    },
    "chankharpul": {
      id: "chankharpul",
      name: "Chankharpul Junction",
      type: "intersection",
      lat: 23.7245,
      lng: 90.3998,
      description: "Critical entry point to DMCH and Old Dhaka"
    },
    "palashi": {
      id: "palashi",
      name: "Palashi Intersection",
      type: "intersection",
      lat: 23.7272,
      lng: 90.3892,
      description: "BUET/DU campus junction connecting Azimpur"
    },
    "azimpur": {
      id: "azimpur",
      name: "Azimpur Bus Stand",
      type: "depot",
      lat: 23.7285,
      lng: 90.3812,
      description: "Dense residential corridor & emergency depot"
    },
    "new_market": {
      id: "new_market",
      name: "New Market Junction",
      type: "intersection",
      lat: 23.7330,
      lng: 90.3840,
      description: "High pedestrian shopping zone, frequent congestion"
    },
    "elephant_road": {
      id: "elephant_road",
      name: "Elephant Road",
      type: "intersection",
      lat: 23.7410,
      lng: 90.3875,
      description: "Commercial hardware & electronics market street"
    },
    "dhanmondi_32": {
      id: "dhanmondi_32",
      name: "Dhanmondi 32 Emergency Stn",
      type: "depot",
      lat: 23.7510,
      lng: 90.3775,
      description: "Western Dhaka South emergency ambulance hub"
    },
    "lalbagh": {
      id: "lalbagh",
      name: "Lalbagh Fort Area",
      type: "intersection",
      lat: 23.7189,
      lng: 90.3882,
      description: "Historic Old Dhaka sector with narrow galis"
    },
    "kamrangirchar": {
      id: "kamrangirchar",
      name: "Kamrangirchar Bridge",
      type: "intersection",
      lat: 23.7150,
      lng: 90.3720,
      description: "Riverbank entry point, high flood risk zone"
    },
    "bangshal": {
      id: "bangshal",
      name: "Bangshal Chowrasta",
      type: "intersection",
      lat: 23.7160,
      lng: 90.4070,
      description: "Bicycle & auto-parts market, narrow street"
    },
    "mitford": {
      id: "mitford",
      name: "Mitford Hospital (SSMC)",
      type: "hospital",
      lat: 23.7112,
      lng: 90.4010,
      description: "Sir Salimullah Medical College & Hospital, Buriganga bank"
    },
    "sadarghat": {
      id: "sadarghat",
      name: "Sadarghat Launch Terminal",
      type: "depot",
      lat: 23.7083,
      lng: 90.4103,
      description: "Southernmost water transit terminal, heavy waterlogging risk"
    },
    "ahsan_manzil": {
      id: "ahsan_manzil",
      name: "Ahsan Manzil / Islampur",
      type: "intersection",
      lat: 23.7086,
      lng: 90.4061,
      description: "Wholesale cloth market, extreme night visibility hazard"
    },
    "sutrapur": {
      id: "sutrapur",
      name: "Sutrapur Bazar",
      type: "intersection",
      lat: 23.7110,
      lng: 90.4150,
      description: "Old Dhaka residential market intersection"
    },
    "wari": {
      id: "wari",
      name: "Wari (Rankin Street)",
      type: "intersection",
      lat: 23.7180,
      lng: 90.4160,
      description: "Planned historical residential enclave in South Dhaka"
    },
    "gulistan": {
      id: "gulistan",
      name: "Gulistan Zero Point",
      type: "hub",
      lat: 23.7250,
      lng: 90.4125,
      description: "Central transit hub, major bus terminal & bottleneck"
    },
    "motijheel": {
      id: "motijheel",
      name: "Motijheel C/A",
      type: "hub",
      lat: 23.7320,
      lng: 90.4180,
      description: "Commercial Financial District, severe rush-hour gridlock"
    },
    "shapla_chattar": {
      id: "shapla_chattar",
      name: "Shapla Chattar",
      type: "intersection",
      lat: 23.7270,
      lng: 90.4190,
      description: "Motijheel central roundabout"
    },
    "tikatuli": {
      id: "tikatuli",
      name: "Tikatuli Ananda Bazar",
      type: "intersection",
      lat: 23.7210,
      lng: 90.4220,
      description: "Near Rajdhani Super Market & Fire Service Headquarters"
    },
    "sayedabad": {
      id: "sayedabad",
      name: "Sayedabad Bus Terminal",
      type: "depot",
      lat: 23.7155,
      lng: 90.4290,
      description: "Major inter-district highway bus station"
    },
    "jatrabari": {
      id: "jatrabari",
      name: "Jatrabari Chowrasta",
      type: "depot",
      lat: 23.7115,
      lng: 90.4350,
      description: "Eastern gateway to South Dhaka, Hanif Flyover base"
    },
    "khilgaon": {
      id: "khilgaon",
      name: "Khilgaon Flyover Junction",
      type: "intersection",
      lat: 23.7430,
      lng: 90.4250,
      description: "North-Eastern border junction of Dhaka South"
    },
    "kakrail": {
      id: "kakrail",
      name: "Kakrail Mosque Signal",
      type: "intersection",
      lat: 23.7370,
      lng: 90.4090,
      description: "Arterial link between Shahbagh, Motijheel, and Ramna"
    }
  },

  edges: [
    // Shahbagh Hub Connections
    { id: "e1", u: "shahbagh", v: "bsmmu", distance_km: 0.3, road_type: "arterial", flood_susceptibility: 0.05, night_safety: 0.95, junction_delay_sec: 20, name: "BSMMU Hospital Gate Road" },
    { id: "e2", u: "shahbagh", v: "kakrail", distance_km: 1.4, road_type: "arterial", flood_susceptibility: 0.1, night_safety: 0.9, junction_delay_sec: 60, name: "VIP Road (Ramna Corridor)" },
    { id: "e3", u: "shahbagh", v: "elephant_road", distance_km: 1.1, road_type: "avenue", flood_susceptibility: 0.2, night_safety: 0.85, junction_delay_sec: 45, name: "Elephant Road Connector" },
    { id: "e4", u: "shahbagh", v: "dmch", distance_km: 1.5, road_type: "avenue", flood_susceptibility: 0.3, night_safety: 0.8, junction_delay_sec: 50, name: "Secretariat Road to DMCH" },
    { id: "e5", u: "shahbagh", v: "palashi", distance_km: 1.6, road_type: "avenue", flood_susceptibility: 0.15, night_safety: 0.85, junction_delay_sec: 40, name: "DU Campus Main Road" },

    // DMCH & Chankharpul
    { id: "e6", u: "dmch", v: "chankharpul", distance_km: 0.4, road_type: "avenue", flood_susceptibility: 0.4, night_safety: 0.75, junction_delay_sec: 30, name: "Chankharpul DMCH Emergency Gate" },
    { id: "e7", u: "chankharpul", v: "gulistan", distance_km: 1.3, road_type: "avenue", flood_susceptibility: 0.5, night_safety: 0.7, junction_delay_sec: 65, name: "Nazimuddin Road to Gulistan" },
    { id: "e8", u: "chankharpul", v: "bangshal", distance_km: 1.1, road_type: "street", flood_susceptibility: 0.7, night_safety: 0.6, junction_delay_sec: 45, name: "Old Dhaka Nazimuddin Gali" },
    { id: "e9", u: "chankharpul", v: "palashi", distance_km: 1.0, road_type: "avenue", flood_susceptibility: 0.25, night_safety: 0.8, junction_delay_sec: 35, name: "Palashi Bypass" },

    // Palashi, Azimpur, Lalbagh, New Market
    { id: "e10", u: "palashi", v: "azimpur", distance_km: 0.8, road_type: "street", flood_susceptibility: 0.2, night_safety: 0.75, junction_delay_sec: 30, name: "Azimpur Road" },
    { id: "e11", u: "azimpur", v: "new_market", distance_km: 0.7, road_type: "avenue", flood_susceptibility: 0.4, night_safety: 0.8, junction_delay_sec: 55, name: "Mirpur Road (New Market Segment)" },
    { id: "e12", u: "azimpur", v: "lalbagh", distance_km: 1.2, road_type: "alley", flood_susceptibility: 0.65, night_safety: 0.5, junction_delay_sec: 40, name: "Lalbagh Road Gali" },
    { id: "e13", u: "new_market", v: "elephant_road", distance_km: 1.0, road_type: "avenue", flood_susceptibility: 0.3, night_safety: 0.85, junction_delay_sec: 50, name: "Science Lab Link Road" },
    { id: "e14", u: "elephant_road", v: "dhanmondi_32", distance_km: 1.8, road_type: "arterial", flood_susceptibility: 0.2, night_safety: 0.9, junction_delay_sec: 45, name: "Mirpur Road Arterial" },
    { id: "e15", u: "lalbagh", v: "kamrangirchar", distance_km: 1.5, road_type: "broken", flood_susceptibility: 0.85, night_safety: 0.4, junction_delay_sec: 50, name: "Kamrangirchar Dam Road" },
    { id: "e16", u: "lalbagh", v: "mitford", distance_km: 1.4, road_type: "alley", flood_susceptibility: 0.8, night_safety: 0.45, junction_delay_sec: 60, name: "Water Works Road (Mitford Gali)" },

    // Old Dhaka Core (Mitford, Sadarghat, Bangshal, Ahsan Manzil)
    { id: "e17", u: "mitford", v: "ahsan_manzil", distance_km: 0.6, road_type: "alley", flood_susceptibility: 0.9, night_safety: 0.4, junction_delay_sec: 40, name: "Islampur Narrow Market Gali" },
    { id: "e18", u: "ahsan_manzil", v: "sadarghat", distance_km: 0.5, road_type: "street", flood_susceptibility: 0.95, night_safety: 0.5, junction_delay_sec: 55, name: "Sadarghat Terminal Road" },
    { id: "e19", u: "bangshal", v: "mitford", distance_km: 0.9, road_type: "street", flood_susceptibility: 0.75, night_safety: 0.55, junction_delay_sec: 50, name: "Babu Bazar Bridge Ramp" },
    { id: "e20", u: "bangshal", v: "sutrapur", distance_km: 1.0, road_type: "street", flood_susceptibility: 0.7, night_safety: 0.6, junction_delay_sec: 40, name: "Malitola Road" },
    { id: "e21", u: "sadarghat", v: "sutrapur", distance_km: 0.7, road_type: "street", flood_susceptibility: 0.9, night_safety: 0.5, junction_delay_sec: 45, name: "Lalchand Mokim Lane" },

    // Gulistan, Motijheel, Wari, Tikatuli
    { id: "e22", u: "gulistan", v: "motijheel", distance_km: 1.2, road_type: "arterial", flood_susceptibility: 0.35, night_safety: 0.8, junction_delay_sec: 70, name: "Bangabandhu Avenue" },
    { id: "e23", u: "gulistan", v: "wari", distance_km: 1.0, road_type: "avenue", flood_susceptibility: 0.4, night_safety: 0.7, junction_delay_sec: 45, name: "Nawabpur Road" },
    { id: "e24", u: "motijheel", v: "shapla_chattar", distance_km: 0.5, road_type: "arterial", flood_susceptibility: 0.2, night_safety: 0.85, junction_delay_sec: 35, name: "Motijheel Main Boulevard" },
    { id: "e25", u: "shapla_chattar", v: "tikatuli", distance_km: 1.1, road_type: "avenue", flood_susceptibility: 0.3, night_safety: 0.75, junction_delay_sec: 40, name: "RK Mission Road" },
    { id: "e26", u: "wari", v: "tikatuli", distance_km: 0.6, road_type: "street", flood_susceptibility: 0.35, night_safety: 0.7, junction_delay_sec: 30, name: "Rankin Street" },
    { id: "e27", u: "sutrapur", v: "wari", distance_km: 0.8, road_type: "street", flood_susceptibility: 0.5, night_safety: 0.65, junction_delay_sec: 35, name: "Folderton Road" },

    // Sayedabad, Jatrabari, Khilgaon, Kakrail
    { id: "e28", u: "tikatuli", v: "sayedabad", distance_km: 1.0, road_type: "arterial", flood_susceptibility: 0.45, night_safety: 0.7, junction_delay_sec: 60, name: "Sayedabad Bus Terminal Approach" },
    { id: "e29", u: "sayedabad", v: "jatrabari", distance_km: 0.9, road_type: "arterial", flood_susceptibility: 0.6, night_safety: 0.65, junction_delay_sec: 75, name: "Mayor Hanif Flyover Ground Ramp" },
    { id: "e30", u: "motijheel", v: "khilgaon", distance_km: 2.1, road_type: "arterial", flood_susceptibility: 0.3, night_safety: 0.8, junction_delay_sec: 50, name: "Khilgaon Flyover Arterial" },
    { id: "e31", u: "kakrail", v: "motijheel", distance_km: 1.6, road_type: "arterial", flood_susceptibility: 0.2, night_safety: 0.85, junction_delay_sec: 55, name: "DIT Avenue" },
    { id: "e32", u: "kakrail", v: "khilgaon", distance_km: 1.8, road_type: "avenue", flood_susceptibility: 0.25, night_safety: 0.8, junction_delay_sec: 45, name: "Shantinagar Road" }
  ]
};

// Make dataset accessible globally or via module
if (typeof window !== 'undefined') {
  window.DHAKA_GRAPH = DHAKA_GRAPH;
}
