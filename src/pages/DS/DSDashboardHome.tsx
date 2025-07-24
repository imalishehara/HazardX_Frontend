import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DSDashboardHome() {
  const [dsOfficer, setDsOfficer] = useState({
    fullName: "",
    divisionalSecretariat: "",
  });

  const [currentDate, setCurrentDate] = useState("");
  const [pendingAidCount, setPendingAidCount] = useState<number>(0);
  const [pendingContributionsCount, setPendingContributionsCount] = useState<number>(0);

  const navigate = useNavigate();

  useEffect(() => {
    const storedData = localStorage.getItem("dsOfficerData");
    if (storedData) {
      const parsed = JSON.parse(storedData);
      setDsOfficer({
        fullName: parsed.fullName || "Unknown",
        divisionalSecretariat: parsed.divisionalSecretariat || "Unknown",
      });
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
    const fetchCounts = async () => {
      if (!dsOfficer.divisionalSecretariat) return;

      try {
        // ✅ Get pending aid requests count
        const aidRes = await fetch(
          `https://localhost:7096/AidRequest/pending-post-disaster/count?divisionalSecretariat=${encodeURIComponent(
            dsOfficer.divisionalSecretariat
          )}`
        );
        if (aidRes.ok) {
          const aidData = await aidRes.json();
          setPendingAidCount(aidData.pendingCount || 0);
        } else {
          console.error("Failed to fetch pending aid count");
        }

        // ✅ Get pending volunteer contributions count
        const contributionRes = await fetch(
          `https://localhost:7096/Contribution/pending/count?divisional_secretariat=${encodeURIComponent(
            dsOfficer.divisionalSecretariat
          )}`
        );
        if (contributionRes.ok) {
          const contributionData = await contributionRes.json();
          setPendingContributionsCount(contributionData.pendingCount || 0);
        } else {
          console.error("Failed to fetch pending contributions count");
        }
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchCounts();
  }, [dsOfficer.divisionalSecretariat]);

  // ✅ Handlers for navigation
  const handleNavigateToApproveAid = () => {
    navigate("/ds-dashboard/approve-aid-requests");
  };

  const handleNavigateToApproveContributions = () => {
    navigate("/ds-dashboard/approve-volunteer-contributions");
  };

  return (
    <div className="w-full flex flex-col items-center">
      <h1 className="font-extrabold text-2xl sm:text-4xl md:text-5xl lg:text-6xl mb-6 text-center">
        Greetings <span className="text-gray-700">{dsOfficer.fullName}</span> !!
      </h1>
      <div className="text-lg md:text-2xl text-gray-700 mb-8 text-center">
        {currentDate} &nbsp;|&nbsp; {dsOfficer.divisionalSecretariat}
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {/* ✅ Pending Volunteer Contributions card */}
        <div
          className="rounded-2xl bg-gray-200 shadow p-8 flex flex-col items-center w-full cursor-pointer hover:bg-gray-300 transition"
          onClick={handleNavigateToApproveContributions}
        >
          <span className="text-xl md:text-2xl text-gray-700 text-center mb-2">
            Pending Volunteer Contributions
          </span>
          <span className="text-3xl md:text-5xl font-extrabold text-gray-900 text-center">
            {pendingContributionsCount}
          </span>
          <span className="mt-2 text-base md:text-lg text-gray-700 text-center">
            Review Contributions
          </span>
        </div>

        {/* ✅ Pending Aid Requests card */}
        <div
          className="rounded-2xl bg-gray-200 shadow p-8 flex flex-col items-center w-full cursor-pointer hover:bg-gray-300 transition"
          onClick={handleNavigateToApproveAid}
        >
          <span className="text-xl md:text-2xl text-gray-700 text-center mb-2">
            Pending Aid Requests
          </span>
          <span className="text-3xl md:text-5xl font-extrabold text-gray-900 text-center">
            {pendingAidCount}
          </span>
          <span className="mt-2 text-base md:text-lg text-gray-700 text-center">
            Approve Aid
          </span>
        </div>
      </div>

      <div className="w-full max-w-2xl grid grid-cols-1 gap-8">
        <div className="rounded-2xl bg-gray-200 shadow p-8 flex flex-col items-center w-full">
          <span className="text-2xl md:text-3xl font-semibold text-gray-700 text-center">
            Recent Activity Log
          </span>
        </div>
      </div>
    </div>
  );
}
