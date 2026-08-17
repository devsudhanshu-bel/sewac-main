import API_BASE_URL, { SEWAC_MAIN_URL } from "../services/api";
import { User, Lock, Eye, EyeOff, ShieldCheck, Loader2 } from "lucide-react";

import { useState, useEffect, useRef } from "react";

import { useNavigate } from "react-router-dom";
import { getDeviceFingerprint } from "../utils/deviceFingerprint";
import gsap from "gsap";
import "@fontsource/oswald";
import "@fontsource-variable/finlandica";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [message, setMessage] = useState("");

  const cardRef = useRef(null);
  const logoRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const formRef = useRef(null);
  const buttonRef = useRef(null);
  const bgGlow1 = useRef(null);
  const bgGlow2 = useRef(null);
  const bgGlow3 = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      {
        opacity: 0,
        scale: 0.85,
        y: 50,
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1,
        ease: "power4.out",
      },
    );

    gsap.fromTo(
      logoRef.current,
      {
        opacity: 0,
        scale: 0,
        rotate: -180,
      },
      {
        opacity: 1,
        scale: 1,
        rotate: 0,
        duration: 1.2,
        delay: 0.2,
        ease: "back.out(1.7)",
      },
    );

    gsap.fromTo(
      titleRef.current,
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: 0.4,
        ease: "power3.out",
      },
    );

    gsap.fromTo(
      subtitleRef.current,
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: 0.55,
        ease: "power3.out",
      },
    );

    gsap.fromTo(
      formRef.current.children,
      {
        opacity: 0,
        y: 25,
      },
      {
        opacity: 1,
        y: 0,
        stagger: 0.12,
        duration: 0.8,
        delay: 0.7,
        ease: "power3.out",
      },
    );

    gsap.to(buttonRef.current, {
      boxShadow: "0px 0px 35px rgba(255,255,255,0.30)",
      repeat: -1,
      yoyo: true,
      duration: 2,
      ease: "power1.inOut",
    });

    gsap.to(bgGlow1.current, {
      x: 50,
      y: 30,
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    gsap.to(bgGlow2.current, {
      x: -40,
      y: -20,
      duration: 10,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    gsap.to(bgGlow3.current, {
      scale: 1.15,
      duration: 6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {
      // -------------------------------------------------
      // STEP 1: Identity Authentication
      // Email + Password → JWT
      // -------------------------------------------------

      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid credentials");
        return;
      }

      const tempToken = data.token;
      const tempAdmin = data.admin;

      if (!tempToken || !tempAdmin) {
        setError("Authentication Failed");
        return;
      }

      // -------------------------------------------------
      // Worker Login
      // Workers bypass CMADS device verification
      // and directly access SEWAC
      // -------------------------------------------------

      if (tempAdmin.role === "WORKER") {
        sessionStorage.setItem("token", tempToken);

        sessionStorage.setItem("admin", JSON.stringify(tempAdmin));

        sessionStorage.setItem(
          "permissions",
          JSON.stringify(data.permissions || []),
        );

        window.location.href = `https://sewac-main-frontend.onrender.com/auth/callback?token=${encodeURIComponent(tempToken)}`;

        return;
      }

      // -------------------------------------------------
      // STEP 2: Device Verification
      // Behavioral authentication has been removed.
      // -------------------------------------------------

      const fingerprint = getDeviceFingerprint();

      const deviceResponse = await fetch(`${API_BASE_URL}/api/devices/verify`, {
        method: "POST",

        headers: {
          Authorization: `Bearer ${tempToken}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          fingerprint,
        }),
      });

      const device = await deviceResponse.json();
      console.log("DEVICE RESPONSE:", device);
      console.log("TOKEN:", tempToken);

      // -------------------------------------------------
      // Device verification failed
      // -------------------------------------------------

      if (!device.success) {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("admin");
        sessionStorage.removeItem("permissions");

        setError(device.message || "Authentication Failed");

        return;
      }

      // -------------------------------------------------
      // STEP 3: Unknown Device
      // Request device registration/approval
      // -------------------------------------------------

      if (!device.known) {
        const browser = navigator.userAgent.includes("Edg")
          ? "Microsoft Edge"
          : navigator.userAgent.includes("Chrome")
            ? "Google Chrome"
            : navigator.userAgent.includes("Firefox")
              ? "Mozilla Firefox"
              : navigator.userAgent.includes("Safari")
                ? "Safari"
                : "Unknown Browser";

        const os = navigator.userAgent.includes("Windows")
          ? "Windows"
          : navigator.userAgent.includes("Mac")
            ? "macOS"
            : navigator.userAgent.includes("Linux")
              ? "Linux"
              : "Unknown OS";

        const deviceName = `${browser} (${os})`;

        const registrationResponse = await fetch(
          `${API_BASE_URL}/api/devices/request-registration`,
          {
            method: "POST",

            headers: {
              Authorization: `Bearer ${tempToken}`,
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              device_name: deviceName,
              fingerprint,
            }),
          },
        );

        const registration = await registrationResponse.json();

        setError("");

        setMessage(
          registration.message ||
            "A device approval email has been sent to your registered email address. Please approve the device and log in again.",
        );

        sessionStorage.removeItem("token");
        sessionStorage.removeItem("admin");
        sessionStorage.removeItem("permissions");

        return;
      }

      // -------------------------------------------------
      // STEP 4: Successful Authentication
      //
      // Device is known.
      // No behavioral authentication.
      // No risk evaluation.
      //
      // Store authentication data and redirect
      // directly to SEWAC.
      // -------------------------------------------------

      sessionStorage.setItem("token", tempToken);

      sessionStorage.setItem("admin", JSON.stringify(tempAdmin));

      sessionStorage.setItem(
        "permissions",
        JSON.stringify(data.permissions || []),
      );

      window.location.href = `https://sewac-main-frontend.onrender.com/auth/callback?token=${encodeURIComponent(tempToken)}`;
    } catch (err) {
      console.error("Login Error:", err);

      setError("Authentication Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden flex items-center justify-center px-4">
      {/* ========================================= */}
      {/* BACKGROUND */}
      {/* ========================================= */}

      <div className="absolute inset-0 bg-gradient-to-br from-[#4338ca] via-[#9333ea] to-[#ff2ea6]" />

      {/* ========================================= */}
      {/* GLOW EFFECTS */}
      {/* ========================================= */}

      <div
        ref={bgGlow1}
        className="absolute top-[-200px] left-[-150px] w-[500px] h-[500px] rounded-full bg-blue-400/20 blur-[120px]"
      />

      <div
        ref={bgGlow2}
        className="absolute bottom-[-200px] right-[-150px] w-[500px] h-[500px] rounded-full bg-pink-500/20 blur-[120px]"
      />

      <div
        ref={bgGlow3}
        className="absolute w-[350px] h-[350px] rounded-full bg-violet-300/20 blur-[100px]"
      />

      {/* ========================================= */}
      {/* LOGIN CARD */}
      {/* ========================================= */}

      <form
        ref={cardRef}
        onSubmit={handleLogin}
        className="relative z-10 w-full max-w-[400px] rounded-[30px] border border-white/15 bg-white/10 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.22)] px-8 py-9"
      >
        {/* ========================================= */}
        {/* LOGO */}
        {/* ========================================= */}

        <div className="flex justify-center">
          <div
            ref={logoRef}
            className="w-24 h-24 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shadow-2xl"
          >
            <ShieldCheck size={50} className="text-white" />
          </div>
        </div>

        {/* ========================================= */}
        {/* TITLE */}
        {/* ========================================= */}

        <div className="text-center mt-7">
          <h1
            ref={titleRef}
            style={{
              fontFamily: "Oswald, sans-serif",
            }}
            className="text-white text-[46px] tracking-tight uppercase"
          >
            Welcome Back
          </h1>

          <p
            ref={subtitleRef}
            style={{
              fontFamily: "Finlandica, sans-serif",
            }}
            className="text-white/70 text-[15px] mt-2 leading-relaxed"
          >
            Login to the SEWAC Admin Portal
          </p>
        </div>

        {/* ========================================= */}
        {/* SUCCESS MESSAGE */}
        {/* ========================================= */}

        {message && (
          <div className="mt-5 rounded-xl border border-green-300 bg-green-100 px-4 py-3 text-center text-green-700">
            {message}
          </div>
        )}

        {/* ========================================= */}
        {/* ERROR MESSAGE */}
        {/* ========================================= */}

        {error && (
          <div className="mt-5 bg-red-500/20 border border-red-400/30 text-white text-sm rounded-xl px-4 py-3 text-center">
            {error}
          </div>
        )}

        {/* ========================================= */}
        {/* FORM */}
        {/* ========================================= */}

        <div ref={formRef} className="mt-7 space-y-5">
          {/* EMAIL */}

          <div className="h-[58px] bg-white/10 border border-white/15 rounded-[18px] flex items-center px-5 backdrop-blur-xl hover:bg-white/15 transition-all duration-300">
            <User size={20} className="text-white/70" />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              required
              className="flex-1 h-full bg-transparent outline-none px-4 text-white text-[15px] placeholder:text-white/50"
            />
          </div>

          {/* PASSWORD */}

          <div className="h-[58px] bg-white/10 border border-white/15 rounded-[18px] flex items-center px-5 backdrop-blur-xl hover:bg-white/15 transition-all duration-300">
            <Lock size={20} className="text-white/70" />

            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="flex-1 h-full bg-transparent outline-none px-4 text-white text-[15px] placeholder:text-white/50"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-white/70 hover:text-white transition-all duration-300"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* FORGOT PASSWORD */}

          <div className="flex justify-end mt-3">
            <button
              type="button"
              className="text-sm text-white/70 hover:text-white transition"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </button>
          </div>

          {/* LOGIN BUTTON */}

          <button
            ref={buttonRef}
            type="submit"
            disabled={loading}
            style={{
              fontFamily: "Oswald, sans-serif",
            }}
            className="w-full h-[58px] rounded-[18px] bg-white text-[#7c3aed] text-[22px] tracking-wide shadow-2xl hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 mt-2 flex items-center justify-center gap-3 disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 size={22} className="animate-spin" />
                SIGNING IN
              </>
            ) : (
              "SIGN IN"
            )}
          </button>
        </div>

        {/* ========================================= */}
        {/* FOOTER */}
        {/* ========================================= */}

        <div className="text-center mt-8">
          <p
            style={{
              fontFamily: "Finlandica, sans-serif",
            }}
            className="text-white/50 text-[13px]"
          >
            © 2026 SEWAC RFID System
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
