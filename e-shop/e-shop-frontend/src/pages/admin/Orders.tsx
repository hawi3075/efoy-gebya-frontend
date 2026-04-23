import { useState, useEffect } from 'react';
import { Eye, Package, Truck, CheckCircle, X, MapPin, Phone, User, Loader2, Search, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import API from '../../api/axios';

const Orders = () => {
  const [ordersList, setOrdersList] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const { data } = await API.get('/orders/admin/orders');
      setOrdersList(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  /**
   * FIXED DELETE HANDLER
   * Matches the backend route: router.route('/admin/:id').delete(...)
   */
  const deleteOrderHandler = async (id: string) => {
    if (window.confirm("PERMANENT DATA REMOVAL: Are you sure you want to delete this order?")) {
      setDeletingId(id);
      try {
        // Updated URL path to fix the 404 error seen in your console
        await API.delete(`/orders/admin/${id}`);
        setOrdersList(ordersList.filter(order => order._id !== id));
      } catch (err) {
        console.error("Delete operation failed:", err);
        alert("System Error: Could not remove order. Ensure backend route /admin/:id is active.");
      } finally {
        setDeletingId(null);
      }
    }
  };

  const filteredOrders = ordersList.filter(order => 
    order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.shippingAddress?.contactName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStats = (status: string | null) => {
    const filtered = status 
      ? ordersList.filter(o => o.status === status)
      : ordersList.filter(o => !o.isDelivered);
    
    const urgent = filtered.filter(o => o.totalPrice > 5000).length;
    return { total: filtered.length, urgent, normal: filtered.length - urgent };
  };

  const handleToggle = async (id: string, currentStatus: string) => {
    const cycle: Record<string, string> = {
      'PENDING': 'SHIPPED',
      'SHIPPED': 'DELIVERED',
      'DELIVERED': 'PENDING'
    };
    const nextStatus = cycle[currentStatus?.toUpperCase() || 'PENDING'];

    try {
      await API.put(`/orders/admin/orders/${id}/status`, { status: nextStatus });
      fetchOrders(); 
    } catch (err) {
      console.error("Toggle error:", err);
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'SHIPPED': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'DELIVERED': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      default: return 'bg-zinc-50 text-zinc-900 border-zinc-200';
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#fcfcfc]">
      <Loader2 className="animate-spin text-purple-600" size={40} />
    </div>
  );

  return (
    <div className="flex bg-[#fcfcfc] min-h-screen font-sans text-black">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-[1000] italic uppercase tracking-tighter text-black">Terminal Pulse</h1>
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Global Order Manifest</p>
          </div>
          
          <div className="relative w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
            <input 
              type="text"
              placeholder="SEARCH NAME OR ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-zinc-100 rounded-2xl py-3 pl-12 pr-4 text-[10px] font-bold uppercase focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all shadow-sm"
            />
          </div>
        </header>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          {[
            { label: 'Pending/Active', data: getStats(null), color: 'text-purple-600', icon: <Package size={14}/> },
            { label: 'In Transit', data: getStats('SHIPPED'), color: 'text-blue-600', icon: <Truck size={14}/> },
            { label: 'Delivered', data: getStats('DELIVERED'), color: 'text-emerald-600', icon: <CheckCircle size={14}/> }
          ].map((s) => (
            <div key={s.label} className="bg-white border border-zinc-100 rounded-3xl p-6 shadow-sm flex items-start gap-4">
              <span className={`${s.color} p-2 bg-zinc-50 rounded-lg`}>{s.icon}</span>
              <div>
                <p className={`text-[10px] font-black uppercase tracking-widest ${s.color} mb-2`}>{s.label}</p>
                <div className="flex items-end gap-3">
                  <h3 className="text-5xl font-[1000] italic leading-none">{s.data.total}</h3>
                  <div className="text-[9px] font-bold uppercase text-zinc-400 space-y-0.5">
                    <p>Norm: {s.data.normal}</p>
                    <p className="text-purple-600">Urgent: {s.data.urgent}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Table Content */}
        <section className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-zinc-50/50">
              <tr className="border-b border-zinc-100">
                <th className="px-10 py-5 text-[10px] font-black uppercase text-zinc-500">Order Identifier</th>
                <th className="px-10 py-5 text-[10px] font-black uppercase text-zinc-500 text-center">Gross Total</th>
                <th className="px-10 py-5 text-[10px] font-black uppercase text-zinc-500 text-right">Fulfillment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {filteredOrders.map((order) => (
                <tr key={order._id} className="hover:bg-purple-50/5 transition-colors group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-5">
                      <div className={`w-1 h-10 rounded-full ${order.totalPrice > 5000 ? 'bg-purple-600' : 'bg-zinc-200'}`} />
                      <div>
                        <p className="text-[9px] font-black text-zinc-400">#ORD-{order._id.slice(-10).toUpperCase()}</p>
                        <p className="font-[1000] uppercase text-sm text-black">{order.shippingAddress?.contactName || "Guest User"}</p>
                        <p className="text-[10px] font-bold text-purple-400 uppercase tracking-tight">{order.shippingAddress?.city}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-center">
                    <p className="font-[1000] text-purple-700 italic text-xl">${order.totalPrice.toLocaleString()}</p>
                  </td>
                  <td className="px-10 py-8 text-right flex items-center justify-end gap-3">
                    <button 
                      onClick={() => { setSelectedOrder(order); setShowModal(true); }}
                      className="p-3.5 rounded-2xl bg-zinc-100 text-zinc-600 hover:bg-black hover:text-white transition-all shadow-inner"
                    >
                      <Eye size={16} />
                    </button>
                    
                    {/* TRASH ICON - DELETE BUTTON */}
                    <button 
                      disabled={deletingId === order._id}
                      onClick={() => deleteOrderHandler(order._id)}
                      className={`p-3.5 rounded-2xl bg-purple-50 text-purple-400 hover:bg-red-500 hover:text-white transition-all shadow-inner ${deletingId === order._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {deletingId === order._id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                    </button>

                    <button 
                      onClick={() => handleToggle(order._id, order.status)}
                      className={`px-7 py-3.5 rounded-2xl border-2 font-[1000] text-[10px] uppercase min-w-[130px] transition-all active:scale-95 ${getStatusStyles(order.status)}`}
                    >
                      {order.status || 'PENDING'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="p-8 border-t border-zinc-100 bg-zinc-50/20 flex justify-between items-center text-black">
            <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">
              System Operational Pulse Verified
            </p>
            <div className="flex gap-2">
              <button className="p-2 bg-white border border-zinc-200 rounded-xl hover:bg-purple-50 transition-colors text-zinc-400">
                <ChevronLeft size={18} />
              </button>
              <button className="px-6 py-2 bg-purple-600 text-white font-black text-[10px] uppercase rounded-xl hover:bg-purple-700 shadow-md">
                Next Page
              </button>
              <button className="p-2 bg-white border border-zinc-200 rounded-xl hover:bg-purple-50 transition-colors text-zinc-400">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Detail Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl">
            <div className="p-10 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50 text-black">
              <div>
                <h2 className="text-2xl font-[1000] italic uppercase tracking-tighter">Order Details</h2>
                <p className="text-[10px] font-black text-purple-600 uppercase">Verification & Manifest</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-3 hover:bg-zinc-200 rounded-full text-zinc-400 hover:text-black transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-10 max-h-[70vh] overflow-y-auto space-y-10 text-black">
              <div className="grid grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <User size={18} className="text-zinc-300" />
                    <div>
                      <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Contact Name</p>
                      <p className="font-bold uppercase text-sm">{selectedOrder.shippingAddress?.contactName || "GUEST"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Phone size={18} className="text-zinc-300" />
                    <div>
                      <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Phone Number</p>
                      <p className="font-bold text-sm">{selectedOrder.shippingAddress?.phone}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-6 text-black">
                  <div className="flex items-center gap-4">
                    <MapPin size={18} className="text-zinc-300" />
                    <div>
                      <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Location</p>
                      <p className="font-bold uppercase text-sm">
                        {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.country}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${selectedOrder.totalPrice > 5000 ? 'bg-purple-600 animate-pulse' : 'bg-emerald-500'}`} />
                    <div>
                      <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Priority Status</p>
                      <p className={`font-black uppercase text-sm ${selectedOrder.totalPrice > 5000 ? 'text-purple-600' : 'text-emerald-700'}`}>
                        {selectedOrder.totalPrice > 5000 ? 'URGENT (HIGH VALUE)' : 'NORMAL'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-50 rounded-[2.5rem] p-8 border border-zinc-100">
                <p className="text-[10px] font-black text-zinc-400 uppercase mb-5 tracking-[0.2em]">Product Manifest</p>
                <div className="space-y-5">
                  {selectedOrder.orderItems?.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between bg-white p-5 rounded-3xl border border-zinc-100 shadow-sm text-black">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center">
                          <Package className="text-zinc-300" size={20} />
                        </div>
                        <div>
                          <p className="text-[8px] font-black text-purple-400 uppercase">ID: {item.product?._id || item.product || 'N/A'}</p>
                          <p className="font-[1000] uppercase text-xs">{item.name}</p>
                          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">
                            Size: {item.size || 'N/A'} • Color: {item.color || 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] font-black text-purple-600 uppercase">Qty: {item.qty}</p>
                        <p className="font-black text-sm">${item.price.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-10 border-t border-zinc-100 flex justify-between items-center bg-zinc-50/50">
              <p className="text-[11px] font-black text-zinc-400 uppercase tracking-widest text-black">Grand Manifest Total</p>
              <p className="text-4xl font-[1000] italic text-purple-600 tracking-tighter leading-none">${selectedOrder.totalPrice.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;