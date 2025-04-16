"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

type Submission = {
  grade?: number;
  feedback?: string;
};

type Assignment = {
  _id: string;
  title: string;
  description?: string;
  dueDate: string;
  class: { _id: string; title: string };
  mySubmission?: Submission;
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
          {assignments.map((assignment) => (
            <Link
              key={assignment._id}
              href={`/student/class/${assignment.class._id}/assignments/${assignment._id}`}
              className="block p-4 border rounded hover:bg-gray-50"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg">{assignment.title}</h3>
                  <p className="text-sm text-gray-600">{assignment.description}</p>
                  <p className="text-xs text-gray-500 mb-1">
                    Class: {assignment.class.title}
                  </p>
                  <p className="text-xs text-gray-400 mb-1">
                    Due: {new Date(assignment.dueDate).toLocaleDateString()}
                  </p>

                  {assignment.mySubmission ? (
                    assignment.mySubmission.grade !== undefined ? (
                      <p className="text-sm text-green-700">
                        ✅ Grade: {assignment.mySubmission.grade} — Feedback:{" "}
                        {assignment.mySubmission.feedback || "N/A"}
                      </p>
                    ) : (
                      <p className="text-sm text-yellow-600">⏳ Submitted, awaiting grade</p>
                    )
                  ) : (
                    <p className="text-sm text-red-600">❌ Not submitted</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </ul>
      )}
    </div>
  );
}
