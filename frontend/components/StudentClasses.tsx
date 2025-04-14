"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";


type ClassType = {
  _id: string;
  title: string;
  description: string;
  teacher: { name: string };
};

export default function StudentClasses() {
  const [classes, setClasses] = useState<ClassType[]>([]);
  const [loading, setLoading] = useState(true);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/classes/student`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setClasses(res.data);
        console.log(res.data)
      } catch (err) {
        console.error("Failed to fetch classes", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">My Classes</h2>
      {loading ? (
        <p>Loading...</p>
      ) : classes.length === 0 ? (
        <p>You are not enrolled in any classes yet.</p>
      ) : (
        <ul className="space-y-3">
  {classes.map((cls) => (
    <li key={cls._id} className="p-4 border rounded hover:shadow">
      <Link href={`/student/class/${cls._id}`}>
        <div className="cursor-pointer">
          <h3 className="text-lg font-bold">{cls.title}</h3>
          <p className="text-sm text-gray-600">{cls.description}</p>
          <p className="text-sm text-gray-500">Instructor: {cls.teacher?.name}</p>
        </div>
      </Link>
    </li>
  ))}
</ul>
      )}
    </div>
  );
}
