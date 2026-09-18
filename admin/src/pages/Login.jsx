import { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(backendUrl + "/api/user/admin", { email, password });
      if (response.data.success) {
        setToken(response.data.token);
        toast.success("Logged in");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-plum to-plum-light px-4">
      <form
        onSubmit={onSubmitHandler}
        className="bg-cream w-full max-w-sm rounded-2xl shadow-xl px-8 py-10"
      >
        <h1 className="font-display text-3xl text-plum mb-1">Selora</h1>
        <p className="text-sm text-ink/60 mb-6">Admin Panel</p>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@selora.com"
            required
            className="w-full px-3 py-2 rounded-lg border border-gold/40 bg-white focus:outline-none focus:ring-2 focus:ring-berry"
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
            className="w-full px-3 py-2 rounded-lg border border-gold/40 bg-white focus:outline-none focus:ring-2 focus:ring-berry"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2.5 rounded-full bg-berry text-white font-medium hover:bg-berry/90 transition-colors"
        >
          Log in
        </button>
      </form>
    </div>
  );
};

export default Login;