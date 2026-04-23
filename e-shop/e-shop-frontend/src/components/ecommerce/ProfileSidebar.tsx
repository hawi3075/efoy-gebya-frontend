import { User, MapPin, Package, Lock, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProfileSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ProfileSidebar = ({ activeTab, setActiveTab }: ProfileSidebarProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { name: 'My Account', icon: User }, 
    { name: 'Saved Addresses', icon: MapPin },
    { name: 'Order History', icon: Package },
    { name: 'Security', icon: Lock },
  ];

  return (
    <div className="w-72 h-screen bg-white border-r border-zinc-100 flex flex-col fixed left-0 top-0 z-50">
      <div className="p-8 border-b border-zinc-50">
        <h2 className="text-xl font-black uppercase tracking-tighter italic">
          Efoy <span className="text-[#a855f7]">Gebya</span>
        </h2>
      </div>

      <nav className="flex-1 p-6 space-y-4 mt-4">
        {menuItems.map((item) => (
          <button 
            key={item.name}
            onClick={() => setActiveTab(item.name)}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${
              activeTab === item.name 
                ? 'bg-[#a855f7]/10 text-[#a855f7]' 
                : 'text-zinc-500 hover:bg-zinc-50'
            }`}
          >
            <item.icon size={20} strokeWidth={activeTab === item.name ? 3 : 2} />
            <span className="text-xs font-black uppercase tracking-widest">{item.name}</span>
          </button>
        ))}
      </nav>

      <div className="p-8 border-t border-zinc-50">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-4 text-xs font-black uppercase text-red-500 hover:opacity-70 transition-opacity w-full text-left"
        >
          <LogOut size={20} /> Log Out
        </button>
      </div>
    </div>
  );
};

export default ProfileSidebar;