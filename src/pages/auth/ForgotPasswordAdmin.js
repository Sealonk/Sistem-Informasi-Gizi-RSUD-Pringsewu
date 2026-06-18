import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import LoginBackground from "../../components/auth/LoginBackground";
import LoginBrand from "../../components/auth/LoginBrand";
import LoginTextInput from "../../components/auth/LoginTextInput";
import { forgotPasswordAdmin } from "../../services/auth/authService";

export default function ForgotPasswordAdmin() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await forgotPasswordAdmin(email);
      setMessage(
        response.message ||
          "Tautan pemulihan password admin berhasil dikirim ke email."
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-5">
      <LoginBackground />

      <div className="relative z-10 w-full max-w-[500px]">
        <LoginBrand />

        <div className="bg-white/80 backdrop-blur-md rounded-[28px] shadow-soft border border-white/40 p-6 sm:p-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Lupa Password Admin
            </h2>
            <p className="text-slate-500 text-sm">
              Masukkan email administrator untuk menerima tautan reset.
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
              label="Email Admin"
              type="email"
              placeholder="Masukkan email admin"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              icon={Mail}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold text-[15px] shadow-lg shadow-blue-200 transition-all hover:scale-[1.01] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Mengirim..." : "Kirim Tautan Reset"}
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
