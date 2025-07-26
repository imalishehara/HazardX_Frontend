import React, { useEffect, useState, useRef } from "react";
import districtDivisionalSecretariats from "../../data/districtDivisionalSecretariats";
import { getDivisionalSecretariatCoordinates } from "../../data/coordinates";

export default function SubmitManualReport() {
  const [form, setForm] = useState({
    date_time: "",
    description: "",
    image: "",
    nic_number: "",
    latitude: 0,
    longitude: 0,
  });

  const [dsOfficer, setDsOfficer] = useState({
    reporter_name: "",
    contact_no: "",
  });

  // District and DS start empty, user selects manually
  const [district, setDistrict] = useState("");
  const [divisionalSecretariat, setDivisionalSecretariat] = useState("");
  const [divisionalSecretariats, setDivisionalSecretariats] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [previewUrl, setPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showSuccess, setShowSuccess] = useState(false);

  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [isLocationAutoDetected, setIsLocationAutoDetected] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("dsOfficerData");
    if (storedUser) {
      const loginData = JSON.parse(storedUser);
      if (loginData.role === "DS" && loginData.userId) {
        fetch(`http://localhost:5158/DSOfficer/details/${loginData.userId}`)
          .then((res) => {
            if (!res.ok) throw new Error("Failed to fetch DS Officer details");
            return res.json();
          })
          .then((data) => {
            setDsOfficer({
              reporter_name: data.fullName || "",
              contact_no: data.contactNo || "",
            });
            // IMPORTANT: Do NOT set district or DS from login data
            // User must manually select district and DS
          })
          .catch((err) => console.error(err))
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const getLocationFromCoordinates = (latitude: number, longitude: number) => {
   const locationMappings = [
      { bounds: { minLat: 6.7, maxLat: 7.0, minLng: 79.8, maxLng: 80.2 }, district: "Colombo", divisionalSecretariat: "Colombo" },
      { bounds: { minLat: 6.9, maxLat: 7.2, minLng: 79.9, maxLng: 80.3 }, district: "Gampaha", divisionalSecretariat: "Gampaha" },
      { bounds: { minLat: 6.5, maxLat: 6.8, minLng: 79.8, maxLng: 80.2 }, district: "Kalutara", divisionalSecretariat: "Kalutara" },
      { bounds: { minLat: 7.2, maxLat: 7.4, minLng: 80.5, maxLng: 80.8 }, district: "Kandy", divisionalSecretariat: "Kandy" },
      { bounds: { minLat: 7.4, maxLat: 7.6, minLng: 80.5, maxLng: 80.8 }, district: "Matale", divisionalSecretariat: "Matale" },
      { bounds: { minLat: 6.9, maxLat: 7.1, minLng: 80.7, maxLng: 81.0 }, district: "Nuwara Eliya", divisionalSecretariat: "Nuwara Eliya" },
      { bounds: { minLat: 6.0, maxLat: 6.3, minLng: 80.1, maxLng: 80.4 }, district: "Galle", divisionalSecretariat: "Galle" },
      { bounds: { minLat: 5.9, maxLat: 6.2, minLng: 80.5, maxLng: 80.8 }, district: "Matara", divisionalSecretariat: "Matara" },
      { bounds: { minLat: 6.1, maxLat: 6.4, minLng: 81.0, maxLng: 81.3 }, district: "Hambantota", divisionalSecretariat: "Hambantota" },
      { bounds: { minLat: 9.5, maxLat: 9.8, minLng: 80.0, maxLng: 80.3 }, district: "Jaffna", divisionalSecretariat: "Jaffna" },
      { bounds: { minLat: 9.3, maxLat: 9.6, minLng: 80.3, maxLng: 80.6 }, district: "Kilinochchi", divisionalSecretariat: "Kilinochchi" },
      { bounds: { minLat: 8.9, maxLat: 9.2, minLng: 79.9, maxLng: 80.2 }, district: "Mannar", divisionalSecretariat: "Mannar" },
      { bounds: { minLat: 8.7, maxLat: 9.0, minLng: 80.4, maxLng: 80.7 }, district: "Vavuniya", divisionalSecretariat: "Vavuniya" },
      { bounds: { minLat: 9.0, maxLat: 9.3, minLng: 80.7, maxLng: 81.0 }, district: "Mullaitivu", divisionalSecretariat: "Mullaitivu" },
      { bounds: { minLat: 7.7, maxLat: 8.0, minLng: 81.6, maxLng: 81.9 }, district: "Batticaloa", divisionalSecretariat: "Batticaloa" },
      { bounds: { minLat: 7.2, maxLat: 7.5, minLng: 81.6, maxLng: 81.9 }, district: "Ampara", divisionalSecretariat: "Ampara" },
      { bounds: { minLat: 8.5, maxLat: 8.8, minLng: 81.1, maxLng: 81.4 }, district: "Trincomalee", divisionalSecretariat: "Trincomalee" },
      { bounds: { minLat: 7.4, maxLat: 7.7, minLng: 80.3, maxLng: 80.6 }, district: "Kurunegala", divisionalSecretariat: "Kurunegala" },
      { bounds: { minLat: 8.0, maxLat: 8.3, minLng: 79.8, maxLng: 80.1 }, district: "Puttalam", divisionalSecretariat: "Puttalam" },
      { bounds: { minLat: 8.3, maxLat: 8.6, minLng: 80.3, maxLng: 80.6 }, district: "Anuradhapura", divisionalSecretariat: "Anuradhapura East" },
      { bounds: { minLat: 7.9, maxLat: 8.2, minLng: 80.9, maxLng: 81.2 }, district: "Polonnaruwa", divisionalSecretariat: "Polonnaruwa" },
      { bounds: { minLat: 6.9, maxLat: 7.2, minLng: 81.0, maxLng: 81.3 }, district: "Badulla", divisionalSecretariat: "Badulla" },
      { bounds: { minLat: 6.8, maxLat: 7.1, minLng: 81.3, maxLng: 81.6 }, district: "Monaragala", divisionalSecretariat: "Monaragala" },
      { bounds: { minLat: 6.6, maxLat: 6.9, minLng: 80.3, maxLng: 80.6 }, district: "Ratnapura", divisionalSecretariat: "Ratnapura" },
      { bounds: { minLat: 7.2, maxLat: 7.5, minLng: 80.3, maxLng: 80.6 }, district: "Kegalle", divisionalSecretariat: "Kegalle" }
    ];

    for (const mapping of locationMappings) {
      const { bounds, district, divisionalSecretariat } = mapping;
      if (
        latitude >= bounds.minLat && latitude <= bounds.maxLat &&
        longitude >= bounds.minLng && longitude <= bounds.maxLng
      ) {
        return { district, divisionalSecretariat };
      }
    }
    return { district: "Colombo", divisionalSecretariat: "Colombo" };
  };

  const getCurrentLocation = () => {
    setIsLoadingLocation(true);
    setLocationError("");
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const loc = getLocationFromCoordinates(latitude, longitude);
        setDistrict(loc.district);
        setDivisionalSecretariat(loc.divisionalSecretariat);
        setDivisionalSecretariats(districtDivisionalSecretariats[loc.district] || []);
        setIsLocationAutoDetected(true);
        setLocationError("");
        setIsLoadingLocation(false);

        setForm((prev) => ({
          ...prev,
          latitude,
          longitude,
        }));
      },
      () => {
        setLocationError("Unable to retrieve location.");
        setIsLoadingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDistrict = e.target.value;
    setDistrict(newDistrict);
    setDivisionalSecretariat("");
    setDivisionalSecretariats(districtDivisionalSecretariats[newDistrict] || []);
    setIsLocationAutoDetected(false);
    setForm((prev) => ({
      ...prev,
      latitude: 0,
      longitude: 0,
    }));
  };

 const handleDivisionalSecretariatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const selectedDS = e.target.value;
  setDivisionalSecretariat(selectedDS);
  setIsLocationAutoDetected(false);

  const coords = getDivisionalSecretariatCoordinates(selectedDS);

  if (coords) {
    setForm((prev) => ({
      ...prev,
      latitude: coords.lat,
      longitude: coords.lng,
    }));
  } else {
    // Do NOT reset lat/lng to zero here
    console.warn(`Coordinates not found for divisional secretariat: ${selectedDS}`);
  }
};

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, image: reader.result as string }));
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setForm((prev) => ({ ...prev, image: "" }));
      setPreviewUrl("");
    }
  };

  const handleRemoveFile = () => {
    setForm((prev) => ({ ...prev, image: "" }));
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClear = () => {
    setForm({
      date_time: "",
      description: "",
      image: "",
      nic_number: "",
      latitude: 0,
      longitude: 0,
    });
    setPreviewUrl("");
    setDistrict("");
    setDivisionalSecretariat("");
    setDivisionalSecretariats([]);
    setIsLocationAutoDetected(false);
    setLocationError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !dsOfficer.reporter_name ||
      !dsOfficer.contact_no ||
      !district ||
      !divisionalSecretariat ||
      !form.date_time ||
      !form.description ||
      !form.nic_number
    ) {
      alert("Please fill all required fields including NIC.");
      return;
    }

    const reportData = {
      reporter_name: dsOfficer.reporter_name,
      contact_no: dsOfficer.contact_no,
      district,
      divisional_secretariat: divisionalSecretariat.trim(),
      date_time: form.date_time,
      description: form.description,
      image: form.image,
      action: "Pending",
      nic_number: form.nic_number,
      latitude: form.latitude,
      longitude: form.longitude,
    };

    console.log(JSON.stringify(reportData, null, 2));
    try {
      setSubmitting(true);
      const response = await fetch("http://localhost:5158/Symptoms/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reportData),
      });

      if (response.ok) {
        setShowSuccess(true);
        handleClear();
      } else {
        alert("Failed to submit report.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while submitting.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-20 text-lg font-semibold text-gray-600">
        Loading DS Officer details...
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto bg-gray-100 rounded-2xl shadow p-8 mt-8">
      <h2 className="text-2xl font-bold text-center mb-6">Report Disaster Alerts</h2>
      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block font-semibold mb-1">Full Name:</label>
            <input
              type="text"
              value={dsOfficer.reporter_name}
              readOnly
              className="w-full rounded px-3 py-2 border border-gray-300"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Contact Number:</label>
            <input
              type="text"
              value={dsOfficer.contact_no}
              readOnly
              className="w-full rounded px-3 py-2 border border-gray-300"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block font-semibold mb-1">District</label>
            <select
              value={district}
              onChange={handleDistrictChange}
              className="w-full rounded px-3 py-2 border border-gray-300"
              required
            >
              <option value="">Select District</option>
              {Object.keys(districtDivisionalSecretariats).map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Divisional Secretariat</label>
            <select
              value={divisionalSecretariat}
              onChange={handleDivisionalSecretariatChange}
              disabled={!district}
              className="w-full rounded px-3 py-2 border border-gray-300"
              required
            >
              <option value="">Select DS</option>
              {divisionalSecretariats.map((ds) => (
                <option key={ds} value={ds}>
                  {ds}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Date/Time</label>
            <input
              type="datetime-local"
              name="date_time"
              value={form.date_time}
              onChange={handleChange}
              required
              className="w-full rounded px-3 py-2 border border-gray-300"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">NIC Number</label>
          <input
            type="text"
            name="nic_number"
            value={form.nic_number}
            onChange={handleChange}
            required
            maxLength={12}
            placeholder="Enter NIC Number"
            className="w-full rounded px-3 py-2 border border-gray-300"
          />
        </div>

        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={isLoadingLocation}
          className={`px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 mb-4 ${
            isLoadingLocation
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700 shadow"
          }`}
        >
          {isLoadingLocation ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Getting GPS...
            </>
          ) : (
            <>📍 Use Current Location</>
          )}
        </button>

        {locationError && <p className="text-red-500 mb-2">{locationError}</p>}
        {isLocationAutoDetected && (
          <p className="text-green-600 mb-2">
            Location auto-detected: {district}, {divisionalSecretariat}
          </p>
        )}

        <div className="mb-4">
          <label className="block font-semibold mb-1">Symptom Description:</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            className="w-full rounded px-3 py-2 border border-gray-300 min-h-[80px]"
          />
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-1">Upload Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
          />
          {previewUrl && (
            <div className="flex items-center gap-4 mt-2">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-24 h-24 object-cover rounded border"
              />
              <button
                type="button"
                onClick={handleRemoveFile}
                className="text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        <div className="flex gap-4 justify-center">
          <button
            type="submit"
            disabled={submitting}
            className={`rounded-full px-8 py-2 font-semibold ${
              submitting ? "bg-gray-400 cursor-not-allowed" : "bg-gray-300 hover:bg-gray-400"
            }`}
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="bg-gray-200 hover:bg-gray-300 rounded-full px-8 py-2 font-semibold"
          >
            Clear
          </button>
        </div>
      </form>

      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <h3 className="text-green-600 text-2xl font-bold mb-2">✔ Report Submitted</h3>
            <p className="text-lg">Your report was successfully submitted.</p>
            <button
              onClick={() => setShowSuccess(false)}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
