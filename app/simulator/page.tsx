import { Suspense } from "react";
import SimulatorPageClient from "./SimulatorPageClient";

function SimulatorPageFallback() {
  return (
    <main className="min-h-screen bg-[#03060b]" />
  );
}

export default function SimulatorPage() {
  return (
    <Suspense fallback={<SimulatorPageFallback />}>
      <SimulatorPageClient />
    </Suspense>
  );
}