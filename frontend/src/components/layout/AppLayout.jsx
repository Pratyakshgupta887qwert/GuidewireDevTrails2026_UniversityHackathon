import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";
import TopHeader from "./TopHeader";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_30%_0,#f8fbff_0%,#eef2ff_42%,#e6ebf7_100%)] p-0 lg:p-4">
      <div className="mx-auto flex h-screen w-full max-w-[1500px] flex-col overflow-hidden border-x border-slate-200 bg-white shadow-[0_18px_45px_rgba(24,32,68,0.14)] lg:h-[calc(100vh-2rem)] lg:rounded-3xl lg:border">
        <TopHeader />
        <main className="flex-1 overflow-y-auto bg-slate-50 pb-24 md:pb-6">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
