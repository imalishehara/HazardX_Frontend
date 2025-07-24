import React, { useEffect, useState } from "react";
import districtDivisionalSecretariats from "../data/districtDivisionalSecretariats";

const disasterTypes = ["Flood", "Landslide", "Cyclone", "Drought", "Fire"];
const severityTypes = ["High", "Medium", "Low"];
const statusTypes = ["Ongoing", "Resolved"];

type Alert = {
  id: number;
  type: string;
  district: string;
  divisionalSecretariat: string; 
  severity: string;
  status: string;
  date: string;
  time: string;
};

export default function Alerts() {
  const [disasters, setDisasters] = useState<Alert[]>([]);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selecteddivisional_secretariat, setSelectedDivisionalSecretariat] = useState<string | null>(null);
  const [selectedSeverity, setSelectedSeverity] = useState<string | null>(null);

  const districts = Object.keys(districtDivisionalSecretariats);
  const dsOptions = selectedDistrict ? districtDivisionalSecretariats[selectedDistrict] : [];

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch("http://localhost:5158/Alerts/all");
        const data = await response.json();
        setDisasters(data);
      } catch (error) {
        console.error("Failed to fetch alerts:", error);
      }
    };

    fetchAlerts();
  }, []);

  const handleResetFilters = () => {
    setSelectedType(null);
    setSelectedDistrict(null);
    setSelectedDivisionalSecretariat(null);
    setSelectedSeverity(null);
    localStorage.removeItem("selectedDistrict");
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDistrict = e.target.value || null;
    setSelectedDistrict(newDistrict);
    setSelectedDivisionalSecretariat(null);

    if (newDistrict) {
      localStorage.setItem("selectedDistrict", newDistrict);
    } else {
      localStorage.removeItem("selectedDistrict");
    }
  };

  const filteredDisasters = disasters.filter(d =>
    (!selectedType || d.type === selectedType) &&
    (!selectedDistrict || d.district === selectedDistrict) &&
    (!selecteddivisional_secretariat || d.divisionalSecretariat === selecteddivisional_secretariat) &&
    (!selectedSeverity || d.severity === selectedSeverity)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 px-4 md:px-12 font-sans">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12 mt-8">
        {/* Filters */}
        <div className="mb-6 bg-blue-50 rounded-xl p-4 flex flex-wrap items-center gap-4">
          <span className="font-semibold text-gray-700">Filter by:</span>

          <select
            className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none"
            value={selectedType || ""}
            onChange={e => setSelectedType(e.target.value || null)}
          >
            <option value="">Disaster Type</option>
            {disasterTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <select
            className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none"
            value={selectedDistrict || ""}
            onChange={handleDistrictChange}
          >
            <option value="">District</option>
            {districts.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <select
            className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none"
            value={selecteddivisional_secretariat || ""}
            onChange={e => setSelectedDivisionalSecretariat(e.target.value || null)}
            disabled={!selectedDistrict}
          >
            <option value="">Divisional Secretariat</option>
            {dsOptions.map(ds => (
              <option key={ds} value={ds}>{ds}</option>
            ))}
          </select>

          <select
            className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none"
            value={selectedSeverity || ""}
            onChange={e => setSelectedSeverity(e.target.value || null)}
          >
            <option value="">Severity</option>
            {severityTypes.map(sev => (
              <option key={sev} value={sev}>{sev}</option>
            ))}
          </select>

          <button
            className="px-4 py-2 bg-gray-200 rounded-lg font-semibold hover:bg-gray-300"
            onClick={handleResetFilters}
          >
            Reset Filters
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 rounded-xl overflow-hidden shadow">
            <thead className="bg-gradient-to-r from-blue-600 to-purple-600">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">#</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">District</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Divisional Secretariat</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Severity</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Time</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredDisasters.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-400">
                    No alerts found for selected filters.
                  </td>
                </tr>
              ) : (
                filteredDisasters.map((disaster, idx) => (
                  <tr key={disaster.id}>
                    <td className="px-6 py-4">{idx + 1}</td>
                    <td className="px-6 py-4 font-semibold text-blue-700">{disaster.type}</td>
                    <td className="px-6 py-4">{disaster.district}</td>
                    <td className="px-6 py-4">{disaster.divisionalSecretariat}</td> 
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                          disaster.severity === "High"
                            ? "bg-red-500 text-white"
                            : disaster.severity === "Medium"
                            ? "bg-yellow-400 text-white"
                            : "bg-green-500 text-white"
                        }`}
                      >
                        {disaster.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                          disaster.status === "Ongoing"
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {disaster.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{disaster.date}</td>
                    <td className="px-6 py-4">{disaster.time}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}