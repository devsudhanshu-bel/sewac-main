import { useState } from "react";

const ForgotPassword = () => {

  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    alert(
      "Password reset functionality will be integrated in the next phase."
    );
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-6">

      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8">

        <h1 className="text-3xl font-bold text-white mb-2">
          Forgot Password
        </h1>

        <p className="text-white/60 mb-8">
          Enter your administrator email.
        </p>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full h-12 px-4 rounded-xl bg-white/10 text-white border border-white/10 outline-none"
            required
          />

          <button
            type="submit"
            className="w-full mt-5 h-12 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold"
          >
            Send Reset Link
          </button>

        </form>

      </div>

    </div>
  );
};

export default ForgotPassword;