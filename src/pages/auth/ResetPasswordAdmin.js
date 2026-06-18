import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Lock } from "lucide-react";
import LoginBackground from "../../components/auth/LoginBackground";
import LoginBrand from "../../components/auth/LoginBrand";
import LoginTextInput from "../../components/auth/LoginTextInput";
import { resetPasswordAdmin } from "../../services/auth/authService";

export default function ResetPasswordAdmin() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);

  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    if (!token) {
      setError("Token reset password tidak ditemukan.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password baru minimal 6 karakter.");
      setLoading(false);
      return;
    }

    if (password !== confirmation) {
      setError("Konfirmasi password belum sama.");
      setLoading(false);
      return;
    }

    try {
      const response = await resetPasswordAdmin({
        token,
        newPassword: password,
      });
      setMessage(response.message || "Password admin berhasil diubah.");
      setTimeout(() => navigate("/"), 1800);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const passwordToggle = (
    <button
      type="button"
      onClick={() => setShowPassword((current) => !current)}
      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 transition-colors flex items-center justify-center"
    >
      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  );

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-5">
      <LoginBackground />

      <div className="relative z-10 w-full max-w-[500px]">
        <LoginBrand />

        <div className="bg-white/80 backdrop-blur-md rounded-[28px] shadow-soft border border-white/40 p-6 sm:p-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Reset Password Admin
            </h2>
            <p className="text-slate-500 text-sm">
              Buat password baru untuk akun administrator.
            </p>
          </div>

          {message && (
            <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm rounded-2xl p-4 mb-5 text-center">
              {message}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl p-4 mb-5 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <LoginTextInput
              label="Password Baru"
              type={showPassword ? "text" : "password"}
              placeholder="Masukkan password baru"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              icon={Lock}
              rightElement={passwordToggle}
            />

            <LoginTextInput
              label="Konfirmasi Password"
              type={showPassword ? "text" : "password"}
              placeholder="Ulangi password baru"
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              icon={Lock}
              rightElement={passwordToggle}
            />

            <button
              type="submit"
              disabled={loading || !token}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold text-[15px] shadow-lg shadow-blue-200 transition-all hover:scale-[1.01] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Menyimpan..." : "Simpan Password Baru"}
            </button>
          </form>

          <Link
            to="/"
            className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft size={16} />
            Kembali ke login
          </Link>
        </div>
      </div>
    </div>
  );
}
