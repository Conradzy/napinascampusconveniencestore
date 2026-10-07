import { Suspense } from "react";
import { PosRoute } from "@/components/pos-screen";

export default function PosPage() {
  return (
    <Suspense fallback={<main className="flex min-h-screen items-center justify-center font-display text-2xl" role="status">Opening the counter…</main>}>
      <PosRoute />
    </Suspense>
  );
}
