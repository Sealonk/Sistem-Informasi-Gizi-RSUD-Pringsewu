import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";

export default function LoginPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      await loginUser({
        username,
        password,
      });

      navigate("/portal");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        relative
        overflow-hidden
        px-5
      "
    >

      {/* BACKGROUND IMAGE */}
      <div
        className="
          absolute
          inset-0
          bg-cover
          bg-center
        "
        style={{
          backgroundImage:
            "url('/img/RSUD Pringsewu.jpeg')",
        }}
      />
      <div
        className="
          absolute
          inset-0
          bg-white/85
          backdrop-blur-[2px]
        "
      />
      <div
        className="
          absolute
          -top-40
          -left-40
          w-[450px]
          h-[450px]
          bg-blue-400/20
          rounded-full
          blur-3xl
        "
      />

      {/* BLUE BLUR BOTTOM */}
      <div
        className="
          absolute
          -bottom-40
          -right-40
          w-[450px]
          h-[450px]
          bg-sky-300/20
          rounded-full
          blur-3xl
        "
      />

      {/* LOGIN CONTAINER */}
      <div
        className="
          relative
          z-10
          w-full
          max-w-[500px]
        "
      >

        {/* BRAND */}
        <div className="text-center mb-8">

          <h1
            className="
              text-4xl
              font-extrabold
              text-slate-900
              tracking-tight
              mb-2
            "
          >
            RSUD Pringsewu
          </h1>

          <p
            className="
              text-slate-500
              text-base
            "
          >
            Sistem Informasi Instalasi Gizi
          </p>

        </div>

        {/* CARD */}
        <div
          className="
            bg-white/80
            backdrop-blur-md
            rounded-[28px]
            shadow-soft
            border
            border-white/40
            p-10
          "
        >

          {/* HEADER */}
          <div className="text-center mb-8">

            <h2
              className="
                text-3xl
                font-bold
                text-slate-900
                mb-2
              "
            >
              Login
            </h2>
            <p
              className="
                text-slate-500
                text-sm
              "
            >
              Silakan masuk untuk melanjutkan
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <div
              className="
                bg-red-50
                border
                border-red-100
                text-red-600
                text-sm
                rounded-2xl
                p-4
                mb-5
                text-center
              "
            >
              {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleLogin}>

            {/* USERNAME */}
            <div className="mb-5">

              <label
                className="
                  block
                  mb-2
                  text-sm
                  font-semibold
                  text-slate-700
                "
              >
                Username
              </label>

              <div className="relative">

                <img
                  src="/img/LogoUser.png"
                  alt="user"
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    w-[18px]
                    opacity-50
                  "
                />

                <input
                  type="text"
                  placeholder="Masukkan username"
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value)
                  }
                  required
                  className="
                    w-full
                    h-14
                    rounded-2xl
                    border
                    border-blue-100
                    bg-white
                    pl-12
                    pr-4
                    text-[15px]
                    text-slate-900
                    outline-none
                    transition-all
                    focus:border-blue-500
                    focus:ring-4
                    focus:ring-blue-100
                  "
                />

              </div>
            </div>

            {/* utnuk PASSWORD */}
            <div className="mb-6">

              <label
                className="
                  block
                  mb-2
                  text-sm
                  font-semibold
                  text-slate-700
                "
              >
                Password
              </label>

              <div className="relative">

                <img
                  src="/img/lock.png"
                  alt="lock"
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    w-[18px]
                    opacity-50
                  "
                />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                  className="
                    w-full
                    h-14
                    rounded-2xl
                    border
                    border-blue-100
                    bg-white
                    pl-12
                    pr-12
                    text-[15px]
                    text-slate-900
                    outline-none
                    transition-all
                    focus:border-blue-500
                    focus:ring-4
                    focus:ring-blue-100
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                  "
                >
                  <img
                    src="/img/eye.jpg"
                    alt="eye"
                    className="
                      w-[18px]
                      opacity-50
                    "
                  />
                </button>
              </div>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                h-14
                rounded-2xl
                bg-gradient-to-r
                from-blue-600
                to-blue-500
                text-white
                font-semibold
                text-[15px]
                shadow-lg
                shadow-blue-200
                transition-all
                hover:scale-[1.01] hover:shadow-xl
              "
            >
              {loading ? "Loading..." : "Login"}
            </button>
          </form>

          {/* FOOTER */}
          <div
            className="
              mt-6
              text-center
              text-[13px]
              text-slate-500
            "
          >
            Akses hanya untuk Petugas Gizi
          </div>
        </div>
      </div>
    </div>
  );
}