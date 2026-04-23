import { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, Loader2, Trash2, Users, ShieldCheck, Zap, Calendar } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import API from '../../api/axios'; 

const Guests = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [guests, setGuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await API.get('/admin/users');
      setGuests(response.data);
    } catch (err) {
      console.error("Failed to fetch guest list:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --- Dynamic Calculations ---
  const totalUsers = guests.length;
  const privilegedUsers = guests.filter(g => g.isAdmin).length;
  
  const newToday = guests.filter(guest => {
    const joinedDate = new Date(guest.createdAt);
    const today = new Date();
    return joinedDate.toDateString() === today.toDateString();
  }).length;

  const activeNow = guests.filter(g => g.isActive !== false).length;

  // --- Actions ---
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to remove this guest from the directory?")) {
      try {
        await API.delete(`/admin/users/${id}`);
        setGuests(guests.filter(g => g._id !== id));
      } catch (err) {
        alert("Action failed. Check backend permissions.");
      }
    }
  };

  // --- FIX: Search logic now combines firstName and lastName ---
  const filteredGuests = guests.filter(guest => {
    const fullName = `${guest.firstName || ''} ${guest.lastName || ''}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    return (
      fullName.includes(query) ||
      guest._id?.toLowerCase().includes(query) ||
      guest.email?.toLowerCase().includes(query)
    );
  });

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#fcfcfc]">
      <Loader2 className="animate-spin text-[#7c3aed]" size={40} />
    </div>
  );

  return (
    <div className="flex bg-[#fcfcfc] min-h-screen font-sans text-slate-900">
      <AdminSidebar />
      <main className="flex-1 p-12">
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-1 bg-[#7c3aed] rounded-full" /> 
            <h1 className="text-4xl font-[900] tracking-tighter uppercase text-black">Guest Directory</h1>
          </div>
          <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest ml-4">
            Operational Pulse: Verifying {totalUsers} registered entities.
          </p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total User', value: totalUsers, icon: <Users size={14} className="text-[#7c3aed]"/> },
            { label: 'Privileged', value: privilegedUsers, icon: <ShieldCheck size={14} className="text-[#7c3aed]"/> },
            { label: 'Active Now', value: activeNow, color: 'text-[#7c3aed]', icon: <Zap size={14} className="text-[#7c3aed]"/> },
            { label: 'New Today', value: newToday, icon: <Calendar size={14} className="text-[#7c3aed]"/> } 
          ].map((stat) => (
            <div key={stat.label} className="bg-white p-8 rounded-[2rem] border border-zinc-100 shadow-sm hover:border-[#7c3aed]/20 transition-all">
              <div className="flex items-center gap-2 mb-4">
                {stat.icon}
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">{stat.label}</p>
              </div>
              <h3 className={`text-3xl font-[900] tracking-tighter ${stat.color || 'text-black'}`}>{stat.value}</h3>
            </div>
          ))}
        </div>

        <section className="bg-white border border-zinc-100 rounded-[2.5rem] shadow-sm overflow-hidden">
          <div className="p-8 border-b border-zinc-50 flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7c3aed]" size={16} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SEARCH OPERATIONAL DATABASE..." 
                className="w-full bg-zinc-50 border-none py-4 pl-12 pr-6 rounded-xl text-[10px] font-bold tracking-widest outline-none focus:ring-2 focus:ring-[#7c3aed]/10 text-black placeholder:text-zinc-300" 
              />
            </div>
            <button className="p-4 border border-zinc-100 rounded-xl hover:bg-[#7c3aed] hover:text-white transition-all text-black">
              <Filter size={18}/>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/50">
                  <th className="px-10 py-6 text-[9px] font-black uppercase text-[#7c3aed] tracking-[0.2em]">Guest ID</th>
                  <th className="px-10 py-6 text-[9px] font-black uppercase text-[#7c3aed] tracking-[0.2em]">Full Name</th>
                  <th className="px-10 py-6 text-[9px] font-black uppercase text-[#7c3aed] tracking-[0.2em]">Email Address</th>
                  <th className="px-10 py-6 text-[9px] font-black uppercase text-[#7c3aed] tracking-[0.2em]">Joined</th>
                  <th className="px-10 py-6 text-[9px] font-black uppercase text-[#7c3aed] tracking-[0.2em]">Role</th>
                  <th className="px-10 py-6 text-[9px] font-black uppercase text-[#7c3aed] tracking-[0.2em]">Status</th>
                  <th className="px-10 py-6"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {filteredGuests.map((guest) => (
                  <tr key={guest._id} className="hover:bg-[#7c3aed]/[0.02] transition-colors group">
                    <td className="px-10 py-6 text-[10px] font-bold text-zinc-400">#{guest._id?.slice(-6).toUpperCase()}</td>
                    
                    {/* FIX: Use firstName and lastName to replace UNNAMED GUEST */}
                    <td className="px-10 py-6 text-xs font-[900] uppercase tracking-tight text-black">
                      {guest.firstName} {guest.lastName}
                    </td>

                    <td className="px-10 py-6 text-[10px] font-bold text-zinc-600">{guest.email}</td>
                    <td className="px-10 py-6 text-[10px] font-bold text-zinc-400">
                      {guest.createdAt ? new Date(guest.createdAt).toLocaleDateString('en-GB') : 'PENDING'}
                    </td>
                    <td className="px-10 py-6">
                      <span className={`text-[8px] font-black px-4 py-1.5 rounded-full border ${
                        guest.isAdmin ? 'bg-[#7c3aed] text-white border-[#7c3aed]' : 'bg-white text-zinc-500 border-zinc-200'
                      }`}>
                        {guest.isAdmin ? 'PRIVILEGED' : 'REGULAR'}
                      </span>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${guest.isActive !== false ? 'bg-[#7c3aed]' : 'bg-zinc-300'}`} />
                        <span className={`text-[10px] font-bold ${guest.isActive !== false ? 'text-[#7c3aed]' : 'text-zinc-400'}`}>
                          {guest.isActive !== false ? 'Active' : 'Offline'}
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                       <div className="flex items-center justify-end gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleDelete(guest._id)}
                            className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                          <MoreVertical size={16} className="text-zinc-300 cursor-pointer hover:text-black"/>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Guests;