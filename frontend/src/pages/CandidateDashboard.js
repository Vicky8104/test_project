import API from "../api/axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Dashboard.css";
import Loader from "../components/Loader";

export default function CandidateDashboard() {
  const { user } = useContext(AuthContext);
  const [selections, setSelections] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ FETCH FUNCTION
  const fetchSelections = async () => {
    try {
      setLoading(true);
      const res = await API.get("/selections");
      setSelections(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to fetch selections");
    } finally {
      setLoading(false);
    }
  };

  // ✅ USE EFFECT
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (!user) return;

    if (user.role !== "candidate") {
      alert("Access denied");
      navigate("/");
      return;
    }

    fetchSelections();
  }, [user,navigate]);

  // ✅ CLICK HANDLER
  const handleClick = async (selection) => {
    try {
      setLoading(true);

      const res = await API.post("/final-submit/check", {
        employeeId: user.employeeId,
        post: selection.post,
        area: selection.area,
        subject: selection.subject,
      });

      const { submitted, pdfUrl, isClosed } = res.data;

      if (isClosed) {
        navigate("/download", {
          state: {
            pdfUrl,
            submitted,
            isClosed: true,
            selectionData: selection,
          },
        });
        return;
      }

      if (submitted) {
        navigate("/download", {
          state: {
            pdfUrl,
            submitted,
            isClosed: false,
            selectionData: selection,
          },
        });
      } else {
        sessionStorage.setItem("selectionId", selection._id);

        navigate("/personal-details", {
          state: { selectionId: selection._id },
        });
      }
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div>
      {loading && <Loader />}

      <div className="sub-header">
        <p>Welcome: {user?.name}</p>
        <p>Employee Id: {user?.employeeId}</p>
      </div>

      <div className="sub-heading">
        <h2>Your Selection Cards</h2>
      </div>

      <div className="sub-container">
        {selections.length === 0 ? (
          <p>No selections found</p>
        ) : (
          selections.map((item) => (
            <div
              key={item._id}
              className="sub-card"
              onClick={() => handleClick(item)}
            >
              <h3>{item.post}</h3>
              <p>Area: {item.area}</p>
              <p>Subject: {item.subject}</p>
            </div>
          ))
        )}
      </div>
      </div>
    </>
  );
}