import React, { useEffect, useState } from "react";
import { aiVerificationService, type VerificationResult } from "../services/aiVerificationService";

export default function DMCReports() {
  const [reports, setReports] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [verificationResults, setVerificationResults] = useState<{[key: string]: VerificationResult}>({});
  const [alertForm, setAlertForm] = useState({
    district: "",
    divisionalSecretariat: "",
    alertType: "",
    severity: "Medium",
    latitude: 0,
    longitude: 0,
    reporterContact: "",
  });

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = () => {
    const storedDmcData = localStorage.getItem("dmcOfficerData");
    console.log("Stored DMC Officer Data:", storedDmcData);

    if (storedDmcData) {
      const dmc = JSON.parse(storedDmcData);
      const district = dmc.district?.trim();
      console.log("Using district:", district);

      if (district) {
        fetch(`http://localhost:5158/Symptoms/pendingReportsByDistrict?district=${encodeURIComponent(district)}`)

          .then((res) => {
            if (!res.ok) {
              throw new Error(`Failed to fetch, status: ${res.status}`);
            }
            return res.json();
          })
          .then((data) => {
            console.log("Fetched reports:", data);
            setReports(data || []);
          })
          .catch((err) => {
            console.error("Failed to fetch reports:", err);
            setReports([]);
          });
      } else {
        console.warn("District not found in stored DMC data");
        setReports([]);
      }
    } else {
      console.warn("No dmcOfficerData found in localStorage");
      setReports([]);
    }
  };

  

  // AI Image Verification Function
  const verifyImageAuthenticity = async (imageUrl: string, description: string, reportId: string) => {
    setVerificationResults(prev => ({
      ...prev,
      [reportId]: {
        isVerifying: true,
        isAuthentic: null,
        confidence: 0,
        analysis: "Analyzing image...",
        matchScore: 0,
        flags: []
      }
    }));

    try {
      // Use the enhanced AI verification service
      const result = await aiVerificationService.verifyImageAuthenticity(imageUrl, description, {
        strictMode: false,
        minConfidenceThreshold: 0.6,
        checkMetadata: true,
        detectDeepfakes: true
      });
      
      setVerificationResults(prev => ({
        ...prev,
        [reportId]: result
      }));

    } catch (error) {
      console.error("Image verification failed:", error);
      setVerificationResults(prev => ({
        ...prev,
        [reportId]: {
          isVerifying: false,
          isAuthentic: null,
          confidence: 0,
          analysis: "Verification failed. Please try again.",
          matchScore: 0,
          flags: ['verification_error']
        }
      }));
    }
  };

  const openAlertModal = (report: any) => {
    setSelected(report);
    setAlertForm({
      district: report.district,
      divisionalSecretariat: report.divisional_secretariat,
      alertType: "",
      severity: "Medium",
      latitude: report.latitude,
      longitude: report.longitude,
      reporterContact: report.contact_no || "",
    });
    setShowAlertModal(true);
  };

  const handleAlertChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAlertForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSeverity = (level: string) => {
    setAlertForm((prev) => ({ ...prev, severity: level }));
  };

  const handleAlertClear = () => {
    setAlertForm({
      district: "",
      divisionalSecretariat: "",
      alertType: "",
      severity: "Medium",
      latitude: 0,
      longitude: 0,
      reporterContact: "",
    });
    setSelected(null);
  };

  const handleAlertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const alertData = {
      alert_type: alertForm.alertType,
      district: alertForm.district,
      divisional_secretariat: alertForm.divisionalSecretariat,
      severity: alertForm.severity,
      latitude: alertForm.latitude,
      longitude: alertForm.longitude,
      reporter_contact: alertForm.reporterContact,
    };

    try {
      const response = await fetch("http://localhost:5158/Alerts/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(alertData),
      });

      if (!response.ok) {
        alert("Failed to publish alert.");
        return;
      }

      const statusResponse = await fetch("http://localhost:5158/Symptoms/updateStatus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportId: selected?.report_id,
          status: "AlertCreated",
          actor: "DMC Officer",
        }),
      });

      if (!statusResponse.ok) {
        const text = await statusResponse.text();
        console.error("Status update failed:", text);
        alert("Alert created, but failed to update report status.");
      } else {
        alert("Alert published!");
        setReports((prev) => prev.filter((r) => r.report_id !== selected?.report_id));
      }

      setShowAlertModal(false);
      handleAlertClear();
      loadReports();
    } catch (error) {
      console.error("Error submitting alert:", error);
      alert("An error occurred.");
    }
  };

  // Debug log to verify reports state on every render
  console.log("Reports in state:", reports);

  return (
    <div className="w-full max-w-4xl mx-auto bg-gray-100 rounded-2xl shadow p-8 mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Pending Symptom Reports</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg border">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="py-2 px-4 border">Divisional Secretariat</th>
              <th className="py-2 px-4 border">Date and Time</th>
              <th className="py-2 px-4 border">District</th>
              <th className="py-2 px-4 border">Verification</th>
              <th className="py-2 px-4 border">Description</th>
            </tr>
          </thead>
          <tbody>
            {reports.length > 0 ? (
              reports.map((report) => (
                <tr key={report.report_id} className="border-b last:border-b-0">
                  <td className="py-2 px-4 border">{report.divisional_secretariat}</td>
                  <td className="py-2 px-4 border">{new Date(report.date_time).toLocaleString()}</td>
                  <td className="py-2 px-4 border">{report.district}</td>
                  <td className="py-2 px-4 border">
                    {report.image ? (
                      <div className="flex flex-col items-center gap-2">
                        {verificationResults[report.report_id]?.isVerifying ? (
                          <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            <span className="text-sm text-blue-600">Verifying...</span>
                          </div>
                        ) : verificationResults[report.report_id] ? (
                          <div className="text-center">
                            <div className={`px-2 py-1 rounded text-xs font-semibold ${
                              verificationResults[report.report_id].isAuthentic 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {verificationResults[report.report_id].isAuthentic ? 'AUTHENTIC' : 'SUSPICIOUS'}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              {verificationResults[report.report_id].confidence}% confident
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => verifyImageAuthenticity(report.image, report.description, report.report_id)}
                            className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                          >
                            Verify Image
                          </button>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-500 text-sm">No image</span>
                    )}
                  </td>
                  <td className="py-2 px-4 border">
                    <button
                      className="underline text-blue-600"
                      onClick={() => setSelected(report)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-4 text-center text-gray-500">
                  No reports found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Detailed Report Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full relative overflow-y-auto max-h-[90vh]">
            <h3 className="text-2xl font-bold mb-4 text-center">Detailed Report</h3>
            <div className="mb-2"><b>Report ID:</b> {selected.report_id}</div>
            <div className="mb-2"><b>Name:</b> {selected.reporter_name}</div>
            <div className="mb-2"><b>Contact No:</b> {selected.contact_no}</div>
            <div className="mb-2"><b>Description:</b> {selected.description}</div>
            <div className="mb-2"><b>Date / Time:</b> {new Date(selected.date_time).toLocaleString()}</div>
            <div className="mb-2"><b>District:</b> {selected.district}</div>
            <div className="mb-2"><b>Divisional Secretariat:</b> {selected.divisional_secretariat}</div>
            <div className="mb-2"><b>Latitude:</b> {selected.latitude}</div>
            <div className="mb-4"><b>Longitude:</b> {selected.longitude}</div>

            {/* AI Verification Results */}
            {selected.image && verificationResults[selected.report_id] && !verificationResults[selected.report_id].isVerifying && (
              <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                  🤖 AI Verification Results
                  <div className={`px-2 py-1 rounded text-xs font-semibold ${
                    verificationResults[selected.report_id].isAuthentic 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {verificationResults[selected.report_id].isAuthentic ? 'AUTHENTIC' : 'SUSPICIOUS'}
                  </div>
                </h4>
                <div className="space-y-2 text-sm">
                  <div><b>Confidence Level:</b> {verificationResults[selected.report_id].confidence}%</div>
                  <div><b>Content Match Score:</b> {verificationResults[selected.report_id].matchScore}%</div>
                  <div><b>Analysis:</b> {verificationResults[selected.report_id].analysis}</div>
                  
                  {/* Display flags if any */}
                  {verificationResults[selected.report_id].flags && verificationResults[selected.report_id].flags.length > 0 && (
                    <div className="mt-3">
                      <b>Detected Issues:</b>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {verificationResults[selected.report_id].flags.map((flag, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded"
                          >
                            {flag.replace(/_/g, ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Verification recommendations */}
                  <div className="mt-3 p-2 bg-blue-50 rounded text-sm">
                    <b>💡 Recommendation:</b>
                    {verificationResults[selected.report_id].isAuthentic ? (
                      <span className="text-green-700"> Image appears legitimate. Safe to proceed with alert creation.</span>
                    ) : (
                      <span className="text-orange-700"> Manual review recommended before creating alert. Consider requesting additional evidence.</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {selected.image && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold">Submitted Image:</h4>
                  {!verificationResults[selected.report_id] && (
                    <button
                      onClick={() => verifyImageAuthenticity(selected.image, selected.description, selected.report_id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600 flex items-center gap-2"
                    >
                      🔍 Verify with AI
                    </button>
                  )}
                  {verificationResults[selected.report_id]?.isVerifying && (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                      <span className="text-sm text-blue-600">AI is analyzing...</span>
                    </div>
                  )}
                </div>
                <div className="flex justify-center">
                  <img
                    src={selected.image}
                    alt="Report"
                    className="w-48 h-48 object-cover border rounded"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-4 justify-center">
              {/* Show verification warning if image is suspicious */}
              {selected && selected.image && verificationResults[selected.report_id] && 
               !verificationResults[selected.report_id].isAuthentic && (
                <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 rounded">
                  <div className="flex items-center gap-2 text-red-700">
                    <span>⚠️</span>
                    <span className="font-semibold">Image Authenticity Warning</span>
                  </div>
                  <p className="text-sm text-red-600 mt-1">
                    AI analysis suggests this image may not be authentic. Proceed with caution.
                  </p>
                </div>
              )}
              
              <button
                className="bg-black text-white rounded-full px-6 py-2 font-semibold"
                onClick={() => openAlertModal(selected)}
              >
                Create Alert
              </button>
              <button
                className="bg-black text-white rounded-full px-6 py-2 font-semibold"
                onClick={() => setSelected(null)}
              >
                Close
              </button>
            </div>
            <button
              className="absolute top-2 right-4 text-gray-500 hover:text-gray-700 text-2xl"
              onClick={() => setSelected(null)}
              aria-label="Close"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Create Alert Modal */}
      {showAlertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <form
            className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full relative"
            onSubmit={handleAlertSubmit}
          >
            <h3 className="text-2xl font-bold mb-6 text-center">Create New Alert</h3>

            <div className="mb-4">
              <label className="block font-semibold mb-1">District</label>
              <input
                type="text"
                name="district"
                value={alertForm.district}
                readOnly
                className="w-full rounded px-3 py-2 border border-gray-300 bg-gray-100"
              />
            </div>

            <div className="mb-4">
              <label className="block font-semibold mb-1">Divisional Secretariat</label>
              <input
                type="text"
                name="divisionalSecretariat"
                value={alertForm.divisionalSecretariat}
                readOnly
                className="w-full rounded px-3 py-2 border border-gray-300 bg-gray-100"
              />
            </div>

            <div className="mb-4">
              <label className="block font-semibold mb-1">Alert Type</label>
              <select
                name="alertType"
                value={alertForm.alertType}
                onChange={handleAlertChange}
                className="w-full rounded px-3 py-2 border border-gray-300"
                required
              >
                <option value="">Select one...</option>
                <option value="Flood">Flood</option>
                <option value="Landslide">Landslide</option>
                <option value="Fire">Fire</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block font-semibold mb-1">Severity Level</label>
              <div className="flex gap-2">
                {["Low", "Medium", "High"].map((level) => (
                  <button
                    key={level}
                    type="button"
                    className={`px-4 py-2 rounded border ${
                      alertForm.severity === level
                        ? "bg-black text-white"
                        : "bg-white text-black"
                    }`}
                    onClick={() => handleSeverity(level)}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block font-semibold mb-1">Latitude</label>
              <div className="border border-gray-300 rounded px-3 py-2 bg-gray-100">
                {alertForm.latitude}
              </div>
            </div>

            <div className="mb-4">
              <label className="block font-semibold mb-1">Longitude</label>
              <div className="border border-gray-300 rounded px-3 py-2 bg-gray-100">
                {alertForm.longitude}
              </div>
            </div>

            <div className="flex gap-4 justify-center mt-6">
              <button
                type="submit"
                className="border border-black rounded-full px-8 py-2 font-semibold"
              >
                Publish
              </button>
              <button
                type="button"
                className="bg-black text-white rounded-full px-8 py-2 font-semibold"
                onClick={() => {
                  setShowAlertModal(false);
                  handleAlertClear();
                }}
              >
                Cancel
              </button>
            </div>

            <button
              className="absolute top-2 right-4 text-gray-500 hover:text-gray-700 text-2xl"
              onClick={() => {
                setShowAlertModal(false);
                handleAlertClear();
              }}
              aria-label="Close"
              type="button"
            >
              &times;
            </button>
          </form>
        </div>
      )}
    </div>
  );
}