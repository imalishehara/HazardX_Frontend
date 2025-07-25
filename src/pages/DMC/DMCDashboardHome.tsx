import React, { useEffect, useState } from "react";

type AidRequest = {
  aid_id: number;
  date_time: string;
  divisional_secretariat: string;
  contact_no: string;
  IsFulfilled: boolean;
  request_type: string;
};

export default function DMCDashboardHome() {
  const [dmcOfficer, setDmcOfficer] = useState({
    fullName: "",
    district: "",
  });
  const [currentDate, setCurrentDate] = useState("");
  const [emergencyAids, setEmergencyAids] = useState<AidRequest[]>([]);

  useEffect(() => {
    const storedData = localStorage.getItem("dmcOfficerData");
    if (storedData) {
      const parsed = JSON.parse(storedData);
      const fullName = parsed.fullName || "Unknown";
      const district = parsed.district || "Unknown";

      setDmcOfficer({ fullName, district });
    }

    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setCurrentDate(formattedDate);
  }, []);

  useEffect(() => {
    if (dmcOfficer.district) {
      fetchUnresolvedEmergencyAids(dmcOfficer.district);
    }
  }, [dmcOfficer.district]);

  const fetchUnresolvedEmergencyAids = async (district: string) => {
    try {
      const res = await fetch(
        `http://localhost:5158/AidRequest/aids-for-district?district=${encodeURIComponent(
          district
        )}&isFulfilled=false`
      );
      if (!res.ok) throw new Error("Failed to fetch aid requests");
      const data = await res.json();
      // Only keep unresolved emergency aids
      setEmergencyAids(data.emergency || []);
    } catch (err) {
      console.error("Error fetching emergency aids:", err);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-gray-100 rounded-2xl shadow p-8 mt-8">
      <h2 className="text-3xl font-bold mb-2 text-center">
        Greetings {dmcOfficer.fullName} !!
      </h2>
      <div className="text-center mb-6 text-gray-700">
        {currentDate} | {dmcOfficer.district}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 flex flex-col items-center justify-center min-h-[180px]">
          <div className="text-lg font-semibold mb-2">Active Alerts</div>
          <button className="bg-gray-200 rounded-full px-6 py-2 mt-4 font-semibold">
            Manage
          </button>
        </div>
        <div className="bg-white rounded-xl p-6 flex flex-col items-center justify-center min-h-[180px]">
          <div className="text-lg font-semibold mb-2">Active Members</div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg font-semibold">
             Emergency Aid Requests
          </div>
          <button className="bg-gray-200 rounded-full px-6 py-2 font-semibold">
            Manage
          </button>
        </div>
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
              {emergencyAids.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-red-500">
                    No ongoing emergency aid requests.
                  </td>
                </tr>
              ) : (
                emergencyAids.map((aid) => {
                  const date = new Date(aid.date_time);
                  return (
                    <tr key={aid.aid_id}>
                      <td className="py-2 px-4 border">
                        {date.toLocaleDateString()}
                      </td>
                      <td className="py-2 px-4 border">
                        {date.toLocaleTimeString()}
                      </td>
                      <td className="py-2 px-4 border">
                        {aid.divisional_secretariat}
                      </td>
                      <td className="py-2 px-4 border">{aid.contact_no}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
