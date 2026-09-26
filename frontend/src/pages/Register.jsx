import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const result = await register(name, email, password);
    if (result.success) {
      navigate("/");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="max-w-sm mx-auto p-8">
      <h1 className="font-display text-3xl text-plum mb-6">Create Account</h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 rounded-lg border border-lavender focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 rounded-lg border border-lavender focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1"> Set a password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={3}
            className="w-full px-3 py-2 rounded-lg border border-lavender focus:outline-none"
          />
        </div>
        {error && <p className="text-rose text-sm">{error}</p>}
        <button
          type="submit"
          className="bg-plum active:bg-purple-800 active:scale-95 text-white rounded-lg py-2.5 mt-2"
        >
          Register
        </button>
      </form>
      <p className="text-sm text-gray-500 mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-plum font-medium">
          Log In
        </Link>
      </p>
    </div>
  );
}