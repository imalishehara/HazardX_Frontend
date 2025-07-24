
/*import React from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface Alert {
  id: number;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
}

interface AidRequest {
  aid_id: number;
  full_name: string;
  type_support: string;
  district: string;
  divisional_secretariat: string;
  latitude: number;
  longitude: number;
}

interface DisasterMapProps {
  approvedAidRequests?: AidRequest[];
  approvedAlerts?: Alert[];
}

export default function DisasterMap({
  approvedAidRequests = [],
  approvedAlerts = [],
}: DisasterMapProps) {
  // Small jitter (~100m) to slightly shift markers that have the same location
  const jitter = () => (Math.random() - 0.5) * 0.001;

  return (
    <MapContainer
      center={[7.8731, 80.7718]}
      zoom={8}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {approvedAlerts.map((alert) => (
        <CircleMarker
          key={`alert-${alert.id}`}
          center={[alert.latitude + jitter(), alert.longitude + jitter()]}
          radius={10}
          pathOptions={{ color: "red", fillColor: "red", fillOpacity: 0.5 }}
        >
          <Popup>
            <strong>{alert.title}</strong>
            <br />
            {alert.description}
          </Popup>
        </CircleMarker>
      ))}

      {approvedAidRequests.map((aid) => (
        <CircleMarker
          key={`aid-${aid.aid_id}`}
          center={[aid.latitude + jitter(), aid.longitude + jitter()]}
          radius={10}
          pathOptions={{ color: "green", fillColor: "green", fillOpacity: 0.5 }}
        >
          <Popup>
            <strong>Aid Request</strong>
            <br />
            Recipient: {aid.full_name}
            <br />
            Type: {aid.type_support}
            <br />
            District: {aid.district}
            <br />
            Division: {aid.divisional_secretariat}
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}*/
import React from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface Alert {
  id: number;
  type: string;
  severity: string;
  date: string;
  time: string;
  latitude: number;
  longitude: number;
}

interface AidRequest {
  aid_id: number;
  full_name: string;
  type_support: string;
  district: string;
  divisional_secretariat: string;
  contact_no?: string;
  latitude: number;
  longitude: number;
}

interface DisasterMapProps {
  approvedAidRequests?: AidRequest[];  // Ongoing requests
  deliveredAidRequests?: AidRequest[]; // Delivered aids ✅
  approvedAlerts?: Alert[];
}

export default function DisasterMap({
  approvedAidRequests = [],
  deliveredAidRequests = [],
  approvedAlerts = [],
}: DisasterMapProps) {
  // Small jitter (~100m) to slightly shift overlapping markers
  const jitter = () => (Math.random() - 0.5) * 0.001;

  return (
    <MapContainer
      center={[7.8731, 80.7718]}
      zoom={8}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Alerts in red */}
      {approvedAlerts.map((alert) => (
        <CircleMarker
          key={`alert-${alert.id}`}
          center={[alert.latitude + jitter(), alert.longitude + jitter()]}
          radius={10}
          pathOptions={{ color: "red", fillColor: "red", fillOpacity: 0.5 }}
        >
          <Popup>
      <strong>Type:</strong> {alert.type}<br />
      <strong>Severity:</strong> {alert.severity}<br />
      <strong>Date:</strong> {alert.date}<br />
      <strong>Time:</strong> {alert.time}
    </Popup>
         
        </CircleMarker>
      ))}

      {/* Requested (ongoing) aids in orange ✅ */}
      {approvedAidRequests.map((aid) => (
        <CircleMarker
          key={`aid-requested-${aid.aid_id}`}
          center={[aid.latitude + jitter(), aid.longitude + jitter()]}
          radius={10}
          pathOptions={{ color: "orange", fillColor: "orange", fillOpacity: 0.5 }}
        >
          <Popup>
            <strong>Ongoing Aid Request</strong>
            <br />
            Recipient: {aid.full_name}
            <br />
            Type: {aid.type_support}
            <br />
            Contact: {aid.contact_no || "N/A"}
            <br />
            Division: {aid.divisional_secretariat}
          </Popup>
        </CircleMarker>
      ))}

      {/* Delivered aids in green ✅ */}
      {deliveredAidRequests.map((aid) => (
        <CircleMarker
          key={`aid-delivered-${aid.aid_id}`}
          center={[aid.latitude + jitter(), aid.longitude + jitter()]}
          radius={10}
          pathOptions={{ color: "green", fillColor: "green", fillOpacity: 0.5 }}
        >
          <Popup>
            <strong>Delivered Aid</strong>
            <br />
            Recipient: {aid.full_name}
            <br />
            Type: {aid.type_support}
            <br />
            Contact: {aid.contact_no || "N/A"}
            <br />
            
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}