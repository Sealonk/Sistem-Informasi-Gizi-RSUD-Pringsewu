import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginBackground from "../../components/auth/LoginBackground";
import LoginBrand from "../../components/auth/LoginBrand";
import LoginCard from "../../components/auth/LoginCard";
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
      <LoginBackground />

      <div
        className="
          relative
          z-10
          w-full
          max-w-[500px]
        "
      >
        <LoginBrand />

        <LoginCard
          error={error}
          username={username}
          password={password}
          showPassword={showPassword}
          loading={loading}
          onUsernameChange={(e) => setUsername(e.target.value)}
          onPasswordChange={(e) => setPassword(e.target.value)}
          onTogglePassword={() => setShowPassword((current) => !current)}
          onSubmit={handleLogin}
        />
      </div>
    </div>
  );
}
