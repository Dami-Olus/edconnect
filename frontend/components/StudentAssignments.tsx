"use client";

import { useEffect, useState } from "react";
import axios from "axios";

type Assignment = {
  _id: string;
  title: string;
  description?: string;
  dueDate: string;
  class: string;
};

export default function StudentAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/assignments/student`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAssignments(res.data);
      } catch (err) {
        console.error("Failed to fetch assignments", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">My Assignments</h2>
      {loading ? (
        <p>Loading...</p>
      ) : assignments.length === 0 ? (
        <p>No assignments assigned yet.</p>
      ) : (
        <ul className="space-y-3">
          {assignments.map((a) => (
            <li key={a._id} className="p-4 border rounded">
              <h3 className="font-semibold text-lg">{a.title}</h3>
              <p className="text-sm text-gray-600">Due: {new Date(a.dueDate).toDateString()}</p>
              <p className="text-sm">{a.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
