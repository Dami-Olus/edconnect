"use client";

import { useEffect, useState } from "react";
import axios from "axios";

type ClassType = {
  _id: string;
  title: string;
  description: string;
};

export default function TeacherClassesPage() {
  const [classes, setClasses] = useState<ClassType[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", description: "" });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchClasses = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/classes`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setClasses(res.data);
    } catch (err) {
      console.error("Failed to fetch classes", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/classes`,
        { ...form },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setForm({ title: "", description: "" });
      fetchClasses();
    } catch (err) {
      console.error("Class creation failed", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this class?')) return;
  
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/classes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchClasses(); // refresh list after deletion
    } catch (err) {
      console.error('Failed to delete class', err);
    }
  };
  

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">My Classes</h2>

      <form onSubmit={handleSubmit} className="mb-6 space-y-2">
        <input
          name="title"
          placeholder="Class Title"
          value={form.title}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="border p-2 w-full"
          rows={3}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Class
        </button>
      </form>

      <ul className="space-y-2">
        {classes.map((c) => (
          <li
            key={c._id}
            className="p-4 border rounded shadow-sm flex justify-between items-center"
          >
            <div>
              <h3 className="text-lg font-bold">{c.title}</h3>
              <p>{c.description}</p>
            </div>
            <button
              onClick={() => handleDelete(c._id)}
              className="text-red-600 hover:underline text-sm"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
