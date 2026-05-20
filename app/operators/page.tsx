import { Suspense } from "react";
import OperatorsClientLoader from "./OperatorsClientLoader";

function OperatorsPageFallback() {
  return <main className="min-h-screen bg-[#050505]" />;
}

export default function OperatorsPage() {
  return (
    <Suspense fallback={<OperatorsPageFallback />}>
      <OperatorsClientLoader />
    </Suspense>
  );
}
