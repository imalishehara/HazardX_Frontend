import React, { useEffect, useState } from "react";
import axios from "axios";

interface AidRequest {
  aid_id: number;
  contact_no: string;
  district: string;
  divisional_secretariat: string;
  date_time: string;
}

interface EmergencyAidRequestProps {
  onBack?: () => void;
  onAddContribution?: (row: AidRequest) => void;
}

export default function EmergencyAidRequest({ onBack, onAddContribution }: EmergencyAidRequestProps) {
  const [requests, setRequests] = useState<AidRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmergencyRequests = async () => {
      try {
        setLoading(true);

        // ✅ Get volunteer ID from localStorage
        const volunteerId = localStorage.getItem("volunteerId");
        if (!volunteerId) {
          setError("Volunteer ID not found. Please log in again.");
          setLoading(false);
          return;
        }

        // ✅ Pass it as query param
        const response = await axios.get<AidRequest[]>(
          `http://localhost:5158/Volunteer/emergency-support?volunteerId=${volunteerId}`
        );

        setRequests(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load emergency aid requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmergencyRequests();
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow p-8 mt-8">
      <button
        className="mb-6 px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-full font-semibold text-gray-700 transition"
        onClick={onBack}
      >
        ← Back
      </button>
      <h2 className="text-2xl font-bold text-center mb-6">Emergency Aid Requests</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-blue-100">
            <th className="py-2 px-4 border">Aid Request ID</th>
            <th className="py-2 px-4 border">Contact Number</th>
            <th className="py-2 px-4 border">District</th>
            <th className="py-2 px-4 border">Divisional Secretariat</th>
            <th className="py-2 px-4 border">Date and Time</th>
            <th className="py-2 px-4 border">Add Contribution</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.aid_id} className="hover:bg-blue-50">
              <td className="py-2 px-4 border">{req.aid_id}</td>
              <td className="py-2 px-4 border">{req.contact_no}</td>
              <td className="py-2 px-4 border">{req.district}</td>
              <td className="py-2 px-4 border">{req.divisional_secretariat}</td>
              <td className="py-2 px-4 border">{req.date_time}</td>
              <td className="py-2 px-4 border text-center">
                {onAddContribution && (
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-full transition"
                    onClick={() => onAddContribution(req)}
                  >
                    Add Contribution
                  </button>
                )}
              </td>
            </tr>
          ))}
          {requests.length === 0 && !loading && !error && (
            <tr>
              <td colSpan={6} className="py-4 text-center text-gray-500">
                No emergency aid requests available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
