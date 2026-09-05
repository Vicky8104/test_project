import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState, lazy, Suspense } from "react";
import API from "../api/axios";
import "./AdminDashboard.css";
import Loader from "../components/Loader";

// Lazy loaded admin components
const AdminConfig = lazy(() => import("./AdminConfig"));
const AdminPanel = lazy(() => import("./AdminPanel"));
const AdminUsers = lazy(() => import("./AdminUsers"));
const AdminCandidates = lazy(() => import("./AdminCandidates"));
const AdminSelctions = lazy(() => import("./AdminSelections"));
const AdminFinalSubmission = lazy(() => import("./AdminFinalSubmission"));
const AdminSchools = lazy(() => import("./AdminSchools"));

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [reports, setReports] = useState([]);
  const [activeTab, setActiveTab] = useState("reports");
  const [loading, setLoading] = useState(false);

  // ROLE CHECK
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (!user) return;

    if (user.role !== "admin") {
      alert("Unauthorized");
      navigate("/");
    }
  }, [user, navigate]);

  // FETCH REPORT
  const fetchReport = async () => {
    try {
      setLoading(true);

      const res = await API.get("/admin/report");

      setReports(res.data);
    } catch (err) {
      alert("Error fetching reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "reports") {
      fetchReport();
    }
  }, [activeTab]);

  return (
    <div className="dashboard-container">

      {loading && <Loader />}

      {/* HEADER */}
      <div className="sub-header">
        <p>Welcome {user?.name}</p>
        <p>Employee Id: {user?.employeeId}</p>
      </div>

      {/* BUTTONS */}
      <div className="top-buttons">

        <button
          className={activeTab === "reports" ? "active" : ""}
          onClick={() => setActiveTab("reports")}
        >
          Reports
        </button>

        <button
          className={activeTab === "users" ? "active" : ""}
          onClick={() => setActiveTab("users")}
        >
          Users
        </button>

        <button
          className={activeTab === "candidates" ? "active" : ""}
          onClick={() => setActiveTab("candidates")}
        >
          Candidates
        </button>

        <button
          className={activeTab === "selections" ? "active" : ""}
          onClick={() => setActiveTab("selections")}
        >
          Selections
        </button>

        <button
          className={activeTab === "schools" ? "active" : ""}
          onClick={() => setActiveTab("schools")}
        >
          Schools
        </button>

        <button
          className={activeTab === "finalSubmission" ? "active" : ""}
          onClick={() => setActiveTab("finalSubmission")}
        >
          Final Submission
        </button>

        <button
          className={activeTab === "upload" ? "active" : ""}
          onClick={() => setActiveTab("upload")}
        >
          Upload
        </button>

        <button
          className={activeTab === "config" ? "active" : ""}
          onClick={() => setActiveTab("config")}
        >
          Config
        </button>

      </div>

      {/* CONTENT */}
      <div className="content">

        <Suspense fallback={<Loader />}>

          {/* REPORTS */}
          {activeTab === "reports" && (
            <>
              <h2>Report Selection</h2>

              <div className="report-cards-container">

                {reports.map((item, index) => (
                  <div className="card" key={index}>

                    <h3>{item.post}</h3>

                    <p>Area: {item.area}</p>

                    <p>Subject: {item.subject}</p>

                    <p>Total: {item.totalSelections}</p>

                    <p style={{ color: "green" }}>
                      Submitted: {item.submitted}
                    </p>

                    <p style={{ color: "red" }}>
                      Pending: {item.pending}
                    </p>

                  </div>
                ))}

              </div>
            </>
          )}

          {/* USERS */}
          {activeTab === "users" && <AdminUsers />}

          {/* UPLOAD */}
          {activeTab === "upload" && <AdminPanel />}

          {/* CONFIG */}
          {activeTab === "config" && <AdminConfig />}

          {/* SCHOOLS */}
          {activeTab === "schools" && <AdminSchools />}

          {/* CANDIDATES */}
          {activeTab === "candidates" && <AdminCandidates />}

          {/* SELECTIONS */}
          {activeTab === "selections" && <AdminSelctions />}

          {/* FINAL SUBMISSION */}
          {activeTab === "finalSubmission" && (
            <AdminFinalSubmission />
          )}

        </Suspense>

      </div>

    </div>
  );
          }
