import { LayoutDashboard, Package, ShoppingCart, Users, BarChart3, UserCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { name: 'Overview', icon: <LayoutDashboard size={18} />, path: '/admin/dashboard' },
    { name: 'Products', icon: <Package size={18} />, path: '/admin/products' },
    { name: 'Orders', icon: <ShoppingCart size={18} />, path: '/admin/orders' },
    { name: 'Guests', icon: <Users size={18} />, path: '/admin/guests' },
    { name: 'Analytics', icon: <BarChart3 size={18} />, path: '/admin/analytics' },
  ];

  return (
    <aside className="w-64 h-screen bg-white border-r border-zinc-100 flex flex-col sticky top-0">
      <div className="p-8">
        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 mb-1">Terminal</h2>
        <h1 className="text-xl font-[900] tracking-tighter uppercase text-zinc-900">Efoy Gebya</h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || 
                          (item.path === '/admin/dashboard' && location.pathname === '/admin');
          
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${
                isActive 
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200' 
                  : 'text-zinc-500 hover:bg-zinc-50 hover:text-indigo-600'
              }`}
            >
              <div className={`${isActive ? 'text-white' : 'text-zinc-400 group-hover:text-indigo-600'} transition-colors`}>
                {item.icon}
              </div>
              <span className="text-[11px] font-bold uppercase tracking-widest">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* --- CLICKABLE PROFILE SECTION (UPDATED) --- */}
      <div className="p-6 border-t border-zinc-50">
        <Link 
          to="/admin/profile" 
          className={`flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-300 group ${
            location.pathname === '/admin/profile' 
              ? 'bg-zinc-50 border border-zinc-100' 
              : 'hover:bg-zinc-50'
          }`}
        >
          {/* Circular Avatar matching Sami Ale's initials style */}
          <div className="w-10 h-10 rounded-full bg-[#7c3aed] flex items-center justify-center text-white text-[10px] font-black shadow-sm border-2 border-white group-hover:scale-105 transition-transform">
            AD 
          </div>
          
          <div className="flex-1 overflow-hidden">
            {/* Removed "Hawi Girma" and aligned with Admin Profile title */}
            <p className="text-[10px] font-[900] uppercase text-zinc-900 truncate">Admin Profile</p>
            <p className="text-[8px] text-zinc-400 font-bold uppercase tracking-tighter">Verified Account</p>
          </div>

          <div className="text-zinc-300 group-hover:text-[#7c3aed] transition-colors">
            <UserCircle size={16} />
          </div>
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;