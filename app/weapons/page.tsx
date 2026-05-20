import { Suspense } from "react";
import WeaponsClientLoader from "./WeaponsClientLoader";

function WeaponsPageFallback() {
  return <main className="min-h-screen bg-[#050505]" />;
}

export default function WeaponsPage() {
  return (
    <Suspense fallback={<WeaponsPageFallback />}>
      <WeaponsClientLoader />
    </Suspense>
  );
}
