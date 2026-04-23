import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, X, Loader2, Upload } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import API from '../../api/axios';

const ProductCatalogue = () => {
  const [productList, setProductList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/products');
      setProductList(data);
    } catch (err) {
      console.error("Failed to load inventory:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this asset from inventory?")) return;
    try {
      await API.delete(`/products/${id}`);
      setProductList(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      alert("Error deleting product.");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    // FIX: Ensure the file is appended correctly to the FormData
    if (selectedFile) {
      formData.set('image', selectedFile);
    }

    try {
      const config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      };

      if (currentProduct) {
        await API.put(`/products/${currentProduct._id}`, formData, config);
      } else {
        // Validation for new products
        if (!selectedFile) {
          alert("Product image is required.");
          return;
        }
        await API.post('/products', formData, config);
      }

      // FIX: Full State Reset on Success
      setIsModalOpen(false);
      setImagePreview(null);
      setSelectedFile(null); 
      setCurrentProduct(null);
      formElement.reset(); // Physically clear the HTML inputs
      
      fetchProducts();
      alert("Inventory Updated Successfully!");
    } catch (err: any) {
      console.error("Save failed:", err);
      // Logic to show specific error from backend (like "Unique" error)
      const errorMsg = err.response?.data?.message || "Failed to save product.";
      alert(errorMsg);
    }
  };

  const filteredProducts = productList.filter(p => 
    p.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalInventoryValue = productList.reduce((acc, curr) => 
    acc + (Number(curr.price) * Number(curr.countInStock || 0)), 0
  );

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#fcfcfc]">
      <Loader2 className="animate-spin text-indigo-600" size={40} />
    </div>
  );

  return (
    <div className="flex bg-[#fcfcfc] min-h-screen font-sans">
      <AdminSidebar />
      
      <main className="flex-1 p-12 relative">
        <header className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-4xl font-[900] tracking-tighter uppercase mb-2 text-black">Product Catalogue</h1>
            <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">
              Manage inventory through the Efoy Gebya Terminal.
            </p>
          </div>
          <button 
            onClick={() => { 
              setCurrentProduct(null); 
              setImagePreview(null); 
              setSelectedFile(null); 
              setIsModalOpen(true); 
            }}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20"
          >
            <Plus size={16} /> Add New Product
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white border border-zinc-100 rounded-[2rem] p-4 flex items-center shadow-sm">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-50 border-none py-3 pl-12 pr-6 rounded-xl text-[10px] font-bold tracking-widest outline-none text-black" 
              />
            </div>
          </div>
          <div className="bg-indigo-600 rounded-[2rem] p-4 flex flex-col justify-center items-center text-white shadow-lg shadow-indigo-500/20">
            <span className="text-[8px] font-black uppercase tracking-[0.2em] opacity-80">Inventory Value</span>
            <span className="text-xl font-black">${totalInventoryValue.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-white border border-zinc-100 rounded-[2.5rem] overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-50">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Product</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Category</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Stock</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Price</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product._id} className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <img src={`http://localhost:5000${product.image}`} alt="" className="w-10 h-10 rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all border border-zinc-100" />
                      <div>
                        <span className="text-xs font-[900] tracking-tight uppercase block text-black">{product.name}</span>
                        <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">{product.brand}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-[10px] font-black uppercase text-indigo-600 tracking-widest">{product.category}</td>
                  <td className="px-8 py-6 text-xs font-black text-black">{product.countInStock}</td>
                  <td className="px-8 py-6 text-xs font-black text-black">${product.price}</td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => { 
                        setCurrentProduct(product); 
                        setImagePreview(`http://localhost:5000${product.image}`); 
                        setSelectedFile(null); 
                        setIsModalOpen(true); 
                      }} className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-zinc-100 transition-all group">
                        <Edit size={14} className="text-zinc-400 group-hover:text-indigo-600" />
                      </button>
                      <button onClick={() => handleDelete(product._id)} className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-zinc-100 transition-all group">
                        <Trash2 size={14} className="text-zinc-400 group-hover:text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/40 backdrop-blur-md p-6">
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 relative shadow-2xl border border-zinc-100 animate-in fade-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto scrollbar-hide">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-zinc-300 hover:text-zinc-950 transition-colors">
                <X size={20} />
              </button>
              
              <div className="mb-8">
                <h2 className="text-xl font-[950] tracking-tighter uppercase text-zinc-900">
                  {currentProduct ? 'Update Asset' : 'Register New Product'}
                </h2>
                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-[0.2em] mt-1">Efoy Gebya Inventory Protocol</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 ml-1">Product Visuals</label>
                  <div className="relative group cursor-pointer">
                    <input name="image" type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer" />
                    <div className="w-full h-32 bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-2xl flex flex-col items-center justify-center gap-2 group-hover:border-indigo-400 transition-all overflow-hidden">
                      {imagePreview ? (
                        <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                      ) : (
                        <>
                          <Upload size={20} className="text-zinc-300" />
                          <span className="text-[9px] font-black uppercase text-zinc-400 tracking-widest">Click to upload file</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 ml-1">Full Name</label>
                  <input name="name" defaultValue={currentProduct?.name} required type="text" className="w-full bg-zinc-50 border border-zinc-100 p-3 rounded-xl text-[11px] font-bold outline-none focus:border-indigo-500" placeholder="Unique product name" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 ml-1">Price ($)</label>
                    <input name="price" defaultValue={currentProduct?.price} required type="text" className="w-full bg-zinc-50 border border-zinc-100 p-3 rounded-xl text-[11px] font-bold outline-none" placeholder="3000" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 ml-1">Category</label>
                    <input name="category" defaultValue={currentProduct?.category} placeholder="e.g. Clothing" required className="w-full bg-zinc-50 border border-zinc-100 p-3 rounded-xl text-[11px] font-bold outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 ml-1">Sizes (comma separated)</label>
                    <input name="sizes" defaultValue={currentProduct?.sizes?.join(', ')} placeholder="S, M, L" className="w-full bg-zinc-50 border border-zinc-100 p-3 rounded-xl text-[11px] font-bold outline-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 ml-1">Colors (comma separated)</label>
                    <input name="colors" defaultValue={currentProduct?.colors?.join(', ')} placeholder="Red, Blue" className="w-full bg-zinc-50 border border-zinc-100 p-3 rounded-xl text-[11px] font-bold outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 ml-1">Brand</label>
                    <input name="brand" defaultValue={currentProduct?.brand} required type="text" className="w-full bg-zinc-50 border border-zinc-100 p-3 rounded-xl text-[11px] font-bold outline-none" placeholder="Nike" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 ml-1">Stock</label>
                    <input name="countInStock" defaultValue={currentProduct?.countInStock} required type="number" className="w-full bg-zinc-50 border border-zinc-100 p-3 rounded-xl text-[11px] font-bold outline-none" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 ml-1">Description</label>
                  <textarea name="description" defaultValue={currentProduct?.description} required className="w-full bg-zinc-50 border border-zinc-100 p-3 rounded-xl text-[11px] font-bold outline-none h-20 resize-none" />
                </div>

                <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg active:scale-95">
                  {currentProduct ? 'Update Inventory' : 'Confirm Registration'}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductCatalogue;