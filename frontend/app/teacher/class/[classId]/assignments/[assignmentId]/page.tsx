"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Layout from "@/components/Layout";

interface Submission {
  _id: string;
  student: {
    _id: string;
    name: string;
    email: string;
  };
  fileUrl: string;
  submittedAt: string;
  grade?: number;
  feedback?: string;
}

interface Assignment {
  _id: string;
  title: string;
  description?: string;
  dueDate: string;
  submissions?: Submission[];
}

export default function TeacherAssignmentDetailPage() {
  const { assignmentId } = useParams();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [fileUrls, setFileUrls] = useState<Record<string, string>>({});
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Fetch assignment details including submissions
  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/assignments/${assignmentId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAssignment(res.data);
      } catch (err) {
        console.error("Failed to load assignment", err);
      }
    };

    if (assignmentId) fetchAssignment();
  }, [assignmentId]);

  // Fetch presigned URLs for each submission file
  useEffect(() => {
    const fetchUrls = async () => {
      if (!assignment?.submissions) return;

      const newUrls: Record<string, string> = {};

      await Promise.all(
        assignment.submissions.map(async (submission) => {
          try {
            const key = encodeURIComponent(submission.fileUrl);
            const res = await axios.get(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/assignments/${assignment._id}/presigned-url/${key}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            newUrls[submission._id] = res.data.url;
          } catch (err) {
            console.error("Error fetching presigned URL for", submission._id);
          }
        })
      );

      setFileUrls(newUrls);
    };

    fetchUrls();
  }, [assignment]);

  return (
    <Layout>
      {!assignment ? (
        <p>Loading assignment...</p>
      ) : (
        <div className="max-w-3xl mx-auto py-10">
          <h1 className="text-2xl font-bold mb-2">{assignment.title}</h1>
          <p className="text-gray-700 mb-2">{assignment.description}</p>
          <p className="text-sm text-gray-500">
            Due: {new Date(assignment.dueDate).toLocaleDateString()}
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">
            Student Submissions
          </h2>

          {assignment.submissions?.length === 0 ? (
            <p className="text-gray-500">No submissions yet.</p>
          ) : (
            <ul className="space-y-6">
              {assignment.submissions?.map((submission) => (
                <li
                  key={submission._id}
                  className="border rounded p-4 space-y-3 shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{submission.student?.name}</p>
                      <p className="text-sm text-gray-500">
                        {submission.student?.email}
                      </p>
                      <p className="text-sm text-gray-400">
                        Submitted on:{" "}
                        {new Date(submission.submittedAt).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <a
                        href={fileUrls[submission._id]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        View Submission
                      </a>
                    </div>
                  </div>

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const form = e.currentTarget;
                      const grade = form.grade.value;
                      const feedback = form.feedback.value;

                      try {
                        await axios.put(
                          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/assignments/${assignment._id}/grade/${submission.student._id}`,
                          { grade, feedback },
                          {
                            headers: {
                              Authorization: `Bearer ${token}`,
                            },
                          }
                        );
                        alert("Grade submitted!");
                      } catch (err) {
                        console.error("Grade error", err);
                        alert("Failed to submit grade");
                      }
                    }}
                    className="space-y-2"
                  >
                    <input
                      name="grade"
                      placeholder="Grade"
                      defaultValue={submission.grade || ""}
                      className="border px-3 py-1 rounded w-24"
                    />
                    <input
                      name="feedback"
                      placeholder="Feedback"
                      defaultValue={submission.feedback || ""}
                      className="border px-3 py-1 rounded w-full"
                    />
                    <button
                      type="submit"
                      className="bg-green-600 text-white px-4 py-1 rounded"
                    >
                      Submit
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </Layout>
  );
}
