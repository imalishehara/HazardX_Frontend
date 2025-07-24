import React from "react";

export default function HazardXLogo() {
  return (
    <div className="w-full flex justify-center items-center mt-4 mb-6">
      <span
        className="text-5xl font-extrabold"
        style={{
          background: "linear-gradient(90deg, #2563eb 0%, #a855f7 60%, #ec4899 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textShadow: "0 4px 16px #0001",
        }}
      >
        HazardX
      </span>
    </div>
  );
}