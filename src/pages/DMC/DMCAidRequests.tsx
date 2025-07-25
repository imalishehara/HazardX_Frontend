import React, { useEffect, useState } from "react";

export default function DMCAidRequests() {
  const [dsApprovedPostDisasterOngoing, setDsApprovedPostDisasterOngoing] = useState<any[]>([]);
  const [dsApprovedPostDisasterDelivered, setDsApprovedPostDisasterDelivered] = useState<any[]>([]);
  const [emergencyAidsOngoing, setEmergencyAidsOngoing] = useState<any[]>([]);
  const [emergencyAidsDelivered, setEmergencyAidsDelivered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [aidType, setAidType] = useState<"postDisaster" | "emergency">("postDisaster");

  const fetchAids = () => {
    setLoading(true);
    const dmcData = JSON.parse(localStorage.getItem("dmcOfficerData") || "{}");
    const district = dmcData?.district;

    if (!district) {
      console.warn("District not found in localStorage");
      setLoading(false);
      return;
    }

    // Fetch both statuses for both aid types
    Promise.all([
      fetch(`http://localhost:5158/AidRequest/aids-for-district?district=${district}&isFulfilled=false`).then(res => res.json()),
      fetch(`http://localhost:5158/AidRequest/aids-for-district?district=${district}&isFulfilled=true`).then(res => res.json())
    ])
      .then(([ongoingData, deliveredData]) => {
        setDsApprovedPostDisasterOngoing(ongoingData.dsApprovedPostDisaster || []);
        setEmergencyAidsOngoing(ongoingData.emergency || []);
        setDsApprovedPostDisasterDelivered(deliveredData.dsApprovedPostDisaster || []);
        setEmergencyAidsDelivered(deliveredData.emergency || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch aid requests:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAids();
  }, [aidType]);

  return (
    <div className="w-full max-w-6xl mx-auto bg-gray-100 rounded-2xl shadow p-8 mt-8">
      <h2 className="text-2xl font-bold mb-4">Aid Requests in Your District</h2>

      {/* Aid type toggle */}
      <div className="flex items-center mb-6">
        <label className="mr-4 font-medium">Category:</label>
        <button
          className={`mr-2 px-4 py-2 rounded ${aidType === "postDisaster" ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-800"}`}
          onClick={() => setAidType("postDisaster")}
        >
          Post-Disaster
        </button>
        <button
          className={`px-4 py-2 rounded ${aidType === "emergency" ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-800"}`}
          onClick={() => setAidType("emergency")}
        >
          Emergency
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Loading aid requests...</p>
      ) : (
        <>
          {aidType === "postDisaster" && (
            <>
              {/* Ongoing Post-Disaster */}
              <section className="mb-10">
                <h3 className="text-xl font-semibold mb-2">Ongoing Post-Disaster Aid Requests</h3>
                {dsApprovedPostDisasterOngoing.length === 0 ? (
                  <p className="text-gray-600">No ongoing post-disaster aids.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg border">
                      <thead>
                        <tr className="bg-gray-200 text-gray-700">
                          <th className="py-2 px-4 border">Name</th>
                          <th className="py-2 px-4 border">Date</th>
                          <th className="py-2 px-4 border">Time</th>
                          <th className="py-2 px-4 border">Type</th>
                          <th className="py-2 px-4 border">Divisional Secretariat</th>
                          <th className="py-2 px-4 border">Contact No</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dsApprovedPostDisasterOngoing.map((req, idx) => {
                          const date = new Date(req.date_time);
                          return (
                            <tr key={idx} className="border-b last:border-b-0">
                              <td className="py-2 px-4 border">{req.full_name}</td>
                              <td className="py-2 px-4 border">{date.toLocaleDateString()}</td>
                              <td className="py-2 px-4 border">{date.toLocaleTimeString()}</td>
                              <td className="py-2 px-4 border">{req.type_support}</td>
                              <td className="py-2 px-4 border">{req.divisional_secretariat}</td>
                              <td className="py-2 px-4 border">{req.contact_no}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>

              {/* Delivered Post-Disaster */}
              <section>
                <h3 className="text-xl font-semibold mb-2">Delivered Post-Disaster Aid Requests</h3>
                {dsApprovedPostDisasterDelivered.length === 0 ? (
                  <p className="text-gray-600">No delivered post-disaster aids.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg border">
                      <thead>
                        <tr className="bg-gray-200 text-gray-700">
                          <th className="py-2 px-4 border">Name</th>
                          <th className="py-2 px-4 border">Date</th>
                          <th className="py-2 px-4 border">Time</th>
                          <th className="py-2 px-4 border">Type</th>
                          <th className="py-2 px-4 border">Divisional Secretariat</th>
                          <th className="py-2 px-4 border">Contact No</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dsApprovedPostDisasterDelivered.map((req, idx) => {
                          const date = new Date(req.date_time);
                          return (
                            <tr key={idx} className="border-b last:border-b-0">
                              <td className="py-2 px-4 border">{req.full_name}</td>
                              <td className="py-2 px-4 border">{date.toLocaleDateString()}</td>
                              <td className="py-2 px-4 border">{date.toLocaleTimeString()}</td>
                              <td className="py-2 px-4 border">{req.type_support}</td>
                              <td className="py-2 px-4 border">{req.divisional_secretariat}</td>
                              <td className="py-2 px-4 border">{req.contact_no}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            </>
          )}

          {aidType === "emergency" && (
            <>
              {/* Ongoing Emergency */}
              <section className="mb-10">
                <h3 className="text-xl font-semibold mb-2">Ongoing Emergency Aid Requests</h3>
                {emergencyAidsOngoing.length === 0 ? (
                  <p className="text-gray-600">No ongoing emergency aids.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg border">
                      <thead>
                        <tr className="bg-gray-200 text-gray-700">
                          <th className="py-2 px-4 border">Date</th>
                          <th className="py-2 px-4 border">Time</th>
                          <th className="py-2 px-4 border">Divisional Secretariat</th>
                          <th className="py-2 px-4 border">Contact No</th>
                        </tr>
                      </thead>
                      <tbody>
                        {emergencyAidsOngoing.map((req, idx) => {
                          const date = new Date(req.date_time);
                          return (
                            <tr key={idx} className="border-b last:border-b-0">
                              <td className="py-2 px-4 border">{date.toLocaleDateString()}</td>
                              <td className="py-2 px-4 border">{date.toLocaleTimeString()}</td>
                              <td className="py-2 px-4 border">{req.divisional_secretariat}</td>
                              <td className="py-2 px-4 border">{req.contact_no}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>

              {/* Delivered Emergency */}
              <section>
                <h3 className="text-xl font-semibold mb-2">Delivered Emergency Aid Requests</h3>
                {emergencyAidsDelivered.length === 0 ? (
                  <p className="text-gray-600">No delivered emergency aids.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg border">
                      <thead>
                        <tr className="bg-gray-200 text-gray-700">
                          <th className="py-2 px-4 border">Date</th>
                          <th className="py-2 px-4 border">Time</th>
                          <th className="py-2 px-4 border">Divisional Secretariat</th>
                          <th className="py-2 px-4 border">Contact No</th>
                        </tr>
                      </thead>
                      <tbody>
                        {emergencyAidsDelivered.map((req, idx) => {
                          const date = new Date(req.date_time);
                          return (
                            <tr key={idx} className="border-b last:border-b-0">
                              <td className="py-2 px-4 border">{date.toLocaleDateString()}</td>
                              <td className="py-2 px-4 border">{date.toLocaleTimeString()}</td>
                              <td className="py-2 px-4 border">{req.divisional_secretariat}</td>
                              <td className="py-2 px-4 border">{req.contact_no}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            </>
          )}
        </>
      )}
    </div>
  );
}

