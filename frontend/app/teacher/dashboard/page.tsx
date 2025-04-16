"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Layout from '@/components/Layout';

export default function TeacherDashboard() {
  const [stats, setStats] = useState({
    programs: 0,
    students: 0,
    classes: 0,
    assignments: 0,
  });

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/teachers/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch teacher stats", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6">Teacher Dashboard</h1>

        {/* Overview Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <StatCard label="Programs" value={stats.programs} />
          <StatCard label="Students" value={stats.students} />
          <StatCard label="Classes" value={stats.classes} />
          <StatCard label="Assignments" value={stats.assignments} />
        </div>

        {/* Placeholder for Upcoming Classes */}
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-xl font-semibold mb-4">Upcoming Classes</h2>
          <p className="text-gray-500">This section will list your upcoming sessions.</p>
        </div>
      </div>
    </Layout>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-center">
      <h3 className="text-sm font-medium text-gray-500">{label}</h3>
      <p className="text-2xl font-bold text-blue-600 mt-1">{value}</p>
    </div>
  );
}