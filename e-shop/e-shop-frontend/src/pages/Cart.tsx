import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api'; 
import { 
  Trash2, X, Truck, ArrowLeft, 
  ChevronDown, Minus, Plus, User, Phone, Globe, MapPin, Loader2, CheckCircle2, Sparkles, ShoppingBag
} from 'lucide-react';

const Cart = () => {
  const navigate = useNavigate();
  const backendUrl = "http://localhost:5000";
  
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [amount, setAmount] = useState(1);
  const [isUrgent, setIsUrgent] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [isSizeOpen, setIsSizeOpen] = useState(false);
  const [isColorOpen, setIsColorOpen] = useState(false);

  const [contactName, setContactName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState(""); // Now editable
  const [specificRoad, setSpecificRoad] = useState("");

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) setCartItems(JSON.parse(savedCart));
  }, []);

  const removeFromCart = (id: string) => {
    const updated = cartItems.filter(item => item._id !== id);
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const openCheckout = (item: any) => {
    setSelectedProduct(item);
    setAmount(item.quantity || 1);
    const sList = Array.isArray(item.sizes) ? item.sizes : (item.sizes?.split(',') || []);
    const cList = Array.isArray(item.colors) ? item.colors : (item.colors?.split(',') || []);
    setSelectedSize(item.selectedSize || (sList[0]?.trim() || "Standard"));
    setSelectedColor(item.selectedColor || (cList[0]?.trim() || "Default"));
  };

  const calculateTotal = () => {
    if (!selectedProduct) return 0;
    const price = typeof selectedProduct.price === 'string' 
      ? parseFloat(selectedProduct.price.replace(/[^0-9.]/g, '')) 
      : selectedProduct.price;
    const base = price * (Number(amount) || 1);
    return isUrgent ? base + 150 : base;
  };

  const handleFinalOrder = async () => {
    if (!contactName || !phoneNumber || !city || !country || !specificRoad) {
      return alert("Please fill in all shipping details");
    }

    setIsProcessing(true);
    try {
      const orderPayload = {
        orderId: `ORD-${Date.now()}`,
        orderItems: [{
          name: selectedProduct.name,
          qty: amount,
          image: selectedProduct.image,
          price: Number(selectedProduct.price),
          product: selectedProduct._id,
          color: selectedColor,
          size: selectedSize
        }],
        shippingAddress: {
          address: specificRoad,
          city,
          country,
          contactName,
          phone: phoneNumber
        },
        paymentMethod: "Standard Checkout",
        totalPrice: calculateTotal(),
      };

      await API.post('/orders', orderPayload);
      removeFromCart(selectedProduct._id);
      setIsSuccess(true);

      setTimeout(() => {
        navigate('/products');
      }, 2500);

    } catch (err) {
      console.error("Order Error:", err);
      alert("Order failed. Check your connection.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-[#fcfcfc] min-h-screen font-sans text-black pb-20">
      <div className="max-w-[900px] mx-auto px-6 py-12">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="p-3 bg-white border border-zinc-100 rounded-full hover:shadow-md transition-all">
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase italic">My Bag</h1>
        </div>
        
        <div className="space-y-4">
          {cartItems.length > 0 ? cartItems.map((item) => (
            <div key={item._id} className="bg-white border border-zinc-100 rounded-[2rem] p-4 md:p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm">
              <div className="w-28 h-28 bg-zinc-50 rounded-2xl p-3 flex items-center justify-center shrink-0">
                <img 
                  src={item.image.startsWith('http') ? item.image : `${backendUrl}${item.image}`} 
                  alt={item.name} 
                  className="max-h-full max-w-full object-contain" 
                />
              </div>

              <div className="flex-1 text-center md:text-left">
                <p className="text-[8px] font-black uppercase text-purple-600 tracking-widest mb-1">{item.category}</p>
                <h3 className="text-lg font-black uppercase tracking-tighter italic leading-tight">{item.name}</h3>
                <div className="flex justify-center md:justify-start gap-2 mt-2">
                   <span className="text-[8px] font-black px-3 py-1 bg-zinc-50 border border-zinc-100 rounded-full uppercase">Size: {item.selectedSize}</span>
                   <span className="text-[8px] font-black px-3 py-1 bg-zinc-50 border border-zinc-100 rounded-full uppercase">Color: {item.selectedColor}</span>
                </div>
              </div>

              <div className="flex flex-col items-center md:items-end gap-3 shrink-0">
                <p className="text-2xl font-black tracking-tighter">{item.price} <span className="text-[10px] text-zinc-400">BIRR</span></p>
                <div className="flex items-center gap-2">
                  <button onClick={() => openCheckout(item)} className="px-6 py-2.5 bg-purple-600 text-white rounded-xl font-black uppercase italic text-[9px] shadow-lg shadow-purple-100 hover:bg-black transition-all">Buy Now</button>
                  <button onClick={() => removeFromCart(item._id)} className="p-2 text-zinc-300 hover:text-red-600 transition-colors"><Trash2 size={18} /></button>
                </div>
              </div>
            </div>
          )) : (
            <div className="py-16 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-zinc-100">
               <p className="text-zinc-300 font-black uppercase tracking-[0.5em] text-[9px]">Your bag is currently empty</p>
            </div>
          )}
        </div>
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setSelectedProduct(null)} />
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
            
            {isSuccess ? (
              <div className="p-12 text-center flex flex-col items-center justify-center h-[500px]">
                <div className="relative mb-6">
                    <div className="absolute inset-0 bg-purple-100 scale-150 blur-2xl rounded-full opacity-50 animate-pulse"></div>
                    <CheckCircle2 size={80} className="text-purple-600 relative animate-in zoom-in duration-500" />
                </div>
                <h2 className="text-4xl font-black uppercase italic tracking-tighter text-zinc-900 mb-2">ORDER PLACED</h2>
                <div className="flex items-center gap-2 text-purple-600 mb-8">
                    <Sparkles size={14} />
                    <span className="text-[9px] font-black uppercase tracking-widest">AuraSync Marketplace</span>
                </div>
                <p className="text-zinc-400 text-[9px] font-black uppercase animate-pulse">Redirecting to shop...</p>
              </div>
            ) : isProcessing ? (
              <div className="p-32 flex flex-col items-center justify-center gap-6">
                <Loader2 className="animate-spin h-10 w-10 text-purple-600" />
                <p className="font-black text-[9px] uppercase tracking-[0.4em] text-zinc-400">Processing</p>
              </div>
            ) : (
              <>
                <div className="p-6 flex justify-between items-center border-b border-zinc-50 shrink-0">
                  <h3 className="font-black uppercase italic tracking-tighter text-lg">Checkout Details</h3>
                  <button onClick={() => setSelectedProduct(null)} className="p-2 hover:bg-zinc-100 rounded-full transition-colors"><X size={18} /></button>
                </div>

                <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <label className="text-[8px] font-black uppercase text-zinc-400 mb-1.5 block">Size</label>
                      <div onClick={() => setIsSizeOpen(!isSizeOpen)} className="w-full p-3.5 bg-zinc-50 border border-zinc-100 rounded-xl font-black text-[9px] flex justify-between items-center cursor-pointer uppercase">
                        {selectedSize} <ChevronDown size={12} />
                      </div>
                      {isSizeOpen && (
                        <div className="absolute top-full left-0 w-full bg-white border border-zinc-100 mt-1 rounded-xl shadow-xl z-50 overflow-hidden">
                          {(Array.isArray(selectedProduct.sizes) ? selectedProduct.sizes : (selectedProduct.sizes?.split(',') || ["Standard"])).map((s: string) => (
                            <div key={s} onClick={() => {setSelectedSize(s); setIsSizeOpen(false)}} className="p-3 font-black text-[9px] uppercase hover:bg-purple-600 hover:text-white cursor-pointer">{s}</div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="relative">
                      <label className="text-[8px] font-black uppercase text-zinc-400 mb-1.5 block">Color</label>
                      <div onClick={() => setIsColorOpen(!isColorOpen)} className="w-full p-3.5 bg-zinc-50 border border-zinc-100 rounded-xl font-black text-[9px] flex justify-between items-center cursor-pointer uppercase">
                        {selectedColor} <ChevronDown size={12} />
                      </div>
                      {isColorOpen && (
                        <div className="absolute top-full left-0 w-full bg-white border border-zinc-100 mt-1 rounded-xl shadow-xl z-50 overflow-hidden">
                          {(Array.isArray(selectedProduct.colors) ? selectedProduct.colors : (selectedProduct.colors?.split(',') || ["Default"])).map((c: string) => (
                            <div key={c} onClick={() => {setSelectedColor(c); setIsColorOpen(false)}} className="p-3 font-black text-[9px] uppercase hover:bg-purple-600 hover:text-white cursor-pointer">{c}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-[8px] font-black uppercase text-zinc-400 tracking-widest">Shipping Details</p>
                    <div className="space-y-2.5 p-4 bg-zinc-50 rounded-[1.5rem] border border-zinc-100">
                      <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={12} /><input type="text" placeholder="FULL NAME" value={contactName} onChange={(e)=>setContactName(e.target.value)} className="w-full p-3 pl-9 bg-white rounded-lg font-black text-[9px] outline-none border border-transparent focus:border-purple-600 uppercase" /></div>
                      <div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={12} /><input type="text" placeholder="PHONE NUMBER" value={phoneNumber} onChange={(e)=>setPhoneNumber(e.target.value)} className="w-full p-3 pl-9 bg-white rounded-lg font-black text-[9px] outline-none border border-transparent focus:border-purple-600 uppercase" /></div>
                      <div className="grid grid-cols-2 gap-2.5">
                        <div className="relative"><Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={12} /><input type="text" placeholder="COUNTRY" value={country} onChange={(e)=>setCountry(e.target.value)} className="w-full p-3 pl-9 bg-white rounded-lg font-black text-[9px] outline-none border border-transparent focus:border-purple-600 uppercase" /></div>
                        <input type="text" placeholder="CITY" value={city} onChange={(e)=>setCity(e.target.value)} className="w-full p-3 bg-white rounded-lg font-black text-[9px] outline-none border border-transparent focus:border-purple-600 uppercase" />
                      </div>
                      <div className="relative"><MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={12} /><input type="text" placeholder="ROAD / NEIGHBORHOOD" value={specificRoad} onChange={(e)=>setSpecificRoad(e.target.value)} className="w-full p-3 pl-9 bg-white rounded-lg font-black text-[9px] outline-none border border-transparent focus:border-purple-600 uppercase" /></div>
                    </div>
                  </div>

                  <div onClick={() => setIsUrgent(!isUrgent)} className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer ${isUrgent ? 'border-purple-600 bg-purple-50/50' : 'border-zinc-100 bg-zinc-50'}`}>
                    <div className="flex items-center gap-3"><Truck size={16} className={isUrgent ? 'text-purple-600' : 'text-zinc-400'}/><div><p className="font-black text-[9px] uppercase italic">Urgent Delivery</p><p className="text-[7px] font-bold text-zinc-400 uppercase">+150.00 BIRR</p></div></div>
                    <div className={`w-9 h-5 rounded-full relative ${isUrgent ? 'bg-purple-600' : 'bg-zinc-300'}`}><div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${isUrgent ? 'left-4.5' : 'left-0.5'}`} /></div>
                  </div>

                  <div className="flex items-center justify-between bg-zinc-900 p-1 rounded-full h-12">
                    <button onClick={() => setAmount(Math.max(1, amount - 1))} className="px-4 text-white"><Minus size={14}/></button>
                    <span className="text-white font-black text-lg">{amount}</span>
                    <button onClick={() => setAmount(amount + 1)} className="px-4 text-white"><Plus size={14}/></button>
                  </div>

                  <div className="pt-4 border-t border-zinc-100">
                     <div className="flex justify-between items-end mb-4">
                        <span className="text-[8px] font-black uppercase text-zinc-400 tracking-widest">Total Price</span>
                        <span className="text-3xl font-black italic tracking-tighter">{calculateTotal().toFixed(2)} <small className="text-[10px] not-italic">BIRR</small></span>
                     </div>
                     
                     {/* SIMPLIFIED: Only one "Confirm Order" Button */}
                     <button 
                       onClick={handleFinalOrder} 
                       className="w-full bg-purple-600 text-white h-16 rounded-xl font-black uppercase italic text-[14px] shadow-lg shadow-purple-100 active:scale-95 transition-all flex items-center justify-center gap-3"
                     >
                       <ShoppingBag size={18} />
                       Confirm Order
                     </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;