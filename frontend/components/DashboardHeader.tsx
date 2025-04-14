"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardHeader() {
  const router = useRouter();
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserRole(payload.role);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <header className="flex justify-between items-center py-4 px-6 border-b bg-white shadow-sm">
      <h1 className="text-xl font-bold text-blue-600">GEC</h1>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-700 capitalize">
          {userRole && `Role: ${userRole}`}
        </span>
        <button
          onClick={handleLogout}
          className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
