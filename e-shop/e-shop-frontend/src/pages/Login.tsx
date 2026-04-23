import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff, Loader2, ArrowLeft, ShoppingBag } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email: formData.email.toLowerCase(),
        password: formData.password
      });
      
      const { token, isAdmin, role } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(response.data));

      if (isAdmin === true || role === 'admin') {
        navigate('/admin/dashboard'); 
      } else {
        navigate('/products'); 
      }

    } catch (err: any) {
      setError(err.response?.data?.message || 'INVALID EMAIL OR PASSWORD');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-white flex overflow-hidden">
      
      {/* LEFT COLUMN - IMAGE AREA (FULL HEIGHT) */}
      <div className="hidden md:block w-[60%] h-full relative bg-zinc-100 overflow-hidden">
        <img 
          src="/public/log in.jpg" 
          alt="E-commerce Login" 
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10"></div>
      </div>

      {/* RIGHT COLUMN - COMPACT FORM AREA */}
      <div className="w-full md:w-[40%] h-full flex flex-col justify-center px-10 lg:px-16 relative bg-white">
        
        {/* TOP BACK ICON */}
        <button 
          onClick={() => navigate(-1)} 
          className="absolute top-8 left-10 flex items-center gap-2 text-zinc-300 hover:text-purple-500 transition-colors active:scale-95"
        >
          <ArrowLeft size={16} />
          <span className="text-[8px] font-black uppercase tracking-[0.4em] italic">Back</span>
        </button>

        <div className="w-full max-w-[360px] mx-auto">
          
          {/* COMPACT HEADER */}
          <div className="mb-8">
            <div className="bg-purple-50 p-3 rounded-2xl inline-block mb-4">
              <ShoppingBag className="text-purple-600 h-6 w-6" />
            </div>
            <h1 className="text-3xl font-black text-black tracking-tighter uppercase italic leading-tight">
              EFOY <span className="text-zinc-200">GEBYA</span>
            </h1>
            <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.4em] italic mt-1">
              Sign in to continue
            </p>
          </div>
          
          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-600 text-[9px] font-black uppercase tracking-widest rounded-2xl border border-red-100 italic">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-3">
            <div className="space-y-1">
              <input 
                type="email" 
                placeholder="EMAIL ADDRESS"
                className="w-full bg-zinc-50 h-14 px-6 rounded-2xl text-[10px] font-bold outline-none border border-transparent focus:border-purple-100 focus:bg-white transition-all"
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                required 
              />
            </div>

            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="PASSWORD"
                className="w-full bg-zinc-50 h-14 px-6 rounded-2xl text-[10px] font-bold outline-none border border-transparent focus:border-purple-100 focus:bg-white transition-all"
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                required 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-purple-600 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* MINIMIZED PURPLE BUTTON */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white font-black uppercase tracking-[0.3em] text-[10px] h-14 rounded-2xl mt-4 flex items-center justify-center italic shadow-lg shadow-purple-100 transition-all active:scale-[0.98]"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : 'Authenticate'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-zinc-50 text-center">
            <Link to="/register" className="group">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-purple-600 group-hover:text-black transition-colors italic">
                Create Account
              </span>
            </Link>
          </div>
        </div>

        {/* STAMP */}
        <div className="absolute bottom-6 left-0 right-0 text-center">
            <p className="text-[7px] font-black uppercase tracking-[0.5em] text-zinc-200 italic">EFOY COMMERCIAL © 2026</p>
        </div>
      </div>
    </div>
  );
};

export default Login;