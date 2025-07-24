import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmergencyAidRequest from "./EmergencyAidRequest";
import PostDisasterAidRequestTable from "./PostDisasterAidRequestTable";

export default function AidRequests() {
  const navigate = useNavigate();
  const [showEmergency, setShowEmergency] = useState(false);
  const [showPostDisaster, setShowPostDisaster] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <h1 className="text-3xl md:text-4xl font-bold mb-10 text-gray-900 text-center">
        Aid Requests
      </h1>
      {!(showEmergency || showPostDisaster) ? (
        <div className="flex flex-col gap-8 w-full max-w-md">
          <button
            className="bg-gradient-to-r from-red-500 to-red-700 text-white px-8 py-4 rounded-xl font-semibold text-xl shadow hover:scale-105 transition"
            onClick={() => setShowEmergency(true)}
          >
            Emergency Aid Request
          </button>
          <button
            className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-xl shadow hover:scale-105 transition"
            onClick={() => setShowPostDisaster(true)}
          >
            Post Disaster Aid Request
          </button>
        </div>
      ) : showEmergency ? (
        <EmergencyAidRequest
          onBack={() => setShowEmergency(false)}
          onAddContribution={(row) => {
            navigate("/volunteer-dashboard/add-contribution", {
              state: {
                initialAidRequestId: row.aid_id?.toString() || "",
                initialDescription: "",
                initialDistrict: row.district || "", // <-- Added district here
              },
            });
          }}
        />
      ) : (
        <PostDisasterAidRequestTable
          onBack={() => setShowPostDisaster(false)}
          onAddContribution={(row) => {
            navigate("/volunteer-dashboard/add-contribution", {
              state: {
                initialAidRequestId: row.aid_id?.toString() || "",
                initialDescription: "",
                initialDistrict: row.district || "", // <-- Added district here
              },
            });
          }}
        />
      )}
    </div>
  );
}