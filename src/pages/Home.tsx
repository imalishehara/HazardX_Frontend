import React, { useRef, useState, useEffect, useCallback } from "react";
import districtGnDivisions from "../data/districtDivisionalSecretariats";
import DisasterMap from "../components/DisasterMap";

const rowsPerPage = 6;

function StatCard({
  icon,
  value,
  label,
  color,
  inView,
}: {
  icon: string;
  value: number;
  label: string;
  color: string;
  inView: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const end = value;
    if (start === end) return;
    const duration = 1200;
    const increment = Math.ceil(end / (duration / 16));
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <div className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
      <div
        className={`absolute inset-0 bg-gradient-to-r ${color} rounded-2xl opacity-0 group-hover:opacity-10 transition duration-300`}
      ></div>
      <div className="relative">
        <span className="text-4xl mb-4 block transform group-hover:scale-110 transition duration-300">
          {icon}
        </span>
        <h3 className="text-3xl font-bold text-gray-900 mb-2">
          {count.toLocaleString()}
        </h3>
        <p className="text-gray-600">{label}</p>
      </div>
    </div>
  );
}

interface Alert {
  id: number;
  type: string;
  severity: string;
  date: string;
  time: string;
  latitude: number;
  longitude: number;
  district?: string;
}

interface AidRequest {
  aid_id: number;
  full_name: string;
  type_support: string;
  request_type: string;
  district: string;
  divisional_secretariat: string;
  latitude: number;
  longitude: number;
  contact_no?: string;
}

export default function Home() {
  const [aidRequests, setAidRequests] = useState<AidRequest[]>([]);
  const [deliveredAidRequests, setDeliveredAidRequests] = useState<AidRequest[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const [showAlerts, setShowAlerts] = useState(true);
  const [showAidRequests, setShowAidRequests] = useState(true);
  const [showDeliveredAid, setShowDeliveredAid] = useState(true);

  const [activeVolunteers, setActiveVolunteers] = useState(0);
  const [alertsSent, setAlertsSent] = useState(0);
  const [aidDelivered, setAidDelivered] = useState(0);

  const [page, setPage] = useState(1);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedDivisionalSecretariat, setSelectedDivisionalSecretariat] = useState<string | null>(null);

  const aboutRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsInView, setStatsInView] = useState(false);

  const handleLearnMore = useCallback(() => {
    aboutRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setStatsInView(entry.isIntersecting),
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchAidRequests = async () => {
      try {
        const res = await fetch("http://localhost:5158/AidRequest/ongoing");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setAidRequests(data);
      } catch (err) {
        console.error("Error fetching aid requests:", err);
      }
    };
    fetchAidRequests();
  }, []);

  useEffect(() => {
    const fetchDeliveredAidRequests = async () => {
      try {
        const res = await fetch("http://localhost:5158/AidRequest/delivered");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setDeliveredAidRequests(data);
      } catch (err) {
        console.error("Error fetching delivered aid requests:", err);
      }
    };
    fetchDeliveredAidRequests();
  }, []);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetch("http://localhost:5158/Alerts/all");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        const savedDistrict = localStorage.getItem("selectedDistrict");
        setAlerts(savedDistrict ? data.filter((a: Alert) => a.district === savedDistrict) : data);
      } catch (err) {
        console.error("Error fetching alerts:", err);
      }
    };
    fetchAlerts();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [vol, alerts, aid] = await Promise.all([
          fetch("http://localhost:5158/active-volunteers-count"),
          fetch("http://localhost:5158/alerts-sent-count"),
          fetch("http://localhost:5158/total-aid-requests-count"),
        ]);
        if (!vol.ok || !alerts.ok || !aid.ok) throw new Error("Failed to fetch statistics");
        setActiveVolunteers((await vol.json()).count);
        setAlertsSent((await alerts.json()).count);
        setAidDelivered((await aid.json()).count);
      } catch (err) {
        console.error("Error fetching statistics:", err);
      }
    };
    fetchStats();
  }, []);

  const aidTypes = Array.from(new Set(aidRequests.map(r => r.type_support || r.request_type).filter(Boolean)));
  const districts = Object.keys(districtGnDivisions);

  const divisionalSecretariats = selectedDistrict
    ? districtGnDivisions[selectedDistrict] || []
    : Array.from(new Set(aidRequests.map(r => r.divisional_secretariat).filter(Boolean)));

  const filtered = aidRequests.filter(req => {
    return (
      (!selectedType || req.type_support === selectedType || req.request_type === selectedType) &&
      (!selectedDistrict || req.district === selectedDistrict) &&
      (!selectedDivisionalSecretariat || req.divisional_secretariat === selectedDivisionalSecretariat)
    );
  });

  const paginated = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  useEffect(() => {
    if (page > Math.ceil(filtered.length / rowsPerPage) && filtered.length > 0) {
      setPage(1);
    }
  }, [filtered, page]);

  const resetFilters = useCallback(() => {
    setSelectedType(null);
    setSelectedDistrict(null);
    setSelectedDivisionalSecretariat(null);
    setPage(1);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 pt-20">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 transform -skew-y-6"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-8">
              <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Disaster Tracking & Management System
              </h1>
              <p className="text-xl md:text-2xl text-gray-600">
                Empowering communities with real-time alerts, rapid response, and coordinated aid distribution.
              </p>
              <button
                onClick={handleLearnMore}
                className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-xl text-lg font-bold shadow hover:shadow-lg hover:-translate-y-1 transition"
              >
                Learn More
              </button>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="relative w-full max-w-lg">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-lg opacity-30"></div>
                <div className="relative bg-white p-2 rounded-2xl shadow-xl">
                  <img src="home.png" alt="Hero" className="w-full h-72 object-cover rounded-2xl shadow-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section ref={aboutRef} className="max-w-4xl mx-auto mb-16 scroll-mt-28">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mt-4">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">About the HazardX System</h2>
          <p className="text-lg text-gray-700 mb-4">
            Our system helps communities prepare for, respond to, and recover from disasters efficiently.
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Instant alerts for your area</li>
            <li>Report symptoms & request aid</li>
            <li>Track approved aid</li>
            <li>Access preparedness resources</li>
            <li>Connect with volunteers & officials</li>
          </ul>
        </div>
      </section>

        {/* Map */}
      <section className="w-full mb-16 max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Live Disaster Map</h2>
        <p className="text-lg text-gray-700 mb-6">
          View affected areas, aid requests, delivered aid, and active alerts.
        </p>

        <div className="flex gap-6 mb-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showAlerts}
              onChange={() => setShowAlerts(!showAlerts)}
            />
            Show Alerts
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showAidRequests}
              onChange={() => setShowAidRequests(!showAidRequests)}
            />
            Show Ongoing Aid Requests
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showDeliveredAid}
              onChange={() => setShowDeliveredAid(!showDeliveredAid)}
            />
            Show Delivered Aid
          </label>
        </div>

        <div className="w-full h-[600px] rounded-xl overflow-hidden shadow-lg">
          <DisasterMap
            approvedAidRequests={showAidRequests ? filtered : []}
            deliveredAidRequests={showDeliveredAid ? deliveredAidRequests : []}
            approvedAlerts={showAlerts ? alerts : []}
          />
        </div>
      </section>



      {/* Stats*/ }
      <section className="py-20 bg-white" ref={statsRef}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { label: "Active Volunteers", value: activeVolunteers, icon: "👥", color: "from-blue-500 to-blue-600" },
              { label: "Alerts Sent", value: alertsSent, icon: "🔔", color: "from-purple-500 to-purple-600" },
              { label: "Aid Requested", value: aidDelivered, icon: "✅", color: "from-green-500 to-green-600" },
            ].map(stat => (
              <StatCard key={stat.label} {...stat} inView={statsInView} />
            ))}
          </div>
        </div>
      </section>

     {/* Aid Table*/ }
<section className="w-full mt-12">
  <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
    <h2 className="text-2xl md:text-3xl font-bold mb-6 text-blue-800">Recent Aid Requests</h2>
    <div className="mb-6 bg-blue-50 rounded-xl p-4 flex flex-wrap gap-4 items-center">
      <span className="font-semibold text-gray-700">Filter by:</span>
      <select className="px-3 py-2 rounded-lg border" value={selectedType || ""} onChange={e => {
        setSelectedType(e.target.value || null);
        setPage(1);
      }}>
        <option value="">Request Type</option>
        {aidTypes.map(t => <option key={t} value={t}>{t}</option>)}
      </select>
      <select className="px-3 py-2 rounded-lg border" value={selectedDistrict || ""} onChange={e => {
        setSelectedDistrict(e.target.value || null);
        setSelectedDivisionalSecretariat(null);
        setPage(1);
      }}>
        <option value="">District</option>
        {districts.map(d => <option key={d} value={d}>{d}</option>)}
      </select>
      <select className="px-3 py-2 rounded-lg border" value={selectedDivisionalSecretariat || ""} onChange={e => {
        setSelectedDivisionalSecretariat(e.target.value || null);
        setPage(1);
      }}>
        <option value="">Divisional Secretariat</option>
        {divisionalSecretariats.map(ds => <option key={ds} value={ds}>{ds}</option>)}
      </select>
      <button onClick={resetFilters} className="px-4 py-2 bg-gray-200 rounded-lg font-semibold hover:bg-gray-300">
        Reset
      </button>
    </div>

    <div className="w-full overflow-x-auto">
      <table className="min-w-[900px] w-full divide-y divide-gray-200 rounded-xl overflow-hidden shadow">
        <thead className="bg-gradient-to-r from-blue-600 to-purple-600">
          <tr>
            {["#", "Recipient Name", "Request Type", "District", "Divisional Secretariat", "Contact No"].map(header => (
              <th key={header} className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {paginated.length === 0 ? (
            <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-400">No aid requests found.</td></tr>
          ) : paginated.map((req, idx) => (
            <tr key={req.aid_id}>
              <td className="px-6 py-4">{(page - 1) * rowsPerPage + idx + 1}</td>
              <td className="px-6 py-4 font-semibold text-blue-700">{req.full_name}</td>
              <td className="px-6 py-4">{req.type_support || req.request_type}</td>
              <td className="px-6 py-4">{req.district}</td>
              <td className="px-6 py-4">{req.divisional_secretariat}</td>
              <td className="px-6 py-4">{req.contact_no || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="px-6 py-4 bg-gray-50 border-t">
      <div className="flex justify-center space-x-1">
        {Array.from({ length: Math.ceil(filtered.length / rowsPerPage) }, (_, i) => (
          <button
            key={i}
            className={`px-4 py-2 border text-sm rounded-md ${page === i + 1 ? "bg-blue-600 text-white" : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"}`}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  </div>
</section>


     {/* Features Section with Modern Cards*/ }
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Key Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools and features to help communities prepare, respond, and recover from disasters
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Real-time Alerts',
                desc: 'Instant notifications about disasters and emergencies in your area',
                img: 'realtimealerts.jpg',
              },
              {
                title: 'Aid Coordination',
                desc: 'Efficient distribution of resources and support to affected areas',
                img: 'aid.jpg',
              },
              {
                title: 'Community Support',
                desc: 'Connect with volunteers and resources in your local community',
                img: 'volunteer.jpg',
              },
            ].map((feature, idx) => (
              <div 
                key={feature.title}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <img
                  src={feature.img}
                  alt={feature.title}
                  className="w-full h-40 object-cover rounded-xl mb-6 shadow"
                />
                <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  {/* Optionally keep the icon for extra visual, or remove if not needed */}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simple Footer with All Rights Reserved */}
      <footer className="bg-white border-t mt-8">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500">© 2025 HazardX Team. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}