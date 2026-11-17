
import { Suspense } from "react";
import MinhaContaContent from "./MinhaContaContent";

export default function MinhaContaPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#F7F2E8] text-[#102C23]">
          <p className="animate-pulse text-lg">
            🎄 Preparando sua conta...
          </p>
        </main>
      }
    >
      <MinhaContaContent />
    </Suspense>
  );
}
