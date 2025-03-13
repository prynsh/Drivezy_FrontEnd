import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Signin() {
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/profile", { credentials: "include" })
      .then((res) => {
        if (res.ok) navigate("/dashboard"); 
      });
  }, [navigate]);

  const handleLogin = () => {
    window.location.href = "http://localhost:5000/auth/google"; 
  };

  return (
    <div className="bg-slate-200 flex flex-col items-center justify-center min-h-screen w-full">
      <h1 className="text-5xl font-bold mb-6">Welcome to My App</h1>
      <button onClick={handleLogin} className="bg-black text-white py-2 px-4 rounded-md">
        🔑 Login with Google
      </button>
    </div>
  );
}

export default Signin;
