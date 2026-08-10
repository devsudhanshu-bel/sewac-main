import Header from "../components/layouts/Header";
import { useEffect, useState } from "react";
import ComplaintHeader from "../components/complaints/ComplaintHeader";
import ComplaintKPIs from "../components/complaints/ComplaintKPIs";
import ComplaintFilters from "../components/complaints/ComplaintFilters";
import ComplaintTable from "../components/complaints/ComplaintTable";
import ComplaintDetails from "../components/complaints/ComplaintDetails";
const API_BASE_URL = "http://localhost:5003";

export default function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [kpis, setKpis] = useState({
    total: 0,
    pending: 0,
    assigned: 0,
    inProgress: 0,
    readyForVerification: 0,
    otpSent: 0,
    closed: 0,
  });
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const getAdminToken = () => {
    // IMPORTANT:
    // Replace this with your existing Admin auth storage key
    // once we confirm it.
    return sessionStorage.getItem("token");
  };

  const fetchComplaints = async (page = 1) => {
    try {
      setLoading(true);
      setError("");

      const token = getAdminToken();

      if (!token) {
        throw new Error("Admin authentication token not found.");
      }

      const response = await fetch(
        `${API_BASE_URL}/api/complaints?page=${page}&limit=10`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const result = await response.json();

      if (!response.ok || result.success !== true) {
        throw new Error(result.message || "Failed to fetch complaints.");
      }

      setComplaints(result.data?.items || []);

      setPagination(
        result.data?.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
      );
    } catch (err) {
      console.error("Fetch complaints error:", err);
      setError(err.message || "Unable to fetch complaints.");
    } finally {
      setLoading(false);
    }
  };

  const fetchKPIs = async () => {
    try {
      const token = getAdminToken();

      if (!token) {
        throw new Error("Admin authentication token not found.");
      }

      const response = await fetch(`${API_BASE_URL}/api/complaints/kpis`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok || result.success !== true) {
        throw new Error(result.message || "Failed to fetch complaint KPIs.");
      }

      setKpis(
        result.data || {
          total: 0,
          pending: 0,
          assigned: 0,
          inProgress: 0,
          readyForVerification: 0,
          otpSent: 0,
          closed: 0,
        },
      );
    } catch (err) {
      console.error("Fetch complaint KPIs error:", err);
    }
  };

  useEffect(() => {
    fetchComplaints(1);
    fetchKPIs();
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#F8F9FC]">
      <Header variant="default" />

      <div className="flex gap-6 px-8 py-6">
        <div className="flex-1 min-w-0 space-y-5">
          <ComplaintHeader />

          <ComplaintKPIs kpis={kpis} />

          <ComplaintFilters />

          <ComplaintTable
            complaints={complaints}
            loading={loading}
            error={error}
            pagination={pagination}
            onPageChange={fetchComplaints}
            onSelectComplaint={setSelectedComplaint}
          />
        </div>

        <div className="w-[370px] shrink-0">
          <ComplaintDetails complaint={selectedComplaint} />
        </div>
      </div>
    </div>
  );
}
