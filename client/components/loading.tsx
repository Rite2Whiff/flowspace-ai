import { useLoading } from "@/context/loadingContext";

export function Loading() {
  const { loading } = useLoading();
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }
}
