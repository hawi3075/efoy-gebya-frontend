import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Maximize2, ArrowLeft, Loader2 } from 'lucide-react';
import ProductSidebar from '../components/ecommerce/ProductSidebar';
import axios from 'axios';

interface Product {
  _id: string;
  name: string;
  price: string | number;
  category: string;
  image: string;
  isRecommended?: boolean; 
  salesCount?: number;     
}

const Products = () => {
  const navigate = useNavigate();
  const backendUrl = "http://localhost:5000";
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All Products');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all products on mount
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${backendUrl}/api/products`);
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, [backendUrl]);

  // FUZZY FILTER LOGIC
  const filteredProducts = useMemo(() => {
    return products.filter((product: Product) => {
      // Normalize strings: lowercase and remove extra spaces
      const prodCat = product.category.toLowerCase().trim();
      const activeCat = activeCategory.toLowerCase().trim();

      // 1. Permanent exclusion (e.g., hidden categories)
      if (prodCat === 'furniture') return false;

      // 2. Search Bar Logic
      const searchLower = searchQuery.toLowerCase().trim();
      const matchesSearch = product.name.toLowerCase().includes(searchLower) || 
                            prodCat.includes(searchLower);
      if (searchLower && !matchesSearch) return false;

      // 3. Handle Special Global Sidebar Categories
      if (activeCategory === 'All Products') return true;
      if (activeCategory === 'Recommended') return !!product.isRecommended;
      if (activeCategory === 'Top Seller') return (product.salesCount || 0) > 100;

      /**
       * THE FIX: SPLIT-WORD FUZZY MATCH
       * Splits "Women Shoes" into ["women", "shoes"] 
       * and checks if the sidebar selection "Women" matches any of those words.
       */
      const prodWords = prodCat.split(/\s+/); 
      const activeWords = activeCat.split(/\s+/);

      // Returns true if any word in the clicked sidebar category exists in the product's category string
      const isFuzzyMatch = activeWords.some(word => prodWords.includes(word)) || 
                          prodCat.includes(activeCat);

      return isFuzzyMatch;
    });
  }, [activeCategory, searchQuery, products]);

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white gap-4">
        <Loader2 className="animate-spin h-8 w-8 text-purple-600" />
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400 italic">Efoy Gebya Syncing...</p>
      </div>
    );
  }

  return (
    <div className="bg-white h-screen font-sans text-black flex overflow-hidden">
      
      {/* SIDEBAR SECTION */}
      <aside className="hidden lg:flex w-72 h-full flex-col border-r border-zinc-100 bg-white shrink-0">
        <div className="p-6 border-b border-zinc-50 flex items-center justify-between">
           <button onClick={() => navigate(-1)} className="hover:text-purple-600 transition-colors">
              <ArrowLeft size={18} />
           </button>
           <span className="text-[9px] font-black tracking-[0.4em] uppercase text-zinc-300 italic">Catalogue</span>
        </div>
        <div className="p-8 flex-1 overflow-y-auto">
          <ProductSidebar activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
        </div>
        <div className="p-6 border-t border-zinc-50">
           <p className="text-[8px] font-black tracking-[0.5em] uppercase text-zinc-200 text-center">Efoy Gebya © 2026</p>
        </div>
      </aside>

      {/* MAIN PRODUCT FEED */}
      <main className="flex-1 h-full overflow-y-auto bg-[#fafafa]">
        
        {/* STICKY TOP NAV */}
        <div className="sticky top-0 z-40 bg-[#fafafa]/90 backdrop-blur-md px-8 py-6 border-b border-zinc-100/50">
          <div className="flex flex-row items-center justify-between gap-4 max-w-[1400px] mx-auto">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
              <input 
                type="text" 
                placeholder="QUICK SEARCH..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-zinc-200 py-3 pl-12 pr-4 rounded-xl text-[9px] font-black tracking-widest outline-none focus:border-purple-300 transition-all" 
              />
            </div>

            <div className="flex items-center gap-4">
               <h2 className="text-[10px] font-black italic uppercase tracking-tighter text-black">{activeCategory}</h2>
               <div className="h-4 w-[1px] bg-zinc-200"></div>
               <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{filteredProducts.length} Items</span>
            </div>
          </div>
        </div>

        {/* GRID LAYOUT */}
        <div className="p-8 max-w-[1400px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product: Product) => (
              <div 
                key={product._id} 
                className="group flex flex-col cursor-pointer bg-white p-3 rounded-[1.5rem] border border-zinc-50 hover:border-zinc-200 transition-all duration-300 hover:shadow-xl" 
                onClick={() => navigate(`/product/${product._id}`)}
              >
                <div className="relative aspect-square overflow-hidden bg-zinc-50/50 rounded-[1.2rem] mb-4 flex items-center justify-center p-6">
                  <img 
                    src={product.image.startsWith('http') ? product.image : `${backendUrl}${product.image}`} 
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500" 
                    alt={product.name} 
                  />
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="bg-zinc-900 text-white p-3 rounded-xl shadow-2xl"><Maximize2 size={14} /></div>
                  </div>
                </div>
                
                <div className="px-1 text-center">
                  <p className="text-[7px] font-black uppercase tracking-[0.2em] text-purple-600 mb-1">{product.category}</p>
                  <h2 className="text-[10px] font-black tracking-tight uppercase mb-2 h-7 line-clamp-2 italic leading-tight text-zinc-800">
                    {product.name}
                  </h2>
                  <p className="text-sm font-black tracking-tighter text-black">
                    {product.price} <span className="text-[8px] text-zinc-300 italic">ETB</span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* EMPTY STATE */}
          {filteredProducts.length === 0 && (
            <div className="py-20 text-center">
               <p className="text-zinc-300 font-black uppercase tracking-[0.4em] text-[8px] italic">No items found for "{activeCategory}"</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Products;