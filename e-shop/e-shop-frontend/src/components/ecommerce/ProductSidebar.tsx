import { useState } from 'react';
import { ChevronDown, ChevronUp, Star, Flame, ChevronRight } from 'lucide-react';

interface SidebarProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const ProductSidebar = ({ activeCategory, onCategoryChange }: SidebarProps) => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);

  const categories = [
    { name: 'All Products' },
    { name: 'Clothing', hasSub: true },
    { name: 'Shoes', hasSub: true },
    { name: 'Home Materials' },
    { name: 'Beauty' },
    { name: 'Electronics' },
    { name: 'Fashion' },
    { name: 'Accessories' }
  ];

  return (
    <div className="space-y-10">
      {/* Category Section */}
      <div>
        <button 
          onClick={() => setIsCategoryOpen(!isCategoryOpen)}
          className="w-full flex items-center justify-between mb-8 group"
        >
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-800">Category</h3>
          <div className="p-1 rounded-md bg-zinc-50 group-hover:bg-zinc-100 transition-colors">
            {isCategoryOpen ? <ChevronUp size={12} className="text-purple-600" /> : <ChevronDown size={12} />}
          </div>
        </button>
        
        {isCategoryOpen && (
          <ul className="space-y-4">
            {categories.map((cat) => {
              const isParentActive = activeCategory === cat.name || activeCategory.startsWith(`${cat.name}:`);
              
              return (
                <li key={cat.name} className="flex flex-col gap-3">
                  <div 
                    onClick={() => onCategoryChange(cat.name)}
                    className={`flex items-center justify-between text-[10px] font-bold uppercase tracking-widest cursor-pointer transition-all ${
                      isParentActive ? 'text-purple-600' : 'text-zinc-400 hover:text-black hover:translate-x-1'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-1 w-1 rounded-full transition-all duration-300 ${
                        isParentActive ? 'bg-purple-600 scale-150 shadow-[0_0_8px_rgba(147,51,234,0.5)]' : 'bg-zinc-200'
                      }`} />
                      {cat.name}
                    </div>
                    {cat.hasSub && <ChevronRight size={10} className={isParentActive ? 'rotate-90 text-purple-600' : ''} />}
                  </div>

                  {cat.hasSub && isParentActive && (
                    <ul className="pl-6 space-y-3 animate-in fade-in slide-in-from-left-2 duration-300">
                      {['Men', 'Women', 'Children'].map((sub) => {
                        const subValue = `${cat.name}:${sub}`;
                        const isSubActive = activeCategory === subValue;
                        
                        return (
                          <li 
                            key={sub} 
                            onClick={(e) => {
                              e.stopPropagation();
                              onCategoryChange(subValue);
                            }}
                            className={`text-[9px] font-black cursor-pointer flex items-center gap-2 group transition-colors ${
                              isSubActive ? 'text-purple-600' : 'text-zinc-400 hover:text-black'
                            }`}
                          >
                            <ChevronRight size={8} className={`${isSubActive ? 'translate-x-1' : 'group-hover:translate-x-1'} transition-transform`} />
                            {sub}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Recommended Section */}
      <div 
        onClick={() => onCategoryChange('Recommended')}
        className={`pt-6 border-t border-zinc-100 cursor-pointer group transition-all ${
          activeCategory === 'Recommended' ? 'translate-x-1' : ''
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          <Star size={12} className={activeCategory === 'Recommended' ? 'fill-purple-600 text-purple-600' : 'text-zinc-300'} />
          <h3 className={`text-[10px] font-black uppercase tracking-widest transition-colors ${activeCategory === 'Recommended' ? 'text-purple-600' : 'text-zinc-500'}`}>
            Recommended
          </h3>
        </div>
        <p className="text-[8px] text-zinc-400 font-medium leading-relaxed tracking-wider italic uppercase">
          Curated for your style
        </p>
      </div>

      {/* Top Seller Section */}
      <div 
        onClick={() => onCategoryChange('Top Seller')}
        className={`pt-6 border-t border-zinc-100 cursor-pointer group transition-all ${
          activeCategory === 'Top Seller' ? 'translate-x-1' : ''
        }`}
      >
        <div className="flex items-center gap-2">
          <Flame size={12} className={activeCategory === 'Top Seller' ? 'text-purple-600' : 'text-zinc-300'} />
          <h3 className={`text-[10px] font-black uppercase tracking-widest transition-colors ${activeCategory === 'Top Seller' ? 'text-purple-600' : 'text-zinc-500'}`}>
            Top Seller
          </h3>
        </div>
      </div>
    </div>
  );
};

export default ProductSidebar;