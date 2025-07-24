import React, { useState } from "react";
import districtDivisionalSecretariats from "../data/districtDivisionalSecretariats";
import { CheckCircle, MapPin } from "lucide-react";

export default function PostDisasterAidRequest() {
  const [formData, setFormData] = useState({
    full_name: "",
    contact_no: "",
    district: "",
    ds_division: "",
    family_size: 1,
    type_support: "",
    description: "",
  });

  const [customSupport, setCustomSupport] = useState("");
  const [errors, setErrors] = useState({ contact_no: "" });

  const [location, setLocation] = useState({
    district: "",
    ds: "",
    latitude: null as number | null,
    longitude: null as number | null,
  });

  const supportOptions = ["Food", "Shelter", "Medical", "Clothing", "Other"];
  const districts = Object.keys(districtDivisionalSecretariats);
  const dsDivisions = formData.district ? districtDivisionalSecretariats[formData.district] : [];

  const validatePhoneNumber = (phone: string) => {
    const regex = /^\d{10}$/;
    return regex.test(phone) ? "" : "Phone number must be exactly 10 digits";
  };

  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation((prev) => ({ ...prev, latitude, longitude }));

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
          );
          const data = await response.json();
          console.log("Reverse geocode data:", data);

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
            alert(
              `Detected district '${detectedDistrict}' not found in options. Please select manually.`
            );
          }
        } catch (error) {
          alert("Failed to detect district and divisional secretariat from location.");
          console.error(error);
        }
      },
      (error) => {
        alert("Unable to retrieve your location");
        console.error(error);
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let finalTypeOfSupport = formData.type_support;
    if (finalTypeOfSupport === "Other") {
      if (!customSupport.trim()) {
        alert("Please specify the type of support.");
        return;
      }
      finalTypeOfSupport = customSupport.trim();
    }

    const phoneError = validatePhoneNumber(formData.contact_no);
    if (phoneError) {
      setErrors({ ...errors, contact_no: phoneError });
      return;
    }

    try {
      const payload = {
        ...formData,
        type_support: finalTypeOfSupport,
        latitude: location.latitude,
        longitude: location.longitude,
        request_type: "postDisaster"
      };

      const res = await fetch("http://localhost:5158/AidRequest/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to submit");
      alert("Post Disaster Aid Request submitted!");

      setFormData({
        full_name: "",
        contact_no: "",
        district: "",
        ds_division: "",
        family_size: 1,
        type_support: "",
        description: "",
      });
      setCustomSupport("");
      setErrors({ contact_no: "" });
      setLocation({ district: "", ds: "", latitude: null, longitude: null });
    } catch (err) {
      console.error(err);
      alert("Failed to submit request.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 px-4 md:px-12 flex items-center justify-center font-sans">
      <div className="w-full max-w-2xl mx-auto p-0 md:p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 transition-all duration-300">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-6">
            Post Disaster Aid Request
          </h1>

          <div className="bg-blue-50 border border-blue-300 p-4 rounded-lg mb-4 text-blue-800">
            <strong>Location Detection:</strong> Use <strong>"Use GPS"</strong> to auto-detect your
            location, or manually select your district and divisional secretariat.
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
                {dsDivisions.map((ds) => (
                  <option key={ds} value={ds}>
                    {ds}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Family Size</label>
              <input
                type="number"
                min={1}
                value={formData.family_size}
                onChange={(e) =>
                  setFormData({ ...formData, family_size: parseInt(e.target.value) })
                }
                className="w-full bg-gray-100 rounded-lg h-10 px-4 border border-gray-300"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Type of Support</label>
              <select
                required
                className="w-full bg-gray-100 rounded-lg h-10 px-4 border border-gray-300 text-base md:text-lg"
                value={formData.type_support}
                onChange={(e) => {
                  setFormData({ ...formData, type_support: e.target.value });
                  if (e.target.value !== "Other") setCustomSupport("");
                }}
              >
                <option value="">Select type of support</option>
                {supportOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>

              {formData.type_support === "Other" && (
                <input
                  type="text"
                  required
                  value={customSupport}
                  onChange={(e) => setCustomSupport(e.target.value)}
                  placeholder="Please specify"
                  className="mt-2 w-full bg-gray-100 rounded-lg h-10 px-4 text-base md:text-lg border border-gray-300"
                />
              )}
            </div>

            <div>
              <label className="block font-semibold mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Provide additional information..."
                className="w-full bg-gray-100 rounded-lg px-4 py-2 border border-gray-300"
              />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-blue-600 text-white rounded-xl px-10 py-2 text-xl font-bold shadow hover:bg-blue-700 transition-all duration-150"
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
