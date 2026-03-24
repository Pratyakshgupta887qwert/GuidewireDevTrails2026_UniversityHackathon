import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import ClaimsPage from "./pages/ClaimsPage";
import DiscoverPage from "./pages/DiscoverPage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import PoliciesPage from "./pages/PoliciesPage";
import PolicyDetailsPage from "./pages/PolicyDetailsPage";
import WellnessPage from "./pages/WellnessPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/policies" element={<PoliciesPage />} />
          <Route path="/policies/:policyId" element={<PolicyDetailsPage />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/claims" element={<ClaimsPage />} />
          <Route path="/wellness" element={<WellnessPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
