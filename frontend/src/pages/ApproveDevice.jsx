import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import API_BASE_URL from "../services/api";

const ApproveDevice = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const approveDevice = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setSuccess(false);
        setMessage("Invalid approval link.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/devices/approve?token=${token}`
        );

        const data = await response.json();

        setSuccess(data.success);
        setMessage(data.message);
      } catch (error) {
        console.error(error);
        setSuccess(false);
        setMessage("Unable to approve device.");
      } finally {
        setLoading(false);
      }
    };

    approveDevice();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 px-6">

      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-10 text-center">

        {loading ? (
          <>
            <Loader2
              className="animate-spin mx-auto text-indigo-600"
              size={60}
            />

            <h2 className="text-2xl font-bold mt-6">
              Approving Device...
            </h2>

            <p className="text-gray-500 mt-3">
              Please wait while we verify your request.
            </p>
          </>
        ) : success ? (
          <>
            <CheckCircle2
              className="mx-auto text-green-600"
              size={70}
            />

            <h2 className="text-3xl font-bold mt-6 text-green-700">
              Device Approved
            </h2>

            <p className="mt-4 text-gray-600">
              {message}
            </p>

            <button
              onClick={() => navigate("/")}
              className="mt-8 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl transition"
            >
              Go to Login
            </button>
          </>
        ) : (
          <>
            <XCircle
              className="mx-auto text-red-600"
              size={70}
            />

            <h2 className="text-3xl font-bold mt-6 text-red-700">
              Approval Failed
            </h2>

            <p className="mt-4 text-gray-600">
              {message}
            </p>

            <button
              onClick={() => navigate("/")}
              className="mt-8 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl transition"
            >
              Back to Login
            </button>
          </>
        )}

      </div>
    </div>
  );
};

export default ApproveDevice;