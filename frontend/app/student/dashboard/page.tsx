"use client";

import StudentAssignments from "@/components/StudentAssignments";
import { useState } from "react";

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("assignments");

  return (
    <div className="max-w-5xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Student Dashboard</h1>

      <div className="flex gap-6 border-b mb-6">
        {["assignments", "live", "grades"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 border-b-2 ${
              activeTab === tab ? "border-blue-600 text-blue-600" : "border-transparent"
            } capitalize`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div>
      {activeTab === "assignments" && (
  <StudentAssignments />
)}

        {activeTab === "live" && <p>🎥 Live class links will go here</p>}
        {activeTab === "grades" && <p>📊 Gradebook and feedback here</p>}
      </div>
    </div>
  );
}
