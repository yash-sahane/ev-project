import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { authAPI } from "@/api";

const SignupForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await authAPI.signup(username, password);
      if (response.token) {
        localStorage.setItem("token", response.token);
        navigate("/home");
      }
    } catch {
      setError("Signup failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSignup} className="flex flex-col space-y-4">
      {error && <div className="text-red-500">{error}</div>}
      <Input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Button type="submit">Sign Up</Button>
    </form>
  );
};

export default SignupForm;
