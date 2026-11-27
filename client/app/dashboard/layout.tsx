"use client";
import { Loading } from "@/components/loading";
import { ProtectedRoute } from "@/components/protected-route";
import { useLoading } from "@/context/loadingContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading } = useLoading();

  return (
    <ProtectedRoute>
      {loading && <Loading />}
      <div className={loading ? "hidden" : "block"}>{children}</div>
    </ProtectedRoute>
  );
}
