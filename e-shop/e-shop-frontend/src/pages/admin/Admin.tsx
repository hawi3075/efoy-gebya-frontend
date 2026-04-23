import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Info, X, Loader2, DollarSign, 
  ShoppingCart, Users, ArrowUpRight, 
  RefreshCw, Package 
} from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import API from '../../api/axios';

const Admin = () => {
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState({ revenue: 0, orders: 0, customers: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [inventory, setInventory] = useState([]);

  // Base URL for serving uploaded images correctly
  const IMG_BASE_URL = "http://localhost:5000"; 

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/admin/overview');
      
      setStats({
        revenue: data.revenue || 0,
        orders: data.totalOrders || 0,
        customers: data.totalUsers || 0
      });
      // Showing latest items; "View All" handles full list
      setRecentOrders(data.recentOrders || []);
      setInventory(data.inventory || []); 
    } catch (err) {
      console.error("Dashboard Sync Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fcfcfc]">
        <Loader2 className="animate-spin text-purple-600" size={40} />
      </div>
    );
  }

  return (
    <div className="flex bg-[#fcfcfc] min-h-screen font-sans text-black">
      <AdminSidebar />
      
      <main className="flex-1 p-12 relative overflow-y-auto">
        <header className="mb-12 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-[900] tracking-tighter uppercase mb-2 italic">Terminal Overview</h1>
            <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em]">Operational metrics across all digital touchpoints.</p>
          </div>
          <button 
            onClick={fetchDashboardData}
            className="flex items-center gap-2 bg-white border border-zinc-100 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-50 transition-all"
          >
            <RefreshCw size={12} /> Refresh
          </button>
        </header>

        {/* METRIC CARDS SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div onClick={() => navigate('/admin/orders')} className="bg-white p-8 rounded-[2rem] border border-zinc-100 shadow-sm cursor-pointer hover:border-purple-200 transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <DollarSign size={20} />
              </div>
              <div className="flex items-center gap-1 text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">
                <ArrowUpRight size={12} />
                <span className="text-[10px] font-black">+0%</span>
              </div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Revenue</p>
            <h3 className="text-3xl font-[900] tracking-tighter italic">${stats.revenue.toLocaleString()}</h3>
          </div>

          <div onClick={() => navigate('/admin/orders')} className="bg-white p-8 rounded-[2rem] border border-zinc-100 shadow-sm cursor-pointer hover:border-blue-200 transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <ShoppingCart size={20} />
              </div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Orders</p>
            <h3 className="text-3xl font-[900] tracking-tighter italic">{stats.orders}</h3>
          </div>

          <div onClick={() => navigate('/admin/users')} className="bg-white p-8 rounded-[2rem] border border-zinc-100 shadow-sm cursor-pointer hover:border-orange-200 transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-orange-50 text-orange-500 rounded-2xl group-hover:bg-orange-600 group-hover:text-white transition-colors">
                <Users size={20} />
              </div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Customers</p>
            <h3 className="text-3xl font-[900] tracking-tighter italic">{stats.customers}</h3>
          </div>
        </div>

        {/* RECENT ORDERS SECTION */}
        <section className="mb-16">
          <div className="bg-white border border-zinc-100 rounded-[3rem] p-10 shadow-sm">
             <div className="flex justify-between items-center mb-10">
                <h2 className="text-xl font-[900] tracking-tighter uppercase italic">Recent Orders</h2>
                <button onClick={() => navigate('/admin/orders')} className="text-[10px] font-black uppercase text-zinc-300 hover:text-black tracking-[0.3em]">View All</button>
             </div>
             
             {recentOrders.length > 0 ? (
               <div className="space-y-4">
                 {recentOrders.map((order: any) => (
                   <div key={order._id} className="flex items-center justify-between p-4 hover:bg-zinc-50 rounded-2xl transition-all group">
                     <div className="flex items-center gap-4">
                       <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                       <div>
                         <p className="text-[11px] font-[900] uppercase tracking-tight">Customer #{order._id.slice(-5).toUpperCase()}</p>
                         <p className="text-[9px] font-bold text-zinc-400 uppercase">{order.shippingAddress?.city || 'Adama'}</p>
                       </div>
                     </div>
                     <div className="flex items-center gap-6">
                        <p className="font-[900] italic">${order.totalPrice}</p>
                        <button onClick={() => setSelectedOrder(order)} className="text-zinc-200 group-hover:text-black transition-colors">
                           <Info size={18} />
                        </button>
                     </div>
                   </div>
                 ))}
               </div>
             ) : (
               <p className="text-center py-10 text-[10px] font-black uppercase text-zinc-300 tracking-widest italic">No recent orders found</p>
             )}
          </div>
        </section>

        {/* LIVE INVENTORY STREAM - Clean Styling */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-[900] tracking-tighter uppercase italic">Live Inventory Stream</h2>
            <button onClick={() => navigate('/admin/products')} className="text-[10px] font-black uppercase text-zinc-400 hover:text-black">Manage Products</button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {inventory.length > 0 ? inventory.map((item: any) => (
              <div 
                key={item._id} 
                onClick={() => navigate('/admin/products')}
                className="bg-white p-5 rounded-[2.5rem] border border-zinc-100 shadow-sm group cursor-pointer hover:border-black transition-all"
              >
                <div className="aspect-square rounded-[2rem] overflow-hidden bg-[#f3f3f3] mb-5">
                  <img 
                    src={item.image.startsWith('http') ? item.image : `${IMG_BASE_URL}${item.image}`} 
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
                  />
                </div>
                <p className="text-[10px] font-black uppercase text-zinc-400 mb-1 truncate">{item.name}</p>
                <p className="text-xl font-[900] italic">${item.price}</p>
              </div>
            )) : (
               <div className="col-span-full py-10 border-2 border-dashed border-zinc-100 rounded-[2.5rem] flex flex-col items-center justify-center text-zinc-300">
                 <Package size={40} className="mb-2 opacity-20" />
                 <p className="text-[10px] font-black uppercase italic">No items found</p>
               </div>
            )}
          </div>
        </section>

        {/* MODAL - ORDER SPECS */}
        {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
            <div className="relative bg-white w-full max-w-2xl rounded-[3rem] p-12 shadow-2xl overflow-y-auto max-h-[90vh]">
              <button onClick={() => setSelectedOrder(null)} className="absolute top-10 right-10 text-zinc-300 hover:text-black">
                <X size={24} />
              </button>
              
              <h2 className="text-2xl font-[900] uppercase tracking-tighter mb-12 italic text-center">Order Specs</h2>
              
              <div className="space-y-12">
                {/* Item Summary */}
                <div className="bg-zinc-50 p-8 rounded-[2.5rem]">
                  <p className="text-[9px] font-black text-zinc-400 uppercase mb-4 tracking-[0.2em]">Ordered Items</p>
                  {selectedOrder.orderItems?.map((item: any) => (
                    <div key={item._id} className="flex justify-between items-center py-4 border-b border-zinc-200 last:border-0">
                      <div>
                        <p className="text-sm font-black uppercase">{item.name}</p>
                        <p className="text-[10px] font-bold text-purple-600 uppercase">COLOR: {item.color} • SIZE: {item.size}</p>
                      </div>
                      <p className="font-black italic text-lg text-zinc-800">Qty: {item.qty || 1}</p>
                    </div>
                  ))}
                </div>

                {/* Recipient and Destination details */}
                <div className="grid grid-cols-2 gap-10 px-4">
                  <div>
                    <p className="text-[9px] font-black text-zinc-400 uppercase mb-2 tracking-widest">Recipient Name</p>
                    <p className="text-sm font-black uppercase">{selectedOrder.shippingAddress?.fullName || 'N/A'}</p>
                    <p className="text-xs font-bold text-zinc-500 mt-1">{selectedOrder.shippingAddress?.phone}</p>
                  </div>
                  
                  <div>
                    <p className="text-[9px] font-black text-zinc-400 uppercase mb-2 tracking-widest">Urgent Delivery</p>
                    <p className={`text-xs font-black uppercase ${selectedOrder.isUrgent ? 'text-red-500' : 'text-zinc-400'}`}>
                      {selectedOrder.isUrgent ? 'YES - HIGH PRIORITY' : 'STANDARD'}
                    </p>
                  </div>

                  <div className="col-span-2">
                    <p className="text-[9px] font-black text-zinc-400 uppercase mb-2 tracking-widest">Full Destination</p>
                    <p className="text-xs font-black uppercase leading-relaxed">
                      {selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.country || 'Ethiopia'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-10 border-t border-zinc-100 text-center">
                <p className="text-[9px] font-black text-zinc-400 uppercase mb-1 tracking-widest">Total Amount Paid</p>
                <p className="text-6xl font-[900] italic tracking-tighter">${selectedOrder.totalPrice.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;