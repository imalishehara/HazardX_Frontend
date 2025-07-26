import React, { useEffect, useState } from "react";

interface VolunteerContribution {
  contribution_id: number;
  volunteer_id: number;
  volunteer_name: string;
  volunteer_contact: string;
  district: string;
  volunteerTypeSupport: string; // ✅ using this instead of type_support
  description: string;
  image: string;
  status: "Pending" | "Approved" | "Rejected";
  requester_nic: string;
}

export default function ApproveVolunteerContributions() {
  const [contributions, setContributions] = useState<VolunteerContribution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removedMessage, setRemovedMessage] = useState<string>("");
  const [requestTypeFilter, setRequestTypeFilter] = useState<"Emergency" | "PostDisaster">("Emergency");

  useEffect(() => {
    const fetchPending = async () => {
      setIsLoading(true);
      try {
        const dsDataString = localStorage.getItem("dsOfficerData");
        const dsData = dsDataString ? JSON.parse(dsDataString) : null;
        const divisional_secretariat = dsData?.divisionalSecretariat?.trim();

        if (!divisional_secretariat) {
          alert("No division found in local storage!");
          return;
        }

        const res = await fetch(
          `http://localhost:5158/Contribution/pending?divisional_secretariat=${encodeURIComponent(
            divisional_secretariat
          )}&aidCategory=${encodeURIComponent(requestTypeFilter)}`
        );

        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();
        setContributions(data);
      } catch (err) {
        console.error(err);
        alert("Failed to load contributions");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPending();
  }, [requestTypeFilter]);

  const handleAction = async (
    contributionId: number,
    action: "Approved" | "Rejected"
  ) => {
    try {
      const endpoint = action === "Approved" ? "approve" : "reject";
      const url = `http://localhost:5158/Contribution/${endpoint}/${contributionId}`;

      const res = await fetch(url, { method: "POST" });
      if (!res.ok) throw new Error(`Failed to ${action.toLowerCase()} contribution`);

      setContributions((prev) =>
        prev.map((c) =>
          c.contribution_id === contributionId ? { ...c, status: action } : c
        )
      );

      setTimeout(() => {
        setContributions((prev) =>
          prev.filter((c) => c.contribution_id !== contributionId)
        );
        setRemovedMessage(`Contribution ${action.toLowerCase()} and removed.`);
        setTimeout(() => setRemovedMessage(""), 2500);
      }, 800);
    } catch (err) {
      console.error(err);
      alert(`Error while trying to ${action.toLowerCase()} the contribution`);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-gray-100 rounded-2xl shadow p-8 mt-8 relative">
      <h2 className="text-2xl font-bold text-center mb-4">
        Approve Volunteer Contributions
      </h2>

      <div className="flex justify-center mb-6">
        <label className="mr-4 font-semibold">Filter by Aid Request Type:</label>
        <select
          value={requestTypeFilter}
          onChange={(e) =>
            setRequestTypeFilter(e.target.value as "Emergency" | "PostDisaster")
          }
          className="rounded px-4 py-2 border border-gray-400"
        >
          <option value="Emergency">Emergency</option>
          <option value="PostDisaster">Post Disaster</option>
        </select>
      </div>

      {isLoading ? (
        <p className="text-center text-gray-600">Loading contributions...</p>
      ) : contributions.length === 0 ? (
        <p className="text-center text-gray-600">
          No pending volunteer contributions found for your division.
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          {contributions.map((c) => (
            <div
              key={c.contribution_id}
              className="bg-white border border-black rounded-xl p-6 shadow flex flex-col gap-2"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <div className="flex flex-col gap-2 pr-8">
                  <div>
                    <span className="font-semibold">Name:</span>
                    <span className="ml-2">{c.volunteer_name}</span>
                  </div>
                  <div>
                    <span className="font-semibold">Contact No:</span>
                    <span className="ml-2">{c.volunteer_contact}</span>
                  </div>
                  <div>
                    <span className="font-semibold">Type of Support:</span>
                    <span className="ml-2">{c.volunteerTypeSupport}</span>
                  </div>

                  {/* ✅ Only show NIC if PostDisaster */}
                  {requestTypeFilter === "PostDisaster" && (
                    <div>
                      <span className="font-semibold">Requester NIC:</span>
                      <span className="ml-2">{c.requester_nic}</span>
                    </div>
                  )}
                </div>
                {c.image && (
                  <div>
                    <img
                      src={c.image}
                      alt={c.volunteerTypeSupport}
                      className="w-24 h-24 object-cover rounded border"
                    />
                  </div>
                )}
              </div>
              <div className="mt-2">
                <span className="font-semibold">Description:</span>{" "}
                {c.description}
              </div>
              <div className="flex gap-4 mt-2">
                <button
                  className="border border-black rounded px-6 py-2 font-semibold"
                  onClick={() => handleAction(c.contribution_id, "Approved")}
                  disabled={c.status !== "Pending"}
                >
                  Approve
                </button>
                <button
                  className="border border-black rounded px-6 py-2 font-semibold"
                  onClick={() => handleAction(c.contribution_id, "Rejected")}
                  disabled={c.status !== "Pending"}
                >
                  Reject
                </button>
                <span
                  className={`ml-auto font-bold ${
                    c.status === "Approved"
                      ? "text-green-600"
                      : c.status === "Rejected"
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}
                >
                  {c.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {removedMessage && (
        <>
          <div className="absolute inset-0 bg-black bg-opacity-30 z-40 transition-opacity animate-fadeIn"></div>
          <div className="absolute inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl px-10 py-8 flex flex-col items-center animate-fadeIn">
              <div className="text-green-600 text-3xl mb-4 font-bold">✔</div>
              <div className="text-2xl font-semibold mb-4">{removedMessage}</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
