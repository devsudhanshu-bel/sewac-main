import { useNavigate } from "react-router-dom";
import { useState } from "react";
import API_BASE_URL from "../services/api";
import { ShieldCheck, Eye, EyeOff } from "lucide-react";

import "@fontsource/oswald";
import "@fontsource-variable/finlandica";

const BehaviorEnrollment = () => {
  const navigate = useNavigate();

  const [attempt, setAttempt] = useState(1);
  const [password, setPassword] = useState("");
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [typingStart, setTypingStart] = useState(null);
  const [typingEnd, setTypingEnd] = useState(null);

  const [backspaces, setBackspaces] = useState(0);

  const admin = JSON.parse(sessionStorage.getItem("admin") || "{}");
  const adminId = admin?.id;

  return (
    <div className="relative w-full min-h-screen overflow-hidden flex items-center justify-center px-4">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#4338ca] via-[#9333ea] to-[#ff2ea6]" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-[420px] rounded-[30px] border border-white/15 bg-white/10 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.22)] px-8 py-9">
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
            <ShieldCheck size={50} className="text-white" />
          </div>
        </div>

        <h1
          className="text-center text-white uppercase mt-8 text-[42px] leading-[52px]"
          style={{ fontFamily: "Oswald, sans-serif" }}
        >
          Behavior
          <br />
          Enrollment
        </h1>

        <p
          className="text-center text-white/70 mt-5 leading-7"
          style={{ fontFamily: "Finlandica, sans-serif" }}
        >
          Please type your administrator password five consecutive times.
          <br />
          <br />
          Attempt <span className="font-bold">{attempt}</span> of 5
        </p>
        <div className="mt-5 w-full h-3 rounded-full bg-white/20 overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-500"
            style={{
              width: `${attempt * 20}%`,
            }}
          />
        </div>

        <div className="mt-8">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              if (!typingStart) {
                setTypingStart(Date.now());
              }

              setTypingEnd(Date.now());

              setPassword(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Backspace") {
                setBackspaces((prev) => prev + 1);
              }
            }}
            placeholder="Administrator Password"
            className="w-full h-[56px] rounded-[16px]
bg-white/10
border border-white/20
px-5
text-white
placeholder:text-white/50
outline-none"
          />

          <button
            disabled={loading}
            className="mt-5
w-full
h-[56px]
rounded-[18px]
bg-white
text-[#7c3aed]
text-xl
disabled:opacity-50
disabled:cursor-not-allowed"
            style={{
              fontFamily: "Oswald,sans-serif",
            }}
            onClick={async () => {
              if (password.trim().length === 0) {
                return;
              }
              const typingDuration = Math.max(typingEnd - typingStart, 1);

              const typingSpeed = Number(
                (password.length / (typingDuration / 1000)).toFixed(2),
              );

              const dwellTime = Number(
                (typingDuration / password.length).toFixed(2),
              );

              const flightTime = Number(
                (typingDuration / Math.max(password.length - 1, 1)).toFixed(2),
              );

              const errorRate = Number(
                ((backspaces / Math.max(password.length, 1)) * 100).toFixed(2),
              );

              const sample = {
                dwell_time: dwellTime,
                flight_time: flightTime,
                typing_speed: typingSpeed,
                backspace_usage: backspaces,
                error_rate: errorRate,
              };

              const updated = [...samples, sample];

              setSamples(updated);

              setPassword("");
              document.activeElement.blur();

              setTimeout(() => {
                document.querySelector("input")?.focus();
              }, 100);

              setTypingStart(null);

              setTypingEnd(null);

              setBackspaces(0);

              if (attempt < 5) {
                setAttempt(attempt + 1);

                return;
              }

              try {
                setLoading(true);
                

                const response = await fetch(
                  `${API_BASE_URL}/api/behavior/enroll`,

                  {
                    method: "POST",

                    headers: {
                      "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                      adminId,

                      samples: updated,
                    }),
                  },
                );

                const data = await response.json();

                if (response.ok) {
                  sessionStorage.removeItem("token");

                  sessionStorage.removeItem("admin");

                  setTimeout(() => {
                    navigate("/");
                  }, 1000);
                } else {
                  alert(data.message);
                }
              } catch (err) {
                console.error(err);

                alert("Enrollment failed.");
              } finally {
                setLoading(false);
              }
            }}
          >
            {loading ? "ENROLLING..." : `CONTINUE (${attempt}/5)`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BehaviorEnrollment;
