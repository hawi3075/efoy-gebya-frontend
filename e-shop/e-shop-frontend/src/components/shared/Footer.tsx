import { Link } from 'react-router-dom';
import { 
  ArrowUpRight, 
  Mail, 
  MapPin, 
  Globe, 
  MessageSquare, 
  Send 
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white p-6 font-sans selection:bg-[#a855f7] selection:text-white">
      {/* Light Black Container with Curved Borders */}
      <div className="max-w-[1400px] mx-auto bg-zinc-900 rounded-[2.5rem] p-10 md:p-16 text-zinc-400">
        
        {/* MAIN SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
          
          {/* Brand Identity */}
          <div className="md:col-span-5 space-y-6">
            <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white leading-none">
              Efoy <br /> <span className="text-[#a855f7]">Gebya</span>
            </h2>
            <p className="text-zinc-500 text-xs font-bold leading-relaxed max-w-xs uppercase tracking-widest">
              Premium marketplace aesthetics and technical precision.
            </p>
            <div className="flex gap-3">
              {[Globe, MessageSquare, Send].map((Icon, i) => (
                <a key={i} href="#" className="w-11 h-11 rounded-2xl bg-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-[#a855f7] hover:text-white transition-all duration-500">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div className="space-y-6">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 italic">Explore</p>
              <ul className="space-y-3">
                {['Products', 'About', 'Contact'].map((item) => (
                  <li key={item}>
                    <Link to={`/${item.toLowerCase()}`} className="text-xs font-black uppercase text-zinc-300 hover:text-white transition-colors flex items-center gap-1 group">
                      {item} <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-all -translate-y-1" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 italic">Legal</p>
              <ul className="space-y-3">
                {['Shipping', 'Returns', 'Privacy'].map((item) => (
                  <li key={item}>
                    <Link to="#" className="text-xs font-black uppercase text-zinc-300 hover:text-white transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6 col-span-2 md:col-span-1">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 italic">Location</p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-xs font-bold text-zinc-300 uppercase tracking-tight">
                  <MapPin size={16} className="text-[#a855f7]" />
                  <span>Adama, Ethiopia</span>
                </li>
                <li className="flex items-center gap-3 text-xs font-bold text-zinc-300 uppercase tracking-tight">
                  <Mail size={16} className="text-[#a855f7]" />
                  <span>contact@efoygebya.com</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="pt-8 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
              © {currentYear} Efoy Gebya Inc.
            </span>
            <div className="h-1 w-1 rounded-full bg-zinc-700" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
              Technical Excellence
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;