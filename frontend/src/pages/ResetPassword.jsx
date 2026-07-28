import API_BASE_URL from "../services/api";
import { Lock, ShieldCheck, Loader2 } from "lucide-react";

import { useState, useEffect, useRef } from "react";

import gsap from "gsap";
import {
  useSearchParams,
  useNavigate,
} from "react-router-dom";

import "@fontsource/oswald";
import "@fontsource-variable/finlandica";

const ResetPassword = () => {
  const navigate = useNavigate();
  
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

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

  const handleReset = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match");

      setLoading(false);

      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          token,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Password reset successful. Redirecting to login...");

        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-[#4338ca] via-[#9333ea] to-[#ff2ea6]" />

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

      <form
        ref={cardRef}
        onSubmit={handleReset}
        className="relative z-10 w-full max-w-[400px] rounded-[30px] border border-white/15 bg-white/10 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.22)] px-8 py-9"
      >
        <div className="flex justify-center">
          <div
            ref={logoRef}
            className="w-24 h-24 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shadow-2xl"
          >
            <ShieldCheck size={50} className="text-white" />
          </div>
        </div>

        <div className="text-center mt-9">
          <h1
            ref={titleRef}
            style={{
              fontFamily: "Oswald, sans-serif",
            }}
            className="text-white text-[52px] leading-[0.9] tracking-tight uppercase"
          >
            RESET
            <br />
            PASSWORD
          </h1>

          <p
            ref={subtitleRef}
            style={{
              fontFamily: "Finlandica, sans-serif",
            }}
            className="text-white/70 text-[15px] mt-4 leading-relaxed"
          >
            Create a new secure administrator password
          </p>
        </div>

        <div ref={formRef} className="mt-10 space-y-6">
          <div className="h-[58px] bg-white/10 border border-white/15 rounded-[18px] flex items-center px-5">
            <Lock size={20} className="text-white/70" />

            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 h-full bg-transparent outline-none px-4 text-white placeholder:text-white/50"
            />
          </div>

          <div className="h-[58px] bg-white/10 border border-white/15 rounded-[18px] flex items-center px-5">
            <Lock size={20} className="text-white/70" />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="flex-1 h-full bg-transparent outline-none px-4 text-white placeholder:text-white/50"
            />
          </div>

          <button
            ref={buttonRef}
            type="submit"
            disabled={loading}
            style={{
              fontFamily: "Oswald, sans-serif",
            }}
            className="w-full h-[58px] rounded-[18px] bg-white text-[#7c3aed] text-[22px] tracking-wide shadow-2xl flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <Loader2 size={22} className="animate-spin" />
                RESETTING...
              </>
            ) : (
              "RESET PASSWORD"
            )}
          </button>

          {success && (
            <div className="bg-green-500/20 border border-green-400/30 text-white text-sm rounded-xl px-4 py-3 text-center">
              ✓ {success}
            </div>
          )}

          {error && (
            <div className="bg-red-500/20 border border-red-400/30 text-white text-sm rounded-xl px-4 py-3 text-center">
              {error}
            </div>
          )}
        </div>

        <div className="text-center mt-12">
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

export default ResetPassword;
