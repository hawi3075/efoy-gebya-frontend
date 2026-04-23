import { useState, useEffect, useRef } from 'react';
import { 
  UserCheck, Loader2, Camera, Save, Lock, 
  KeyRound, CheckCircle2, Eye, EyeOff, Edit, 
  ArrowLeft, Settings2, LogOut // Added LogOut icon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Added for redirection
import AdminSidebar from '../../components/admin/AdminSidebar';
import API from '../../api/axios';

const AdminProfile = () => {
  const navigate = useNavigate(); // Initialize navigate
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Visibility Toggles
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Image Logic
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [profileData, setProfileData] = useState({ firstName: '', lastName: '' });
  const [passwordData, setPasswordData] = useState({ 
    currentPassword: '', 
    newPassword: '', 
    confirmPassword: '' 
  });

  // --- LOGOUT FUNCTION ---
  const handleLogout = () => {
    localStorage.removeItem('userInfo'); // Remove your auth data
    navigate('/login'); // Redirect to login page
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await API.get('/users/profile');
        setUser(data);
        setProfileData({ firstName: data.firstName || '', lastName: data.lastName || '' });
        if (data.image) setPreviewImage(data.image);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Handle Image Selection and Auto-Save
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);

      const imgData = new FormData();
      imgData.append('avatar', file); 
      
      try {
        setUpdating(true);
        const { data } = await API.post('/users/upload-avatar', imgData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setUser(data.user);
        setMessage({ type: 'success', text: 'Profile Image Saved!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } catch (err) {
        setMessage({ type: 'error', text: 'Image upload failed' });
      } finally {
        setUpdating(false);
      }
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const { data } = await API.put('/users/profile', profileData);
      setUser(data);
      setMessage({ type: 'success', text: 'Identity Details Saved!' });
      setTimeout(() => { setMessage({ type: '', text: '' }); setIsEditing(false); }, 2000);
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Update failed' });
    } finally {
      setUpdating(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }
    setUpdating(true);
    try {
      await API.put('/users/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setMessage({ type: 'success', text: 'Password Security Updated!' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => { setMessage({ type: '', text: '' }); setIsEditing(false); }, 2000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Password update failed' });
    } finally {
      setUpdating(false);
    }
  };

  const cardStyle = "bg-white p-10 rounded-[2.5rem] border border-zinc-100 shadow-sm transition-all duration-500";
  const inputStyle = "w-full px-5 py-4 border border-zinc-100 rounded-2xl bg-zinc-50 text-sm focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]/50 transition-all outline-none";
  const labelStyle = "block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2.5 ml-1";
  const eyeBtnStyle = "absolute right-5 top-[46px] text-zinc-400 hover:text-[#7c3aed] transition-colors";

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#fcfcfc]">
      <Loader2 className="animate-spin text-[#7c3aed]" size={40} />
    </div>
  );

  return (
    <div className="flex bg-[#fcfcfc] min-h-screen font-sans text-black">
      <AdminSidebar />
      <main className="flex-1 p-12 max-w-6xl mx-auto">
        
        <header className="mb-12 flex justify-between items-start"> {/* Changed items-end to items-start */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-1 bg-[#7c3aed] rounded-full" />
              <h1 className="text-4xl font-[900] tracking-tighter uppercase">
                Admin <span className="text-[#7c3aed]">{isEditing ? 'Settings' : 'Profile'}</span>
              </h1>
            </div>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest ml-4">Credentials & Security</p>
          </div>

          <div className="flex items-center gap-4"> {/* Added container for Logout + Status */}
            {message.text && (
              <div className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase flex items-center gap-2 animate-in fade-in slide-in-from-top-4 ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                <CheckCircle2 size={16} /> {message.text}
              </div>
            )}
            
            {/* --- NEW LOGOUT BUTTON --- */}
            <button 
              onClick={handleLogout}
              className="px-5 py-3 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-red-100 transition-colors border border-red-100"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* PROFILE SUMMARY CARD */}
          <div className="lg:col-span-4">
            <div className={`${cardStyle} flex flex-col items-center text-center sticky top-12`}>
              <div className="relative mb-6 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
                <div className="w-32 h-32 rounded-full bg-[#7c3aed] flex items-center justify-center text-white text-4xl font-[900] shadow-xl border-4 border-white uppercase overflow-hidden transition-transform group-hover:scale-105">
                  {previewImage ? (
                    <img src={previewImage.startsWith('data') ? previewImage : `http://localhost:5000${previewImage}`} className="w-full h-full object-cover" />
                  ) : (
                    <>{user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}</>
                  )}
                </div>
                <div className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={24} className="text-white mb-1" />
                  <span className="text-[8px] text-white font-black uppercase tracking-widest">Change Photo</span>
                </div>
              </div>
              <h2 className="text-2xl font-[900] uppercase tracking-tighter">{user?.firstName} {user?.lastName}</h2>
              <p className="text-zinc-400 text-sm lowercase mb-8">{user?.email}</p>
              
              {!isEditing ? (
                <button onClick={() => setIsEditing(true)} className="w-full py-4 bg-[#7c3aed] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#6d31cf] shadow-xl shadow-indigo-100">
                  <Edit size={16}/> Edit Settings
                </button>
              ) : (
                <button onClick={() => setIsEditing(false)} className="w-full py-4 border border-zinc-100 bg-white text-zinc-500 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-zinc-50">
                  <ArrowLeft size={16}/> View Profile
                </button>
              )}
            </div>
          </div>

          {/* EDITING FORMS */}
          <div className="lg:col-span-8">
            {!isEditing ? (
              <div className={`${cardStyle} flex flex-col items-center justify-center py-32 text-center border-dashed border-2`}>
                <Settings2 size={48} className="text-zinc-200 mb-4" />
                <h3 className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">Click Edit to update profile details</h3>
              </div>
            ) : (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-500">
                <form onSubmit={handleUpdateProfile} className={cardStyle}>
                  <div className="flex items-center gap-3 mb-10"><UserCheck className="text-[#7c3aed]" size={20} /><h3 className="text-xl font-[900] uppercase tracking-tighter">Identity Details</h3></div>
                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div><label className={labelStyle}>First Name</label><input type="text" value={profileData.firstName} onChange={(e) => setProfileData({...profileData, firstName: e.target.value})} className={inputStyle} /></div>
                    <div><label className={labelStyle}>Last Name</label><input type="text" value={profileData.lastName} onChange={(e) => setProfileData({...profileData, lastName: e.target.value})} className={inputStyle} /></div>
                  </div>
                  <button type="submit" disabled={updating} className="w-full py-4 bg-black text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center justify-center gap-2">
                    {updating ? <Loader2 className="animate-spin" size={16}/> : <Save size={16}/>} Save Identity
                  </button>
                </form>

                <form onSubmit={handlePasswordChange} className={cardStyle}>
                  <div className="flex items-center gap-3 mb-10"><KeyRound className="text-[#7c3aed]" size={20} /><h3 className="text-xl font-[900] uppercase tracking-tighter">Security Credentials</h3></div>
                  <div className="space-y-6 mb-8">
                    <div className="relative">
                      <label className={labelStyle}>Current Password</label>
                      <input type={showCurrent ? "text" : "password"} value={passwordData.currentPassword} onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})} className={inputStyle} required />
                      <button type="button" onClick={() => setShowCurrent(!showCurrent)} className={eyeBtnStyle}>{showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="relative">
                        <label className={labelStyle}>New Password</label>
                        <input type={showNew ? "text" : "password"} value={passwordData.newPassword} onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} className={inputStyle} required />
                        <button type="button" onClick={() => setShowNew(!showNew)} className={eyeBtnStyle}>{showNew ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                      </div>
                      <div className="relative">
                        <label className={labelStyle}>Confirm Password</label>
                        <input type={showConfirm ? "text" : "password"} value={passwordData.confirmPassword} onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})} className={inputStyle} required />
                        <button type="button" onClick={() => setShowConfirm(!showConfirm)} className={eyeBtnStyle}>{showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                      </div>
                    </div>
                  </div>
                  <button type="submit" disabled={updating} className="w-full py-4 bg-[#7c3aed] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-[#6d31cf] transition-all flex items-center justify-center gap-2">
                    {updating ? <Loader2 className="animate-spin" size={16}/> : <Lock size={16}/>} Change Password
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminProfile;