import { useState } from 'react'
import { Link , useNavigate } from 'react-router-dom'
import axios from "axios"
import { toast } from "react-toastify";



function LoginPage() {
  
  const navigate = useNavigate();

  const [formData , setFormData] = useState({
    username :"",
    password :"",
  });

  const [loading,setLoading] = useState(false);

  const handleChange = (e) =>{
    setFormData({
      ...formData,
      [e.target.name] : e.target.value,
    });
  };

  const handleSubmit = async (e) =>{
    e.preventDefault();

    setLoading(true);

    try{
      const response = await axios.post (
        "http://127.0.0.1:8000/api/v1/auth/login/",
        {
          username : formData.username,
          password : formData.password,
        }
      );

      localStorage.setItem (
        "accessToken",
        response.data.access
      );

      localStorage.setItem(
        "refreshToken",
        response.data.refresh
      );

      toast.success("Login successful!");

      // Redirect to dashboard
        navigate("/dashboard");
    }catch(error){

      const errorMessage = 
      error.response?.data?.detail ||
      error.response?.data?.message ||
      "Invalid email or password";

      toast.error(errorMessage);
    }finally{
      setLoading(false);
    }
  }


  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-16 bg-forge-bg text-forge-text transition-colors duration-200">
      <div className="pointer-events-none absolute inset-0 industrial-grid opacity-20" />

      <div className="relative z-10 w-full max-w-md border border-forge-border bg-forge-card p-8 shadow-2xl">
        <div className="flex items-center justify-between border-b border-forge-border pb-3 font-['JetBrains_Mono'] text-xs text-forge-muted">
          <span>SIGN IN</span>
          <span className="text-forge-accent">SQLFORGE</span>
        </div>

        <div className="mt-6 text-center">
          <h1 className="font-['Space_Grotesk'] text-2xl font-bold tracking-tight text-forge-text">
            LOG IN TO YOUR ACCOUNT
          </h1>
          <p className="mt-1 font-['Inter'] text-xs text-forge-muted">
            Sign in to continue your SQL practice and track your progress.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="block font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-forge-muted">
              USERNAME
            </label>
            <input
              type="text"
              name = "username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className="mt-1.5 w-full border border-forge-border bg-forge-card-alt px-3.5 py-2.5 font-['JetBrains_Mono'] text-sm text-forge-text placeholder-forge-muted/40 focus:border-forge-accent focus:outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="block font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-forge-muted">
                PASSWORD
              </label>
              <a href="#" className="font-['JetBrains_Mono'] text-[11px] text-forge-accent hover:underline">
                FORGOT PASSWORD?
              </a>
            </div>
            <input
              type="password"
              name = "password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••••••"
              className="mt-1.5 w-full border border-forge-border bg-forge-card-alt px-3.5 py-2.5 font-['JetBrains_Mono'] text-sm text-forge-text placeholder-forge-muted/40 focus:border-forge-accent focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="mt-6 w-full border border-forge-accent bg-forge-accent py-3 font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-wider text-[#101114] transition-colors hover:bg-forge-accent-hover"
            disabled={loading}
          >
            {loading ? "LOGGING IN..." : "LOG IN ↗"}
          </button>
        </form>

        <div className="mt-6 border-t border-forge-border pt-4 text-center font-['JetBrains_Mono'] text-xs text-forge-muted">
          DON'T HAVE AN ACCOUNT YET?{' '}
          <Link to="/signup" className="text-forge-accent hover:underline">
            SIGN UP FREE
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
