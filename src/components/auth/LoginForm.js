import { User, Lock, Eye, EyeOff } from "lucide-react";
import LoginTextInput from "./LoginTextInput";

export default function LoginForm({
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
    <form onSubmit={onSubmit}>
      <LoginTextInput
        label="Username"
        placeholder="Masukkan username"
        value={username}
        onChange={onUsernameChange}
        icon={User}
      />

      <LoginTextInput
        label="Password"
        type={showPassword ? "text" : "password"}
        placeholder="Masukkan password"
        value={password}
        onChange={onPasswordChange}
        icon={Lock}
        rightElement={
          <button
            type="button"
            onClick={onTogglePassword}
            className="
              absolute
              right-4
              top-1/2
              -translate-y-1/2
              text-slate-400
              hover:text-blue-500
              transition-colors
              duration-300
              flex
              items-center
              justify-center
            "
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        }
      />

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
          disabled:cursor-not-allowed
          disabled:opacity-70
        "
      >
        {loading ? "Loading..." : "Login"}
      </button>
    </form>
  );
}
