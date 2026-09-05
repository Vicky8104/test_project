import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

import MainLayout from "./components/MainSection";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import Loader from "./components/Loader";

// Pages - Lazy Loading
const LandingPage = lazy(() => import("./pages/LandingPage"));
const Login = lazy(() => import("./pages/LoginPage"));
const CandidateDashboard = lazy(() => import("./pages/CandidateDashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const TeamDashboard = lazy(() => import("./pages/TeamDashboard"));
const PersonalDetail = lazy(() => import("./pages/PersonalDetails"));
const SchoolChoice = lazy(() => import("./pages/SchoolChoice"));
const PreviewPage = lazy(() => import("./pages/PreviewPage"));
const DownloadPage = lazy(() => import("./pages/DownloagPage"));
const DownloadTable = lazy(() => import("./pages/DownloadTable"));

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>

        <Suspense fallback={<Loader />}>

          <Routes>

            {/* Layout Wrap */}
            <Route path="/" element={<MainLayout />}>

              <Route
                index
                element={<LandingPage />}
              />

              <Route
                path="login"
                element={<Login />}
              />

              <Route
                path="candidate"
                element={
                  <ProtectedRoute role="candidate">
                    <CandidateDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="admin"
                element={
                  <ProtectedRoute role="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="team"
                element={
                  <ProtectedRoute role="team">
                    <TeamDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="personal-details"
                element={<PersonalDetail />}
              />

              <Route
                path="school-choice"
                element={<SchoolChoice />}
              />

              <Route
                path="preview"
                element={<PreviewPage />}
              />

              <Route
                path="download"
                element={<DownloadPage />}
              />

              <Route
                path="downloadFile"
                element={<DownloadTable />}
              />

            </Route>

          </Routes>

        </Suspense>

      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
