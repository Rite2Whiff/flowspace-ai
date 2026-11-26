"use client";

import { useAuth } from "@/context/authContext";

export default function Dashboard() {
  const { user } = useAuth();
  console.log(user);
  return <p>Dashboard</p>;
}
