import { useState, useEffect } from 'react';
import { ArrowRight, Star, ChevronRight, Maximize2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// --- TYPES ---
interface Product {
  _id: string;
  name: string;
  image: string;
  category: string;
  price: number | string;
  brand: string;
}

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Dynamically uses Render on Vercel and Localhost on your PC
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/products`);
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [API_URL]);

  const handleSeeAll = (path: string = '/products') => {
    navigate(path);
  };

  // --- CATEGORY LOGIC ---
  const uniqueCategories = Array.from(new Set(products.map(p => p.category.toLowerCase())));
  
  const displayCategories = uniqueCategories
    .filter(cat => cat !== 'toys' && cat !== 'video games')
    .map(cat => {
      let displayName = cat.charAt(0).toUpperCase() + cat.slice(1);
      if (cat === 'computer') displayName = 'Electronics';
      if (cat === 'apparel') displayName = 'Cloth';
      
      const sampleProduct = products.find(p => p.category.toLowerCase() === cat);
      
      return {
        name: displayName,
        slug: cat,
        image: sampleProduct?.image || "" 
      };
    });

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white">
        <Loader2 className="animate-spin h-10 w-10 text-zinc-300" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-20 pb-0 bg-white font-sans">
      
      {/* --- HERO SECTION --- */}
      <section className="relative w-full h-[90vh] overflow-hidden flex items-center justify-center border-b border-zinc-100">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0">
          <source src="/website.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/70 z-10" />

        <div className="container mx-auto px-8 relative z-20 text-center">
          <div className="max-w-4xl mx-auto space-y-10">
            <div className="space-y-4">
              <h1 className="text-6xl md:text-9xl font-black leading-[0.8] tracking-[-0.06em] uppercase text-white drop-shadow-2xl">
                Shop From <br /> 
                <span className="text-zinc-100">Efoy Gebya</span>
              </h1>
              <p className="font-light tracking-[0.4em] text-sm md:text-xl uppercase text-white/90 drop-shadow-md">
                Elevate Your Personal Style
              </p>
            </div>
            
            <div className="pt-6">
              <Button 
                onClick={() => handleSeeAll()} 
                className="bg-white text-black px-14 py-8 rounded-none hover:bg-black hover:text-white transition-all duration-700 text-[11px] font-bold uppercase tracking-[0.5em] h-auto border border-white"
              >
                Shop Collection
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* --- RECOMMENDATIONS --- */}
      <section className="container mx-auto px-8">
        <div className="flex justify-between items-end mb-12">
          <div className="space-y-3">
            <h2 className="text-3xl font-black uppercase tracking-tighter">Recommended For You</h2>
            <div className="h-0.5 w-20 bg-black"></div>
          </div>
          <button onClick={() => handleSeeAll()} className="text-[10px] uppercase border-b border-black pb-1 flex items-center gap-2 font-black tracking-[0.2em] hover:opacity-60 transition-opacity">
            See More <ArrowRight className="h-3 w-3" />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {products.slice(0, 5).map((item) => (
            <ProductCard key={item._id} product={item} onClick={() => navigate(`/product/${item._id}`)} />
          ))}
        </div>
      </section>

      {/* --- SHOP BY CATEGORY --- */}
      <section className="container mx-auto px-8">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-black uppercase tracking-tighter">Shop by Category</h2>
          <button onClick={() => handleSeeAll()} className="text-[10px] uppercase border-b border-black pb-1 font-black tracking-[0.2em] cursor-pointer">See All</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {displayCategories.map((cat) => (
            <div key={cat.name} onClick={() => handleSeeAll(`/products?category=${cat.slug}`)} className="group cursor-pointer text-center">
              <div className="aspect-[4/5] bg-zinc-50 overflow-hidden mb-4 border border-zinc-100">
                <img 
                  src={cat.image.startsWith('http') ? cat.image : `${API_URL}${cat.image.startsWith('/') ? '' : '/'}${cat.image}`} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  alt={cat.name} 
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x500?text=Category'; }}
                />
              </div>
              <p className="text-[11px] font-black uppercase tracking-[0.3em]">{cat.name}</p>
            </div>
          ))}
        </div>
      </section>

      <ProductRowSection title="Last Viewed" data={products.slice(2, 7)} />
      <ProductRowSection title="Top Sellers" data={products.slice(0, 5)} />

      {/* --- STYLE BANNERS --- */}
      <section className="container mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-10 mb-24">
        <ComfyBanner 
          title="Comfy style for her.✨" 
          description="Shop from efoy gebya fashion including shoes, clothes, handbags and much more😊"
          img="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop"
          onExplore={() => handleSeeAll('/products?category=cloth')}
        />
        <ComfyBanner 
          title="Comfy style for him.✨" 
          description="Shop from efoy gebya fashion including shoes, clothes, handbags and much more😊"
          img="https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=1000&auto=format&fit=crop"
          onExplore={() => handleSeeAll('/products?category=cloth')}
        />
      </section>
    </div>
  );
};

// --- HELPER COMPONENTS ---

const ProductCard = ({ product, onClick }: { product: Product, onClick: () => void }) => {
  const backendUrl = import.meta.env.VITE_API_URL;
  const imagePath = product.image.startsWith('/') ? product.image : `/${product.image}`;
  const fullImageUrl = product.image.startsWith('http') ? product.image : `${backendUrl}${imagePath}`;

  return (
    <div className="group cursor-pointer" onClick={onClick}>
      <div className="aspect-[3/4] overflow-hidden bg-[#FBFBFB] mb-5 relative border border-zinc-50 p-4 flex items-center justify-center">
        <Star className="absolute top-4 right-4 h-3.5 w-3.5 fill-black text-black" />
        <div className="absolute bottom-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
          <button className="bg-black text-white p-3 rounded-none shadow-2xl hover:bg-zinc-800 transition-colors">
            <Maximize2 size={16} />
          </button>
        </div>
        <img src={fullImageUrl} className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-700" alt={product.name} onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x400?text=No+Image'; }} />
      </div>
      <div className="space-y-2 px-1">
        <div className="flex items-center gap-1 mb-1">
          {[...Array(5)].map((_, i) => <Star key={i} size={10} className={i < 4 ? "fill-black text-black" : "fill-zinc-200 text-zinc-200"} />)}
        </div>
        <p className="text-[9px] font-medium text-zinc-400 uppercase tracking-[0.2em] leading-none">{product.category}</p>
        <h3 className="text-[11px] font-black uppercase truncate tracking-tight">{product.name}</h3>
        <p className="text-[13px] font-black text-black tracking-tighter">
          {typeof product.price === 'number' ? `$${product.price}` : product.price}
        </p>
      </div>
    </div>
  );
};

const ComfyBanner = ({ title, description, img, onExplore }: { title: string, description: string, img: string, onExplore: () => void }) => (
  <div className="bg-[#FBFBFB] p-12 flex flex-col md:flex-row items-center justify-between border border-zinc-100 relative overflow-hidden group">
    <div className="w-full md:w-1/2 space-y-4 z-10 text-center md:text-left">
      <h3 className="text-4xl font-black text-black tracking-tighter uppercase leading-none">{title}</h3>
      <p className="text-xs text-zinc-500 leading-relaxed max-w-[260px] mx-auto md:mx-0">{description}</p>
      <button onClick={onExplore} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] pt-6 group-hover:translate-x-2 transition-transform mx-auto md:mx-0 cursor-pointer">Explore <ChevronRight className="h-4 w-4" /></button>
    </div>
    <div className="w-full md:w-1/2 mt-10 md:mt-0 relative h-[300px] flex justify-center items-center">
        <img src={img} className="max-h-full w-auto object-contain transition-transform duration-700 group-hover:rotate-2" alt="Style Category" />
    </div>
  </div>
);

const ProductRowSection = ({ title, data }: { title: string, data: Product[] }) => {
  const navigate = useNavigate();
  return (
    <section className="container mx-auto px-8">
      <div className="flex justify-between items-end mb-12">
        <h2 className="text-3xl font-black uppercase tracking-tighter">{title}</h2>
        <button onClick={() => navigate('/products')} className="text-[10px] uppercase border-b border-black pb-1 font-black tracking-[0.2em] cursor-pointer">Shop All</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
        {data.map((product) => (
          <ProductCard key={product._id} product={product} onClick={() => navigate(`/product/${product._id}`)} />
        ))}
      </div>
    </section>
  );
};

export default Home;