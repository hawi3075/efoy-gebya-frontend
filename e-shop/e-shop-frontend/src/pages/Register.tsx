import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { EyeOff, Eye, Loader2, ShieldCheck, ShieldAlert, ArrowLeft, ShoppingBag } from 'lucide-react';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isPasswordStrong = (pw: string) => {
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    return regex.test(pw);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isPasswordStrong(formData.password)) {
      return setError("PASSWORD MUST BE 8+ CHARS WITH A NUMBER & SPECIAL CHAR");
    }

    if (formData.password !== formData.confirmPassword) {
      return setError("PASSWORDS DO NOT MATCH");
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email.toLowerCase(),
        password: formData.password
      });
      
      const userData = response.data; 
      localStorage.setItem('token', userData.token); 
      localStorage.setItem('user', JSON.stringify(userData));
      
      navigate('/products');
    } catch (err: any) {
      setError(err.response?.data?.message || 'REGISTRATION FAILED');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-white flex overflow-hidden">
      
      {/* LEFT COLUMN - IMAGE AREA (SYNCED WITH LOGIN) */}
      <div className="hidden md:block w-[55%] h-full relative bg-zinc-100 overflow-hidden">
        <img 
          src="/public/log in.jpg" 
          alt="E-commerce Register" 
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10"></div>
      </div>

      {/* RIGHT COLUMN - REGISTRATION FORM */}
      <div className="w-full md:w-[45%] h-full flex flex-col justify-center px-10 lg:px-20 relative bg-white overflow-y-auto">
        
        {/* TOP BACK ICON */}
        <button 
          onClick={() => navigate(-1)} 
          className="absolute top-8 left-10 flex items-center gap-2 text-zinc-300 hover:text-purple-500 transition-colors active:scale-95"
        >
          <ArrowLeft size={16} />
          <span className="text-[8px] font-black uppercase tracking-[0.4em] italic">Back</span>
        </button>

        <div className="w-full max-w-[400px] mx-auto py-12">
          
          {/* HEADER */}
          <div className="mb-8">
            <div className="bg-purple-50 p-3 rounded-2xl inline-block mb-4">
              <ShoppingBag className="text-purple-600 h-6 w-6" />
            </div>
            <h1 className="text-3xl font-black text-black tracking-tighter uppercase italic leading-tight">
              JOIN <span className="text-zinc-200">EFOY</span>
            </h1>
            <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.4em] italic mt-1">
              Create your executive account
            </p>
          </div>
          
          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-600 text-[9px] font-black uppercase tracking-widest rounded-2xl border border-red-100 italic">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input 
                placeholder="FIRST NAME" 
                className="w-full bg-zinc-50 h-14 px-6 rounded-2xl text-[10px] font-bold outline-none border border-transparent focus:border-purple-100 focus:bg-white transition-all"
                onChange={(e) => setFormData({...formData, firstName: e.target.value})} 
                required 
              />
              <input 
                placeholder="LAST NAME" 
                className="w-full bg-zinc-50 h-14 px-6 rounded-2xl text-[10px] font-bold outline-none border border-transparent focus:border-purple-100 focus:bg-white transition-all" 
                onChange={(e) => setFormData({...formData, lastName: e.target.value})} 
                required 
              />
            </div>

            <input 
              type="email" 
              placeholder="EMAIL ADDRESS"
              className="w-full bg-zinc-50 h-14 px-6 rounded-2xl text-[10px] font-bold outline-none border border-transparent focus:border-purple-100 focus:bg-white transition-all" 
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
              required 
            />

            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="PASSWORD"
                className="w-full bg-zinc-50 h-14 px-6 rounded-2xl text-[10px] font-bold outline-none border border-transparent focus:border-purple-100 focus:bg-white transition-all"
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                required 
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-purple-600">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {formData.password && (
              <div className={`flex items-center gap-2 text-[8px] font-black uppercase px-2 ${isPasswordStrong(formData.password) ? 'text-green-500' : 'text-orange-400'}`}>
                {isPasswordStrong(formData.password) ? <ShieldCheck size={12} /> : <ShieldAlert size={12} />}
                {isPasswordStrong(formData.password) ? "Secure" : "Weak: Need number & symbol"}
              </div>
            )}

            <input 
              type="password" 
              placeholder="VERIFY PASSWORD"
              className="w-full bg-zinc-50 h-14 px-6 rounded-2xl text-[10px] font-bold outline-none border border-transparent focus:border-purple-100 focus:bg-white transition-all" 
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} 
              required 
            />

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white font-black uppercase tracking-[0.3em] text-[10px] h-14 rounded-2xl mt-4 flex items-center justify-center italic shadow-lg shadow-purple-100 transition-all active:scale-[0.98]"
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-zinc-50 text-center">
            <Link to="/login" className="group">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-1.5 block">Already a member?</span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-600 group-hover:text-black transition-colors italic">
                Login Here
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

export default Register;