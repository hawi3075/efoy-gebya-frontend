import { useState, useEffect } from 'react';
import { Loader2, TrendingUp, DollarSign, Package } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import AdminSidebar from '../../components/admin/AdminSidebar';
import API from '../../api/axios';

const Analytics = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  // Fix: Use a state to ensure the chart only renders once the container is ready
  const [isMounted, setIsMounted] = useState(false);

  const annualRevenueData = [
    { name: 'JAN', value: 0 }, { name: 'FEB', value: 0 },
    { name: 'MAR', value: 0 }, { name: 'APR', value: 4500 }, 
    { name: 'MAY', value: 0 }, { name: 'JUN', value: 0 },
    { name: 'JUL', value: 0 }, { name: 'AUG', value: 0 },
    { name: 'SEP', value: 0 }, { name: 'OCT', value: 0 },
    { name: 'NOV', value: 0 }, { name: 'DEC', value: 0 },
  ];

  useEffect(() => {
    setIsMounted(true); // Set mounted to true after initial render
    const fetchStats = async () => {
      try {
        const { data } = await API.get('/products');
        const productList = Array.isArray(data) ? data : (data.products || []);
        setProducts(productList);
      } catch (err) {
        console.error("Dashboard Sync Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const potentialRevenue = products.reduce((acc, p) => 
    acc + (Number(p.price || 0) * Number(p.countInStock || 0)), 0);
  
  const totalStockToSell = products.reduce((acc, p) => 
    acc + Number(p.countInStock || 0), 0);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#fcfcfc]">
      <Loader2 className="animate-spin text-[#7c3aed]" size={40} />
    </div>
  );

  return (
    <div className="flex bg-[#fcfcfc] min-h-screen font-sans text-black">
      <AdminSidebar />
      
      <main className="flex-1 p-12">
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-2">
             <div className="h-8 w-1 bg-[#7c3aed] rounded-full" />
             <h1 className="text-4xl font-[900] tracking-tighter uppercase text-black">
               Performance <span className="text-[#7c3aed]">Analytics</span>
             </h1>
          </div>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest ml-4">
            Financial Synthesis • Inventory Velocity • Operational 2026
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white p-10 rounded-[2.5rem] border border-zinc-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[#7c3aed]/10 rounded-lg text-[#7c3aed]"><DollarSign size={22}/></div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Potential Revenue</p>
            </div>
            <h3 className="text-5xl font-[900] tracking-tighter">
              ${potentialRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h3>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] border border-zinc-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[#7c3aed]/10 rounded-lg text-[#7c3aed]"><Package size={22}/></div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Total Stock to Sell</p>
            </div>
            <h3 className="text-5xl font-[900] tracking-tighter">
              {totalStockToSell.toLocaleString()} <span className="text-xl text-zinc-300 tracking-normal">Units</span>
            </h3>
          </div>
        </div>

        <div className="w-full bg-white border border-zinc-100 rounded-[2.5rem] p-10 shadow-sm">
          <div className="flex items-center gap-3 mb-10">
            <TrendingUp className="text-[#7c3aed]" size={20} />
            <h3 className="text-xl font-[900] uppercase tracking-tighter">Market Velocity (2026)</h3>
          </div>
          <div className="h-[450px] w-full">
            {/* Fix: Only render ResponsiveContainer if the component is mounted and has a size */}
            {isMounted && (
              <ResponsiveContainer width="99%" height="100%">
                <AreaChart data={annualRevenueData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#a1a1aa'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#a1a1aa'}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#7c3aed" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;