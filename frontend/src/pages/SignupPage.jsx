import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from "react-toastify";

function SignupPage() {

  const navigate = useNavigate();
  const [formData, setFromData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleChange = (e) => {
    setFromData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password != formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/v1/auth/register/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password,
            confirm_password: formData.confirmPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Registration successful!");

        navigate("/login");
      } else {
        const errorMessage = JSON.stringify(data).toLowerCase();

        if (
          errorMessage.includes("email") &&
          (
            errorMessage.includes("already") ||
            errorMessage.includes("exists") ||
            errorMessage.includes("unique")
          )
        ) {
          toast.error(
            "Email already exists! Please use another email."
          );
        } else {
          toast.error(
            data.message ||
            data.detail ||
            "Registration failed!"
          );
        }
      }

    } catch (err) {
      console.log("Error:", err);
      toast.error("Unable to connect to the server!");
    }
  }

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-16 bg-forge-bg text-forge-text transition-colors duration-200">
      <div className="pointer-events-none absolute inset-0 industrial-grid opacity-20" />

      <div className="relative z-10 w-full max-w-md border border-forge-border bg-forge-card p-8 shadow-2xl">
        <div className="flex items-center justify-between border-b border-forge-border pb-3 font-['JetBrains_Mono'] text-xs text-forge-muted">
          <span>REGISTRATION</span>
        </div>

        <div className="mt-6 text-center">
          <h1 className="font-['Space_Grotesk'] text-2xl font-bold tracking-tight text-forge-text">
            CREATE YOUR FREE ACCOUNT
          </h1>
          <p className="mt-1 font-['Inter'] text-xs text-forge-muted">
            Start practicing SQL interview questions right away. No setup required.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="block font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-forge-muted">
              USERNAME
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              className="mt-1.5 w-full border border-forge-border bg-forge-card-alt px-3.5 py-2.5 font-['JetBrains_Mono'] text-sm text-forge-text placeholder-forge-muted/40 focus:border-forge-accent focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-forge-muted">
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
              className="mt-1.5 w-full border border-forge-border bg-forge-card-alt px-3.5 py-2.5 font-['JetBrains_Mono'] text-sm text-forge-text placeholder-forge-muted/40 focus:border-forge-accent focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-forge-muted">
              PASSWORD
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••••••"
              className="mt-1.5 w-full border border-forge-border bg-forge-card-alt px-3.5 py-2.5 font-['JetBrains_Mono'] text-sm text-forge-text placeholder-forge-muted/40 focus:border-forge-accent focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-forge-muted">
              CONFIRM PASSWORD
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••••••"
              className="mt-1.5 w-full border border-forge-border bg-forge-card-alt px-3.5 py-2.5 font-['JetBrains_Mono'] text-sm text-forge-text placeholder-forge-muted/40 focus:border-forge-accent focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="mt-6 w-full border border-forge-accent bg-forge-accent py-3 font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-wider text-[#101114] transition-colors hover:bg-forge-accent-hover"
          >
            CREATE FREE ACCOUNT ↗
          </button>
        </form>

        <div className="mt-6 border-t border-forge-border pt-4 text-center font-['JetBrains_Mono'] text-xs text-forge-muted">
          ALREADY HAVE AN ACCOUNT?{' '}
          <Link to="/login" className="text-forge-accent hover:underline">
            LOG IN HERE
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SignupPage
