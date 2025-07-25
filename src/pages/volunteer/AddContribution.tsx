import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

interface AddContributionProps {
  initialAidRequestId?: string;
  initialType?: string;
  initialDescription?: string;
  initialDistrict?: string;
  initialRequesterNIC?: string; // ✅ allow NIC as prop
  onBack?: () => void;
}

export default function AddContribution(props: AddContributionProps) {
  const location = useLocation();
  const state = location.state || {};

  const initialAidRequestId = state.initialAidRequestId ?? props.initialAidRequestId ?? "";
  const initialType = state.initialType ?? props.initialType ?? "";
  const initialDescription = state.initialDescription ?? props.initialDescription ?? "";
  const initialDistrict = state.initialDistrict ?? props.initialDistrict ?? "";
  const initialRequesterNIC = state.requesterNIC ?? props.initialRequesterNIC ?? ""; // ✅ get NIC

  const onBack = props.onBack;

  const [aidRequestId, setAidRequestId] = useState(initialAidRequestId);
  const [type, setType] = useState(initialType);
  const [otherType, setOtherType] = useState("");
  const [description, setDescription] = useState(initialDescription);
  const [district, setDistrict] = useState(initialDistrict);
  const [requesterNIC, setRequesterNIC] = useState(initialRequesterNIC); // ✅ store NIC
  const [image, setImage] = useState<string>("");

  useEffect(() => {
    setAidRequestId(initialAidRequestId);
    setType(initialType);
    setDescription(initialDescription);
    setDistrict(initialDistrict);
    setRequesterNIC(initialRequesterNIC); // ✅ initialize NIC
  }, [initialAidRequestId, initialType, initialDescription, initialDistrict, initialRequesterNIC]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const volunteerData = JSON.parse(localStorage.getItem("volunteerData") || "null");

    if (!volunteerData || !volunteerData.userId) {
      alert("You must be logged in as a volunteer to submit a contribution.");
      return;
    }

    if (!district) {
      alert("No district found for the aid request. Cannot submit contribution.");
      return;
    }

    

    const volunteerId = volunteerData.userId;

    const payload = {
      volunteer_id: parseInt(volunteerId),
      aid_id: parseInt(aidRequestId),
      district: district,
      type_support: type === "Other" ? otherType : type,
      description: description,
      image: image,
      
    };
console.log("Submitting payload:", payload);
    try {
      const response = await fetch("http://localhost:5158/Contribution/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Contribution submitted successfully!");
        setAidRequestId("");
        setType("");
        setOtherType("");
        setDescription("");
        setImage("");
        setRequesterNIC(""); // ✅ clear NIC too
      } else {
        const errorText = await response.text();
        console.error("Server error:", errorText);
        alert("Failed to submit contribution. Please try again.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("An error occurred while submitting the contribution.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <h1 className="text-3xl md:text-4xl font-bold mb-10 text-gray-900 text-center">
        Add Contribution
      </h1>
      {onBack && (
        <button
          className="mb-6 px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-full font-semibold text-gray-700 transition"
          type="button"
          onClick={onBack}
        >
          ← Back
        </button>
      )}
      <form
        className="w-full max-w-2xl bg-white/90 rounded-3xl shadow-xl border border-blue-100 p-8 flex flex-col gap-8"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <label className="md:w-1/3 text-2xl font-medium text-gray-900">
            Aid Request ID Number :
          </label>
          <input
            type="number"
            value={aidRequestId}
            onChange={(e) => setAidRequestId(e.target.value)}
            required
            className="flex-1 rounded-lg bg-gray-100 px-4 py-2 text-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* ✅ requesterNIC is NOT shown in the UI */}

        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <label className="md:w-1/3 text-2xl font-medium text-gray-900">
            Type of Support :
          </label>
          <div className="flex-1 flex flex-col gap-2">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
              className="rounded-lg bg-gray-100 px-4 py-2 text-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="">Select</option>
              <option value="Evacuation">Evacuation</option>
              <option value="First Aid">First Aid</option>
              <option value="Supply Distribution">Supply Distribution</option>
              <option value="Other">Other</option>
            </select>
            {type === "Other" && (
              <input
                type="text"
                placeholder="Please specify"
                value={otherType}
                onChange={(e) => setOtherType(e.target.value)}
                required
                className="rounded-lg bg-gray-100 px-4 py-2 text-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <label className="md:w-1/3 text-2xl font-medium text-gray-900">
            Description :
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="flex-1 rounded-lg bg-gray-100 px-4 py-2 text-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 min-h-[80px]"
          />
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <label className="md:w-1/3 text-2xl font-medium text-gray-900">
            Image :
          </label>
          <div className="flex-1">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setImage(reader.result as string);
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="rounded-lg bg-gray-100 px-4 py-2 text-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            {image && (
              <div className="mt-4 flex justify-center">
                <img
                  src={image}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded border"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-2 rounded-xl font-semibold text-lg shadow hover:scale-105 transition"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
