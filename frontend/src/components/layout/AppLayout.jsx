import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";
import TopHeader from "./TopHeader";

export default function AppLayout() {
  return (
    <div className="app-bg">
      <div className="app-shell">
        <TopHeader />
        <main className="app-content">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
