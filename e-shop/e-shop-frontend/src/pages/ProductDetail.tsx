import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import API from '../utils/api'; 
import { 
  ArrowLeft, X, Truck, MapPin, Box, Loader2, Minus, Plus, 
  User, Phone, Info, ChevronDown, CreditCard, CheckCircle2, Sparkles
} from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  image: string;
  category: string;
  price: string | number;
  brand: string;
  stock: number;
  description?: string;
  sizes?: string | string[];
  colors?: string | string[];
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const backendUrl = "http://localhost:5000";
  const isAuthenticated = !!localStorage.getItem('token');

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showCheckout, setShowCheckout] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [notification, setNotification] = useState({ show: false, msg: "" });
  
  const [selectedSize, setSelectedSize] = useState<string>(""); 
  const [selectedColor, setSelectedColor] = useState<string>(""); 
  const [amount, setAmount] = useState<number>(1); 
  const [isUrgent, setIsUrgent] = useState<boolean>(false);

  const [contactName, setContactName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [specificRoad, setSpecificRoad] = useState<string>("");

  const [isSizeOpen, setIsSizeOpen] = useState<boolean>(false);
  const [isColorOpen, setIsColorOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/products/${id}`);
        setProduct(data);
        if (data.sizes) {
          const s = Array.isArray(data.sizes) ? data.sizes : data.sizes.split(',');
          setSelectedSize(s[0]?.trim() || "Standard");
        }
        if (data.colors) {
          const c = Array.isArray(data.colors) ? data.colors : data.colors.split(',');
          setSelectedColor(c[0]?.trim() || "Default");
        }
      } catch (err) {
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const rawPrice = product ? (typeof product.price === 'string' ? parseFloat(product.price.replace(/[^0-9.]/g, '')) : product.price) : 0;
  const urgencyFee = 150;
  const deliveryFee = isUrgent ? urgencyFee : 0;
  const totalAmount = ((rawPrice * amount) + deliveryFee).toFixed(2);

  const handleCheckoutOpen = () => {
    if (!isAuthenticated) return navigate('/login');
    setShowCheckout(true);
  };

  const handleAddToBag = () => {
    if (!isAuthenticated) return navigate('/login');
    if (!product) return;
    
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push({ 
      ...product, 
      quantity: amount, 
      selectedSize, 
      selectedColor, 
      addedAt: new Date().toISOString() 
    });
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    
    setNotification({ show: true, msg: "Item Saved to Bag" });
    setTimeout(() => setNotification({ show: false, msg: "" }), 3000);
  };

  const handleFinalPayment = async () => {
    if (!isAuthenticated) return navigate('/login');
    if (!contactName || !phone || !city || !specificRoad) return alert("Fill all fields");

    setIsProcessing(true);
    try {
      const orderPayload = {
        orderId: `ORD-${Date.now()}`, 
        orderItems: [{
          name: product?.name,
          qty: amount,
          image: product?.image,
          price: Number(rawPrice),
          product: id, 
          color: selectedColor,
          size: selectedSize
        }],
        shippingAddress: {
          address: specificRoad,
          city,
          country: "Ethiopia",
          contactName,
          phone
        },
        paymentMethod: "Chapa/Telebirr",
        totalPrice: Number(totalAmount),
      };

      await API.post('/orders', orderPayload);
      setIsSuccess(true);
      
      setTimeout(() => {
        navigate('/products');
      }, 2500);

    } catch (err) {
      console.error("Payment Error:", err);
      alert("Order submission failed. Check your connection.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-white">
      <Loader2 className="animate-spin text-zinc-900" size={30} />
    </div>
  );

  if (!product) return <div className="p-20 text-center font-black">PRODUCT_NOT_FOUND</div>;

  const sizeList = product.sizes ? (Array.isArray(product.sizes) ? product.sizes : product.sizes.split(',')) : [];
  const colorList = product.colors ? (Array.isArray(product.colors) ? product.colors : product.colors.split(',')) : [];

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-20 font-sans text-zinc-900">
      {notification.show && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[1000] bg-zinc-900 text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-4">
          <p className="text-[10px] font-black uppercase tracking-widest">{notification.msg}</p>
        </div>
      )}

      <nav className="p-8 lg:px-12 flex justify-between items-center max-w-7xl mx-auto w-full">
        <button onClick={() => navigate(-1)} className="flex items-center text-[10px] font-black uppercase text-zinc-400 hover:text-black transition-colors">
          <ArrowLeft size={16} className="mr-3" /> Back
        </button>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-100 rounded-full text-[9px] font-black uppercase text-emerald-600">
            <Box size={14} /> {product.stock} In Stock
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="lg:sticky lg:top-12 h-fit">
          <div className="relative bg-white border border-zinc-100 p-16 rounded-[60px] aspect-square flex items-center justify-center overflow-hidden">
            <img 
              src={product.image.startsWith('http') ? product.image : `${backendUrl}${product.image}`} 
              className="max-h-full w-auto object-contain transition-transform" 
              alt={product.name} 
            />
          </div>
        </div>

        <div className="flex flex-col py-4">
          <header className="mb-12">
            <span className="text-purple-600 font-black text-[9px] uppercase tracking-[0.3em] bg-purple-50 px-4 py-1.5 rounded-full border border-purple-100 mb-6 inline-block">
              {product.category}
            </span>
            <h1 className="text-5xl lg:text-6xl font-black uppercase italic tracking-tighter text-zinc-900 leading-[0.85] mb-8">
              {product.name}
            </h1>
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-black tracking-tighter">{rawPrice}</span>
              <span className="text-md font-black text-zinc-300 uppercase italic">Birr</span>
            </div>
          </header>

          <div className="border-t border-zinc-100 pt-10 mb-12">
            <h4 className="text-[10px] font-black uppercase text-zinc-300 tracking-widest mb-6 flex items-center gap-2">
              <Info size={14}/> Description
            </h4>
            <p className="text-zinc-500 text-sm italic leading-relaxed">
              {product.description || "Premium quality product curated for the Efoy Gebya marketplace."}
            </p>
          </div>

          <div className="space-y-12 mb-16">
            {/* CLEANED UP: "Size Preview Selector" text and button removed as requested */}
            {sizeList.length > 0 && (
              <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-5">Select Size</p>
                <div className="flex flex-wrap gap-3">
                  {sizeList.map((s: string, idx: number) => (
                    <button 
                      key={idx}
                      onClick={() => setSelectedSize(s)} 
                      className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase border transition-all ${selectedSize === s ? 'bg-purple-600 text-white border-purple-600 shadow-lg' : 'bg-white text-zinc-400 border-zinc-100 hover:border-purple-200'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {colorList.length > 0 && (
              <div className="animate-in fade-in slide-in-from-left-4 duration-700">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-5">Select Color</p>
                <div className="flex flex-wrap gap-3">
                  {colorList.map((c: string, idx: number) => (
                    <button 
                      key={idx}
                      onClick={() => setSelectedColor(c)} 
                      className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase border transition-all ${selectedColor === c ? 'bg-purple-600 text-white border-purple-600 shadow-lg' : 'bg-white text-zinc-400 border-zinc-100 hover:border-purple-200'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-5 pt-10 border-t border-zinc-100">
            <Button onClick={handleCheckoutOpen} className="flex-[2] bg-purple-600 text-white font-black h-20 rounded-[2.5rem] uppercase italic text-xs shadow-2xl hover:bg-black transition-all">
              Buy Now
            </Button>
            <Button onClick={handleAddToBag} variant="outline" className="flex-1 border-2 border-purple-600 text-purple-600 font-black h-20 rounded-[2.5rem] uppercase italic text-xs hover:bg-purple-600 hover:text-white transition-all">
              Add To Bag
            </Button>
          </div>
        </div>
      </main>

      {showCheckout && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setShowCheckout(false)} />
          <div className="relative bg-white w-full max-w-md rounded-[3rem] shadow-2xl flex flex-col overflow-hidden max-h-[92vh]">
            
            {isSuccess ? (
              <div className="p-12 text-center flex flex-col items-center justify-center h-full min-h-[500px]">
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-purple-100 scale-150 blur-2xl rounded-full opacity-50 animate-pulse"></div>
                    <CheckCircle2 size={100} className="text-purple-600 relative animate-in zoom-in duration-500" />
                </div>
                <h2 className="text-5xl font-black uppercase italic tracking-tighter text-zinc-900 mb-4 leading-none">ORDER<br/>CONFIRMED</h2>
                <div className="flex items-center gap-2 text-purple-600 mb-10">
                    <Sparkles size={16} />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Processing with Chapa</span>
                </div>
                <div className="bg-zinc-50 border border-zinc-100 p-6 rounded-[2rem] w-full mb-8">
                    <p className="text-zinc-400 text-[10px] font-bold uppercase mb-2">Total Paid</p>
                    <p className="text-3xl font-black italic">{totalAmount} <span className="text-xs not-italic">BIRR</span></p>
                </div>
                <p className="text-zinc-400 text-[9px] font-black uppercase tracking-widest animate-pulse">Redirecting to shop...</p>
              </div>
            ) : isProcessing ? (
              <div className="p-32 flex flex-col items-center justify-center gap-8">
                <Loader2 className="animate-spin h-12 w-12 text-purple-600" />
                <p className="font-black text-[10px] uppercase tracking-[0.5em] text-zinc-400">Processing</p>
              </div>
            ) : (
              <>
                <div className="p-8 flex justify-between items-center border-b shrink-0">
                  <h3 className="font-black uppercase italic tracking-tighter text-xl">Order Details</h3>
                  <button onClick={() => setShowCheckout(false)} className="p-2 hover:bg-zinc-100 rounded-full transition-colors"><X size={20} /></button>
                </div>

                <div className="p-8 space-y-8 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <label className="text-[8px] font-black uppercase text-zinc-400 mb-1 block">Size</label>
                      <div onClick={() => setIsSizeOpen(!isSizeOpen)} className="w-full p-4 bg-zinc-50 border rounded-2xl font-black text-[10px] flex justify-between items-center cursor-pointer uppercase">
                        {selectedSize} <ChevronDown size={14} />
                      </div>
                      {isSizeOpen && (
                        <div className="absolute top-full w-full bg-white border mt-1 rounded-2xl shadow-xl z-[100] overflow-hidden">
                          {sizeList.map((s: string, idx: number) => (
                            <div key={idx} onClick={() => {setSelectedSize(s); setIsSizeOpen(false)}} className="p-4 font-black text-[10px] uppercase hover:bg-purple-600 hover:text-white cursor-pointer">{s}</div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="relative">
                      <label className="text-[8px] font-black uppercase text-zinc-400 mb-1 block">Color</label>
                      <div onClick={() => setIsColorOpen(!isColorOpen)} className="w-full p-4 bg-zinc-50 border rounded-2xl font-black text-[10px] flex justify-between items-center cursor-pointer uppercase">
                        {selectedColor} <ChevronDown size={14} />
                      </div>
                      {isColorOpen && (
                        <div className="absolute top-full w-full bg-white border mt-1 rounded-2xl shadow-xl z-[100] overflow-hidden">
                          {colorList.map((c: string, idx: number) => (
                            <div key={idx} onClick={() => {setSelectedColor(c); setIsColorOpen(false)}} className="p-4 font-black text-[10px] uppercase hover:bg-purple-600 hover:text-white cursor-pointer">{c}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[9px] font-black uppercase text-zinc-400 tracking-widest ml-1 flex items-center gap-2"><MapPin size={12}/> Delivery</p>
                    <div className="space-y-3 p-6 bg-zinc-50 rounded-[2.5rem] border border-zinc-100 shadow-inner">
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
                        <input type="text" placeholder="FULL NAME" value={contactName} onChange={e=>setContactName(e.target.value)} className="w-full p-4 pl-12 bg-white rounded-xl font-black text-[10px] outline-none uppercase shadow-sm" />
                      </div>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
                        <input type="text" placeholder="PHONE NUMBER" value={phone} onChange={e=>setPhone(e.target.value)} className="w-full p-4 pl-12 bg-white rounded-xl font-black text-[10px] outline-none uppercase shadow-sm" />
                      </div>
                      <input type="text" placeholder="CITY" value={city} onChange={e=>setCity(e.target.value)} className="w-full p-4 bg-white rounded-xl font-black text-[10px] outline-none uppercase shadow-sm" />
                      <input type="text" placeholder="ROAD / LANDMARK" value={specificRoad} onChange={e=>setSpecificRoad(e.target.value)} className="w-full p-4 bg-white rounded-xl font-black text-[10px] outline-none uppercase shadow-sm" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div 
                      onClick={() => setIsUrgent(!isUrgent)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${isUrgent ? 'border-purple-600 bg-purple-50' : 'border-zinc-100 bg-zinc-50'}`}
                    >
                      <div className="flex items-center gap-2">
                        <Truck size={14} className={isUrgent ? 'text-purple-600' : 'text-zinc-400'} />
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black uppercase">Urgent</span>
                          <span className="text-[7px] font-bold text-zinc-400">+{urgencyFee} BIRR</span>
                        </div>
                      </div>
                      <div className={`w-8 h-4 rounded-full relative transition-colors ${isUrgent ? 'bg-purple-600' : 'bg-zinc-200'}`}>
                        <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${isUrgent ? 'left-4.5' : 'left-0.5'}`} />
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-zinc-900 p-1.5 rounded-full h-14 w-full">
                      <button onClick={() => setAmount(Math.max(1, amount - 1))} className="px-3 text-white"><Minus size={14}/></button>
                      <span className="text-white font-black text-sm">{amount}</span>
                      <button onClick={() => setAmount(amount + 1)} className="px-3 text-white"><Plus size={14}/></button>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-zinc-100 shrink-0">
                    <div className="flex justify-between items-end mb-6 px-2">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase text-zinc-300">Total Price</span>
                        <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest italic">Secure Checkout</span>
                      </div>
                      <span className="text-4xl font-black italic tracking-tighter text-zinc-900">{totalAmount} <small className="text-[10px] not-italic text-zinc-400">BIRR</small></span>
                    </div>
                    
                    <button 
                      onClick={handleFinalPayment} 
                      className="w-full bg-purple-600 text-white h-20 rounded-[1.8rem] font-black uppercase italic tracking-tighter shadow-2xl flex flex-col items-center justify-center hover:bg-black transition-all active:scale-95"
                    >
                      <div className="flex items-center gap-3">
                        <CreditCard size={18} />
                        <span className="text-[14px]">Confirm Order</span>
                      </div>
                      <span className="text-[8px] opacity-60 tracking-widest font-normal uppercase">
                        Qty: {amount} • Size: {selectedSize} • Color: {selectedColor}
                      </span>
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

export default ProductDetail;