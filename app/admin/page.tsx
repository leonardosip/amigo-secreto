
import { Suspense } from "react";
import AdminContent from "./AdminContent";

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#F7F2E8] text-[#102C23]">
          <div className="text-center">
            <div className="mb-4 animate-pulse text-5xl">
              🎄
            </div>

            <p className="text-lg">
              Preparando seu painel administrativo...
            </p>
          </div>
        </main>
      }
    >
      <AdminContent />
    </Suspense>
  );
}
