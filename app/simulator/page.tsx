import { Suspense } from "react";
import SimulatorClientLoader from "./SimulatorClientLoader";

function SimulatorPageFallback() {
  return <main className="min-h-screen bg-[#03060b]" />;
}

export default function SimulatorPage() {
  return (
    <Suspense fallback={<SimulatorPageFallback />}>
      <SimulatorClientLoader />
    </Suspense>
  );
}
