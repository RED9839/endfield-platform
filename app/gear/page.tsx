import { Suspense } from "react";
import GearClientLoader from "./GearClientLoader";

function GearPageFallback() {
  return <main className="min-h-screen bg-[#050505]" />;
}

export default function GearPage() {
  return (
    <Suspense fallback={<GearPageFallback />}>
      <GearClientLoader />
    </Suspense>
  );
}
