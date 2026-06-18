import LoginForm from "./LoginForm";
import { Link } from "react-router-dom";

export default function LoginCard({
  error,
  username,
  password,
  showPassword,
  loading,
  onUsernameChange,
  onPasswordChange,
  onTogglePassword,
  onSubmit,
}) {
  return (
    <div
      className="
        bg-white/80
        backdrop-blur-md
        rounded-[28px]
        shadow-soft
        border
        border-white/40
        p-6
        sm:p-10
      "
    >
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

      <LoginForm
        username={username}
        password={password}
        showPassword={showPassword}
        loading={loading}
        onUsernameChange={onUsernameChange}
        onPasswordChange={onPasswordChange}
        onTogglePassword={onTogglePassword}
        onSubmit={onSubmit}
      />

      <div className="mt-5 text-center">
        <Link
          to="/lupa-password-admin"
          className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          Lupa password admin?
        </Link>
      </div>

      <div
        className="
          mt-5
          text-center
          text-[13px]
          text-slate-500
        "
      >
        Akses hanya untuk Petugas Gizi
      </div>
    </div>
  );
}
