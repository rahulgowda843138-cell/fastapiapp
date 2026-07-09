import { useState } from "react";
import { login } from "../Services/AuthService";
import "./Login.css";

type Props = {
  onLogin: (token: string) => void;
  onSwitchToRegister: () => void;
};

function Login({ onLogin, onSwitchToRegister }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await login({
        email,
        password,
      });

      onLogin(response.access_token);
    } catch (error) {
      console.error(error);
      alert("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <h1>Rahul Spark</h1>

        <h3>Welcome Back 👋</h3>

        <p>Login to continue</p>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <div className="divider">
          OR
        </div>

        <button
          className="register-btn"
          onClick={onSwitchToRegister}
        >
          Create New Account
        </button>

      </div>

    </div>
  );
}

export default Login;