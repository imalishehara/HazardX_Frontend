import React, { useEffect, useState } from "react";

interface OngoingAidRequest {
  aid_id: number;
  full_name: string;
  contact_no: string;
  type_support: string;
  description: string;
  contributionsReceived: number;
  resolved: boolean; // local UI state only
}

const OngoingAidRequests: React.FC = () => {
  const [requests, setRequests] = useState<OngoingAidRequest[]>([]);
  const [removedMessage, setRemovedMessage] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOngoingAndCounts = async () => {
      try {
        setLoading(true);

        const dsData = localStorage.getItem("dsOfficerData");
        let divisionalSecretariat = "";
        if (dsData) {
          const parsed = JSON.parse(dsData);
          divisionalSecretariat = parsed.divisionalSecretariat || "";
        }

        if (!divisionalSecretariat) {
          throw new Error("Divisional Secretariat is not set in local storage.");
        }

        const res = await fetch(
          `http://localhost:5158/AidRequest/ongoing?divisionalSecretariat=${encodeURIComponent(
            divisionalSecretariat
          )}`
        );
        if (!res.ok) throw new Error("Failed to fetch ongoing aid requests.");
        const ongoingRequests = await res.json();

        const requestsWithCounts = await Promise.all(
          ongoingRequests.map(async (req: any) => {
            const countRes = await fetch(
              `http://localhost:5158/AidRequest/contribution-count/${req.aid_id}`
            );
            const countData = countRes.ok ? await countRes.json() : { contributionsReceived: 0 };
            return {
              ...req,
              contributionsReceived: countData.contributionsReceived ?? 0,
              resolved: false,
            };
          })
        );

        setRequests(requestsWithCounts);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchOngoingAndCounts();
  }, []);

  const handleResolvedChange = async (idx: number) => {
    const aidId = requests[idx].aid_id;

    try {
      const res = await fetch(
        `http://localhost:5158/AidRequest/resolve/${aidId}`,
        { method: "POST" }
      );

      if (!res.ok) {
        throw new Error("Failed to mark aid request as resolved.");
      }

      setRequests((prev) => {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], resolved: true };
        return updated;
      });

      setTimeout(() => {
        setRequests((prev) => prev.filter((_, i) => i !== idx));
        setRemovedMessage("Aid request marked as resolved and removed.");
        setTimeout(() => setRemovedMessage(""), 2500);
      }, 800);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Error marking aid request as resolved.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-8 px-4 md:px-12 font-sans flex flex-col items-center">
      <div className="w-full max-w-4xl mx-auto p-0 md:p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 transition-all duration-300 relative">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Ongoing Aid Requests
          </h1>

          {loading ? (
            <div className="text-center text-lg text-gray-500">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : requests.length === 0 ? (
            <div className="text-center text-gray-500">
              No ongoing aid requests found.
            </div>
          ) : (
            <table className="w-full mt-6 border-collapse">
              <thead>
                <tr className="bg-blue-100">
                  <th className="py-2 px-4 border">Full Name</th>
                  <th className="py-2 px-4 border">Contact No</th>
                  <th className="py-2 px-4 border">Type of Support</th>
                  <th className="py-2 px-4 border">Description</th>
                  <th className="py-2 px-4 border">No. of Contributions</th>
                  <th className="py-2 px-4 border">Mark as Resolved</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req, idx) => (
                  <tr key={req.aid_id} className="hover:bg-blue-50">
                    <td className="py-2 px-4 border">{req.full_name}</td>
                    <td className="py-2 px-4 border">{req.contact_no}</td>
                    <td className="py-2 px-4 border">{req.type_support}</td>
                    <td className="py-2 px-4 border">{req.description}</td>
                    <td className="py-2 px-4 border font-bold text-blue-600">
                      {req.contributionsReceived}
                    </td>
                    <td className="py-2 px-4 border text-center">
                      <input
                        type="checkbox"
                        checked={req.resolved}
                        onChange={() => handleResolvedChange(idx)}
                        className="w-5 h-5 accent-green-600"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {removedMessage && (
          <div className="w-full mt-6 border-collapse relative">
            <div className="absolute inset-0 bg-black bg-opacity-30 z-40 transition-opacity animate-fadeIn"></div>
            <div className="absolute inset-0 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl shadow-xl px-10 py-8 flex flex-col items-center animate-fadeIn">
                <div className="text-green-600 text-3xl mb-4 font-bold">✔</div>
                <div className="text-2xl font-semibold mb-4">{removedMessage}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OngoingAidRequests;
