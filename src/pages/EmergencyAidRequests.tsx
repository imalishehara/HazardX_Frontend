import React, { useState } from "react";
import districtGnDivisions from "../data/districtDivisionalSecretariats";
import { CheckCircle, MapPin } from "lucide-react";
import districtDivisionalSecretariats from "../data/districtDivisionalSecretariats";

export default function EmergencyAidRequest() {
  const [formData, setFormData] = useState({
    full_name: "",
    contact_no: "",
    district: "",
    ds_division: "",
  });

  const [errors, setErrors] = useState({ contact_no: "" });
  const [location, setLocation] = useState({
    district: "",
    ds: "",
    latitude: null as number | null,
    longitude: null as number | null,
  });

  const districts = Object.keys(districtDivisionalSecretariats);
  const dsDivisions = formData.district ? districtDivisionalSecretariats[formData.district] : [];

  const validatePhoneNumber = (phone: string) => {
    const regex = /^\d{10}$/;
    if (!regex.test(phone)) return "Phone number must be exactly 10 digits";
    return "";
  };

  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        setLocation((prev) => ({
          ...prev,
          latitude,
          longitude,
        }));

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
          );
          const data = await response.json();
          console.log("Reverse geocode:", data);

          let detectedDistrict =
            data.address.county || data.address.state_district || data.address.district || "";

          if (detectedDistrict.toLowerCase().endsWith(" district")) {
            detectedDistrict = detectedDistrict.slice(0, -9).trim();
          }

          const detectedDS =
            data.address.suburb || data.address.village || data.address.town || data.address.hamlet || "";

          const matchedDistrict = districts.find(
            (d) => d.toLowerCase() === detectedDistrict.toLowerCase()
          );

          if (matchedDistrict) {
            const dsList = districtDivisionalSecretariats[matchedDistrict] || [];
            const matchedDS = dsList.find(
              (ds) => ds.toLowerCase() === detectedDS.toLowerCase()
            );

            if (matchedDS) {
              setFormData((prev) => ({
                ...prev,
                district: matchedDistrict,
                ds_division: matchedDS,
              }));
              setLocation((prev) => ({
                ...prev,
                district: matchedDistrict,
                ds: matchedDS,
              }));
            } else {
              setFormData((prev) => ({
                ...prev,
                district: matchedDistrict,
                ds_division: "",
              }));
              setLocation((prev) => ({
                ...prev,
                district: matchedDistrict,
                ds: "",
              }));
            }
          } else {
            alert(`Detected district '${detectedDistrict}' not found. Please select manually.`);
          }
        } catch (err) {
          console.error(err);
          alert("Failed to detect location.");
        }
      },
      (error) => {
        console.error(error);
        alert("Could not get your location.");
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const phoneError = validatePhoneNumber(formData.contact_no);
    if (phoneError) {
      setErrors({ ...errors, contact_no: phoneError });
      return;
    }

    try {
      const payload = {
        ...formData,
        request_type: "Emergency", 
        type_support: "Emergency Aid",  
        family_size: 0,                  
        description: "",
        latitude: location.latitude,
        longitude: location.longitude,
      };

      const res = await fetch("http://localhost:5158/AidRequest/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to submit");
      alert("Emergency Aid Request submitted!");
    } catch (err) {
      console.error(err);
      alert("Failed to submit request.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 px-4 md:px-12 flex items-center justify-center font-sans">
      <div className="w-full max-w-2xl mx-auto p-0 md:p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 transition-all duration-300">
          <h1 className="text-3xl md:text-4xl font-bold text-red-700 text-center mb-6">
            Emergency Aid Request
          </h1>

          <div className="bg-red-50 border border-red-300 p-4 rounded-lg mb-4 text-red-800">
            <strong>Emergency Request:</strong> Click <strong>"Use GPS"</strong> to auto-detect your district. Select GN manually if needed.
          </div>

          <div className="bg-green-50 border border-green-300 p-4 rounded-lg mb-6 flex items-center gap-2 text-green-700">
            <CheckCircle className="w-5 h-5" />
            <span>
              Location detected:{" "}
              {location.latitude && location.longitude
                ? `Latitude: ${location.latitude.toFixed(5)}, Longitude: ${location.longitude.toFixed(5)}`
                : "No location detected"}
            </span>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block font-semibold mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="Enter your full name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full bg-gray-100 rounded-lg h-10 px-4 border border-gray-300"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Contact No</label>
              <input
                type="tel"
                required
                placeholder="Enter 10-digit phone number"
                value={formData.contact_no}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value) && value.length <= 10) {
                    setFormData({ ...formData, contact_no: value });
                    if (errors.contact_no) setErrors({ ...errors, contact_no: "" });
                  }
                }}
                onBlur={() =>
                  setErrors({ ...errors, contact_no: validatePhoneNumber(formData.contact_no) })
                }
                className={`w-full bg-gray-100 rounded-lg h-10 px-4 border ${
                  errors.contact_no ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.contact_no && (
                <p className="text-red-500 text-sm mt-1">{errors.contact_no}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1">
                <label className="block font-semibold mb-1">District</label>
                <select
                  required
                  value={formData.district}
                  onChange={(e) =>
                    setFormData({ ...formData, district: e.target.value, ds_division: "" })
                  }
                  className="w-full bg-gray-100 rounded-lg h-10 px-4 border border-gray-300"
                >
                  <option value="">Select District</option>
                  {districts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={handleUseGPS}
                className="mt-6 bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-1 hover:bg-green-700 transition"
              >
                <MapPin className="w-4 h-4" />
                Use GPS
              </button>
            </div>

            <div>
              <label className="block font-semibold mb-1">Divisional Secretariat</label>
              <select
                required
                value={formData.ds_division}
                onChange={(e) => setFormData({ ...formData, ds_division: e.target.value })}
                disabled={!formData.district}
                className="w-full bg-gray-100 rounded-lg h-10 px-4 border border-gray-300"
              >
                <option value="">Select Divisional Secretariat</option>
                {dsDivisions.map((gn) => (
                  <option key={gn} value={gn}>
                    {gn}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-red-600 text-white rounded-xl px-10 py-2 text-xl font-bold shadow hover:bg-red-700 transition-all duration-150"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
