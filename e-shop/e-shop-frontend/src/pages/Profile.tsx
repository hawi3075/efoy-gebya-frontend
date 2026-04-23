import { useState, useRef, useEffect } from 'react';
import { 
  Camera, Trash2, Plus, 
  Loader2, User as UserIcon, Mail, ShieldCheck, Eye, EyeOff, X,
  Package, MapPin, ShoppingBag, ChevronUp, ReceiptText, Tag, Clock, Info, AlertCircle,
  Download // Added Download icon
} from 'lucide-react';
import ProfileSidebar from '../components/ecommerce/ProfileSidebar';
import axios from 'axios';

// --- Types ---
interface Address {
  _id: string;
  contactName: string;
  mobile: string;
  street: string;
  city: string;
  country: string;
}

interface OrderItem {
  name: string;
  qty: number;
  price: number;
  description?: string;
  isUrgent?: boolean;
  category?: string;
  image?: string;
}

interface Order {
  _id: string;
  createdAt: string;
  totalPrice: number;
  isPaid: boolean;
  isDelivered: boolean;
  orderItems: OrderItem[];
  shippingAddress: Address;
  paymentMethod: string;
}

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  addresses: Address[];
}

const API = axios.create({
  baseURL: 'http://localhost:5000',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const Profile = () => {
  const [activeTab, setActiveTab] = useState('My Account');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });
  
  const [user, setUser] = useState<UserProfile | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]); 
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const [newAddress, setNewAddress] = useState({
    contactName: '', mobile: '', street: '', country: '', city: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '', newPassword: '', confirmNewPassword: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  // --- Invoice Download Logic ---
  const handleDownloadInvoice = (order: Order) => {
    // We set the expanded ID to ensure the details are rendered in the DOM before printing
    setExpandedOrderId(order._id);
    
    // Small timeout to allow the DOM to expand if it wasn't already
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const fetchInitialData = async () => {
    try {
      const [profileRes, ordersRes, addrRes] = await Promise.allSettled([
        API.get('/api/users/profile'),
        API.get('/api/orders/myorders'),
        API.get('/api/addresses') 
      ]);
      
      if (profileRes.status === 'fulfilled') setUser(profileRes.value.data);
      if (ordersRes.status === 'fulfilled') {
        const orderData = ordersRes.value.data;
        setOrders(Array.isArray(orderData) ? orderData : (orderData.orders || []));
      }
      if (addrRes.status === 'fulfilled') setAddresses(addrRes.value.data || []);
    } catch (err) { 
      console.error("Fetch Error:", err); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const res = await API.put('/api/users/profile', user);
      setUser(prev => prev ? { ...prev, ...res.data } : res.data);
      setIsEditing(false);
      alert("PROFILE UPDATED");
    } catch (err) { alert("UPDATE FAILED"); }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('avatar', file);
    try {
      const res = await API.post('/api/users/upload-avatar', formData);
      setUser(prev => prev ? { ...prev, avatar: res.data.url } : null);
    } catch (err) { alert("IMAGE UPLOAD FAILED"); }
  };

  const handleSaveAddress = async () => {
    if (!newAddress.contactName || !newAddress.street) return alert("NAME AND STREET REQUIRED");
    try {
      setLoading(true);
      const res = await API.post('/api/addresses', newAddress);
      setAddresses(prev => [...prev, res.data]);
      setShowAddressModal(false);
      setNewAddress({ contactName: '', mobile: '', street: '', country: '', city: '' });
    } catch (err: any) { 
      alert(err.response?.data?.message || "FAILED TO SAVE ADDRESS"); 
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!window.confirm("Permanent Action: Delete this address?")) return;
    try {
      await API.delete(`/api/addresses/${addressId}`);
      setAddresses(prev => prev.filter(a => a._id !== addressId));
    } catch (err) { 
      console.error("Delete Error:", err);
      alert("SERVER ERROR: Check if your backend is running."); 
    }
  };

  const handleUpdatePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmNewPassword) return alert("MATCH ERROR");
    try {
      await API.put('/api/users/password', passwordData);
      alert("PASSWORD UPDATED");
      setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (err: any) { alert(err.response?.data?.message || "FAILED"); }
  };

  const renderContent = () => {
    if (loading && !user) return (
      <div className="h-[60vh] w-full flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-[#a855f7] mb-4" size={40} />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Loading Dashboard...</p>
      </div>
    );

    switch (activeTab) {
      case 'My Account':
        return (
          <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-8 mb-8">
              <div className="relative">
                <div className="w-28 h-28 rounded-[2.2rem] bg-zinc-100 overflow-hidden border-4 border-white shadow-xl">
                  <img 
                    src={user?.avatar ? `http://localhost:5000${user.avatar}` : `https://ui-avatars.com/api/?name=${user?.firstName}&background=a855f7&color=fff`} 
                    className="w-full h-full object-cover" 
                    alt="profile"
                  />
                </div>
                <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-1 -right-1 bg-[#a855f7] text-white p-2.5 rounded-xl shadow-lg hover:scale-110 transition-all">
                  <Camera size={16} />
                </button>
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageUpload} />
              </div>
              <div>
                <h1 className="text-3xl font-black uppercase italic tracking-tighter text-zinc-900 leading-none">
                  {user?.firstName} {user?.lastName}
                </h1>
                <div className="flex items-center gap-3 mt-3">
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 text-[9px] font-black uppercase">
                    <ShieldCheck size={12}/> Verified Member
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-zinc-100 rounded-[2.5rem] p-8 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-lg font-black uppercase italic tracking-tighter">Profile Details</h2>
                <button onClick={() => setIsEditing(!isEditing)} className="text-[#a855f7] font-black text-[10px] uppercase tracking-widest hover:bg-purple-50 px-4 py-2 rounded-full transition-all">
                  {isEditing ? 'Discard' : 'Edit Info'}
                </button>
              </div>
              
              {isEditing ? (
                <div className="grid grid-cols-2 gap-4">
                  <input value={user?.firstName || ''} onChange={e => setUser(prev => prev ? {...prev, firstName: e.target.value} : null)} className="w-full bg-zinc-50 p-4 rounded-2xl font-bold border border-zinc-100 outline-none focus:border-[#a855f7]" placeholder="First Name" />
                  <input value={user?.lastName || ''} onChange={e => setUser(prev => prev ? {...prev, lastName: e.target.value} : null)} className="w-full bg-zinc-50 p-4 rounded-2xl font-bold border border-zinc-100 outline-none focus:border-[#a855f7]" placeholder="Last Name" />
                  <button onClick={handleUpdateProfile} className="bg-zinc-900 text-white p-4 rounded-full font-black uppercase text-[10px] tracking-widest col-span-2 hover:bg-[#a855f7] transition-all mt-2">Update Credentials</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex items-center gap-4 p-4 bg-zinc-50/50 rounded-2xl">
                    <div className="p-3 bg-white rounded-xl text-zinc-400 shadow-sm"><UserIcon size={20}/></div>
                    <div><p className="text-[9px] font-black text-zinc-300 uppercase">Full Name</p><p className="font-black text-zinc-800">{user?.firstName} {user?.lastName}</p></div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-zinc-50/50 rounded-2xl">
                    <div className="p-3 bg-white rounded-xl text-zinc-400 shadow-sm"><Mail size={20}/></div>
                    <div><p className="text-[9px] font-black text-zinc-300 uppercase">Email Address</p><p className="font-black text-zinc-800">{user?.email}</p></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'Saved Addresses':
        return (
          <div className="max-w-4xl animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black uppercase italic tracking-tighter">My Addresses</h2>
              <button onClick={() => setShowAddressModal(true)} className="bg-zinc-900 text-white px-6 py-3 rounded-full flex items-center gap-2 text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-[#a855f7] transition-all">
                <Plus size={14} /> Add New
              </button>
            </div>

            <div className="space-y-3">
              {addresses.map((addr) => (
                <div key={addr._id} className="bg-white border border-zinc-100 p-5 rounded-2xl flex items-center justify-between group hover:border-[#a855f7] transition-all shadow-sm">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-purple-50 text-[#a855f7] rounded-xl flex items-center justify-center">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="font-black text-zinc-800 uppercase italic tracking-tight">{addr.contactName}</p>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase">{addr.street}, {addr.city} • {addr.mobile}</p>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteAddress(addr._id)} className="p-3 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            {showAddressModal && (
              <div className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm z-[500] flex items-center justify-center p-6">
                <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 relative shadow-2xl">
                  <button onClick={() => setShowAddressModal(false)} className="absolute top-8 right-8 p-2 rounded-full hover:bg-zinc-100 transition-colors"><X size={20} /></button>
                  <h3 className="text-2xl font-black uppercase italic mb-6 tracking-tighter">Add Location</h3>
                  <div className="space-y-3">
                    <input placeholder="RECEIVER NAME" className="w-full bg-zinc-50 p-4 rounded-xl font-black text-[10px] border border-zinc-100 outline-none focus:border-[#a855f7] uppercase" value={newAddress.contactName} onChange={e => setNewAddress({...newAddress, contactName: e.target.value})} />
                    <div className="grid grid-cols-2 gap-3">
                      <input placeholder="CITY" className="w-full bg-zinc-50 p-4 rounded-xl font-black text-[10px] border border-zinc-100 outline-none focus:border-[#a855f7] uppercase" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} />
                      <input placeholder="COUNTRY" className="w-full bg-zinc-50 p-4 rounded-xl font-black text-[10px] border border-zinc-100 outline-none focus:border-[#a855f7] uppercase" value={newAddress.country} onChange={e => setNewAddress({...newAddress, country: e.target.value})} />
                    </div>
                    <input placeholder="STREET DETAILS" className="w-full bg-zinc-50 p-4 rounded-xl font-black text-[10px] border border-zinc-100 outline-none focus:border-[#a855f7] uppercase" value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} />
                    <input placeholder="MOBILE NUMBER" className="w-full bg-zinc-50 p-4 rounded-xl font-black text-[10px] border border-zinc-100 outline-none focus:border-[#a855f7] uppercase" value={newAddress.mobile} onChange={e => setNewAddress({...newAddress, mobile: e.target.value})} />
                    <button onClick={handleSaveAddress} className="w-full bg-black text-white p-5 rounded-full font-black uppercase text-[10px] tracking-widest mt-4 hover:bg-[#a855f7] transition-all">Save Address</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'Order History':
        return (
          <div className="max-w-5xl animate-in fade-in duration-500">
            <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-8">Purchase Records</h2>
            <div className="space-y-6">
              {orders.map((order) => (
                <div 
                  key={order._id} 
                  id={`order-card-${order._id}`}
                  className={`bg-white border border-zinc-100 rounded-[2rem] overflow-hidden shadow-sm transition-all hover:shadow-md ${expandedOrderId === order._id ? 'print-active' : 'print:hidden'}`}
                >
                  <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-50/40 border-b border-zinc-50">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#a855f7] border border-zinc-100 shadow-sm">
                        <ShoppingBag size={24} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                            {new Date(order.createdAt).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })}
                          </p>
                          <span className="text-zinc-200 print:hidden">•</span>
                          <span className="text-[10px] font-black text-[#a855f7] uppercase tracking-tighter">Ref: #{order._id.slice(-6)}</span>
                        </div>
                        <h4 className="text-sm font-black text-zinc-900 uppercase italic">Transaction Processed</h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 print:hidden">
                      <div className="text-right">
                        <p className="text-[9px] font-black text-zinc-300 uppercase">Grand Total</p>
                        <p className="text-lg font-black italic text-zinc-900">{order.totalPrice} ETB</p>
                      </div>
                      <button 
                        onClick={() => setExpandedOrderId(expandedOrderId === order._id ? null : order._id)}
                        className="p-3 bg-white border border-zinc-100 rounded-xl text-zinc-400 hover:text-zinc-900 hover:border-[#a855f7] transition-all active:scale-95"
                      >
                        {expandedOrderId === order._id ? <ChevronUp size={20} /> : <ReceiptText size={20} />}
                      </button>
                    </div>
                  </div>

                  {expandedOrderId === order._id && (
                    <div className="p-6 bg-white space-y-6 animate-in slide-in-from-top-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 border-b border-zinc-50">
                        <div className="flex items-center gap-3">
                          <Clock className="text-zinc-300" size={16} />
                          <div>
                            <p className="text-[8px] font-black text-zinc-300 uppercase">Time Ordered</p>
                            <p className="text-[10px] font-bold text-zinc-600 uppercase">{new Date(order.createdAt).toLocaleTimeString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <AlertCircle className="text-zinc-300" size={16} />
                          <div>
                            <p className="text-[8px] font-black text-zinc-300 uppercase">Status</p>
                            <p className="text-[10px] font-bold text-zinc-600 uppercase">{order.isDelivered ? 'Delivered' : 'Awaiting Shipment'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Info className="text-zinc-300" size={16} />
                          <div>
                            <p className="text-[8px] font-black text-zinc-300 uppercase">Method</p>
                            <p className="text-[10px] font-bold text-zinc-600 uppercase">{order.paymentMethod || 'Standard Checkout'}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <p className="text-[9px] font-black uppercase text-zinc-400 tracking-widest">Items Manifest</p>
                        {order.orderItems?.map((item, i) => (
                          <div key={i} className="group flex flex-col p-4 border border-zinc-100 rounded-2xl bg-zinc-50/20 hover:bg-zinc-50 transition-colors">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-white border border-zinc-100 flex items-center justify-center font-black text-xs text-[#a855f7] shadow-sm">
                                  x{item.qty}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2 mb-0.5">
                                    <h5 className="text-[12px] font-black uppercase italic text-zinc-800">{item.name}</h5>
                                    {item.isUrgent && (
                                      <span className="px-2 py-0.5 bg-red-50 text-red-500 text-[7px] font-black uppercase rounded-full border border-red-100">Urgent Delivery</span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <Tag size={10} className="text-[#a855f7]" />
                                    <span className="text-[9px] font-bold uppercase text-zinc-400">{item.category || 'General Merchant'}</span>
                                  </div>
                                </div>
                              </div>
                              <p className="text-xs font-black italic text-zinc-900">{item.price * item.qty} ETB</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="pt-4 border-t border-zinc-100 flex flex-col md:flex-row justify-between items-end gap-4">
                        <div className="flex items-start gap-3">
                          <MapPin size={16} className="text-zinc-300 mt-1" />
                          <div>
                            <p className="text-[8px] font-black text-zinc-300 uppercase">Shipping Destination</p>
                            <p className="text-[11px] font-bold text-zinc-600 uppercase tracking-tight">
                              {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.country}
                            </p>
                          </div>
                        </div>
                        
                        <div className="hidden print:block text-right">
                           <p className="text-[9px] font-black text-zinc-300 uppercase">Total Paid</p>
                           <p className="text-2xl font-black italic text-zinc-900">{order.totalPrice} ETB</p>
                        </div>

                        <button 
                          onClick={() => handleDownloadInvoice(order)}
                          className="print:hidden flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#a855f7] transition-all shadow-lg active:scale-95"
                        >
                          <Download size={14} /> Download Invoice
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'Security':
        return (
          <div className="max-w-xl animate-in fade-in duration-500">
            <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-6">Security Hub</h2>
            <div className="bg-white border border-zinc-100 rounded-[2rem] p-8 shadow-sm">
              <div className="space-y-4">
                {[
                  { label: 'current', key: 'currentPassword', placeholder: 'Current Authentication Key' },
                  { label: 'new', key: 'newPassword', placeholder: 'New Security Key' },
                  { label: 'confirm', key: 'confirmNewPassword', placeholder: 'Re-enter New Key' }
                ].map((input) => (
                  <div className="relative" key={input.label}>
                    <input 
                      type={(showPass as any)[input.label] ? 'text' : 'password'} 
                      placeholder={input.placeholder}
                      className="w-full bg-zinc-50 border border-zinc-100 p-4 rounded-xl font-black text-[10px] uppercase outline-none focus:border-[#a855f7] transition-all"
                      value={(passwordData as any)[input.key]}
                      onChange={e => setPasswordData({...passwordData, [input.key]: e.target.value})}
                    />
                    <button 
                      type="button"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-zinc-900" 
                      onClick={() => setShowPass({...showPass, [input.label]: !(showPass as any)[input.label]})}
                    >
                      {(showPass as any)[input.label] ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                ))}
                <button onClick={handleUpdatePassword} className="w-full bg-zinc-900 text-white p-4 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-[#a855f7] transition-all mt-2">Authorize Security Update</button>
              </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FCFCFC] font-sans selection:bg-[#a855f7] selection:text-white">
      {/* CSS Block for Print Invoices */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-active, .print-active * { visibility: visible; }
          .print-active { 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 100%; 
            border: none !important;
            box-shadow: none !important;
          }
          .print\\:hidden { display: none !important; }
        }
      `}</style>

      <div className="print:hidden">
        <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <main className="flex-1 ml-72 p-10 print:ml-0 print:p-0">
        <div className="mb-8 print:hidden">
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300">
            Account / <span className="text-[#a855f7] italic">{activeTab}</span>
          </div>
        </div>
        {renderContent()}
      </main>
    </div>
  );
};

export default Profile;