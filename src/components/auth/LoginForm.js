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
        icon="/img/LogoUser.png"
        iconAlt="user"
      />

      <LoginTextInput
        label="Password"
        type={showPassword ? "text" : "password"}
        placeholder="Masukkan password"
        value={password}
        onChange={onPasswordChange}
        icon="/img/lock.png"
        iconAlt="lock"
        rightElement={
          <button
            type="button"
            onClick={onTogglePassword}
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
