import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Zap, Check, ArrowLeft, Globe } from 'lucide-react';

const About = () => {
  const navigate = useNavigate();

  // FLAT VECTOR FEMALE (Ref: Anwar Alsaleh style with long shadows)
  const FemaleVector = () => (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path d="M100 20C75 20 55 40 55 65C55 85 66 102 83 110L200 200V80L100 20Z" fill="black" fillOpacity="0.05"/>
      <path d="M100 20C75 20 55 40 55 65C55 90 75 110 100 110C125 110 145 90 145 65C145 40 125 20 100 20Z" fill="#18181B"/>
      <path d="M100 130C65 130 35 155 35 190H165C165 155 135 130 100 130Z" fill="#D4D4D8"/>
      <path d="M100 40C83.4315 40 70 53.4315 70 70V80C70 96.5685 83.4315 110 100 110C116.569 110 130 96.5685 130 80V70C130 53.4315 116.569 40 100 40Z" fill="#F4E0C8"/>
      <path d="M100 110V130C100 130 110 125 110 115C110 110 100 110 100 110Z" fill="#EAD2B8"/>
      <path d="M70 70C70 53.4315 83.4315 40 100 40C100 40 105 35 100 35C95 35 88 40 88 40C75 42 70 55 70 70Z" fill="#18181B"/>
      <path d="M130 70C130 53.4315 116.569 40 100 40C100 40 95 35 100 35C105 35 112 40 112 40C125 42 130 55 130 70Z" fill="#18181B"/>
    </svg>
  );

  // FLAT VECTOR MALE (Ref: Anwar Alsaleh style with long shadows)
  const MaleVector = () => (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path d="M100 25C78 25 60 43 60 65C60 87 78 105 100 105L200 185V75L100 25Z" fill="black" fillOpacity="0.05"/>
      <path d="M100 25C78 25 60 43 60 65C60 65 58 75 65 75C72 75 75 65 100 65C125 65 128 75 135 75C142 75 140 65 140 65C140 43 122 25 100 25Z" fill="#27272A"/>
      <path d="M100 130C60 130 30 155 30 195H170C170 155 140 130 100 130Z" fill="#F4F4F5"/>
      <path d="M100 130C60 130 30 155 30 195H60L100 160L140 195H170C170 155 140 130 100 130Z" fill="#1E3A8A"/>
      <path d="M100 130V160L108 170L100 130Z" fill="#DC2626"/> 
      <path d="M100 40C83.4315 40 70 53.4315 70 70V80C70 96.5685 83.4315 110 100 110C116.569 110 130 96.5685 130 80V70C130 53.4315 116.569 40 100 40Z" fill="#F4E0C8"/>
      <path d="M100 110V130C100 130 110 125 110 115C110 110 100 110 100 110Z" fill="#EAD2B8"/>
    </svg>
  );

  const teamMembers = [
    { name: "SARA", role: "CHIEF DESIGN OFFICER", component: <FemaleVector />, bgColor: 'bg-zinc-50' },
    { name: "SIHAM", role: "HEAD OF OPERATIONS", component: <FemaleVector />, bgColor: 'bg-[#FCF1EC]' },
    { name: "CHERENET", role: "TECHNICAL DIRECTOR", component: <MaleVector />, bgColor: 'bg-[#EDF2F7]' },
    { name: "HAWI", role: "CHIEF EXECUTIVE", component: <FemaleVector />, bgColor: 'bg-[#F0EDFC]' }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-black selection:bg-purple-100">
      
      {/* HERO SECTION - WHITE TEXT THEME */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2070" 
            alt="Retail" 
            className="w-full h-full object-cover object-center"
          />
        </div>
        <button 
          onClick={() => navigate(-1)} 
          className="absolute top-8 left-8 z-30 flex items-center text-[10px] font-black uppercase tracking-[0.3em] text-black bg-white p-3 rounded-full border border-zinc-200 shadow-xl hover:bg-black hover:text-white transition-all"
        >
          <ArrowLeft size={16} className="mr-2" /> BACK
        </button>
        <div className="relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none drop-shadow-lg text-white">
            EFOY <span className="text-purple-400 ml-2">GEBYA</span>
          </h1>
        </div>
      </section>

      {/* MISSION SECTION */}
      <section className="max-w-7xl mx-auto py-24 px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="relative group">
            <div className="absolute -inset-4 bg-purple-50 rounded-[40px] -z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1491336477066-31156b5e4f35?auto=format&fit=crop&q=80&w=2070" 
              alt="Quality" 
              className="rounded-[40px] shadow-2xl object-cover h-[450px] w-full"
            />
            <div className="absolute -bottom-8 -right-8 bg-white p-10 rounded-[30px] border-[6px] border-zinc-50 shadow-2xl">
              <p className="text-black font-black text-5xl tracking-tighter italic">100%</p>
              <p className="text-purple-500 text-[8px] font-black uppercase tracking-widest">AUTHENTIC</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <span className="text-purple-600 text-[10px] font-black uppercase tracking-[0.4em] px-4 py-1.5 bg-purple-50 rounded-full w-fit block border border-purple-100">
              OUR VISION
            </span>
            <h2 className="text-5xl font-black tracking-tighter leading-tight uppercase italic text-black">
              ELEGANCE <br /> <span className="text-zinc-200">ACCESSIBILITY.</span>
            </h2>
            <div className="space-y-6 max-w-lg border-l-2 border-purple-100 pl-6">
              <p className="text-zinc-500 text-lg leading-relaxed font-medium italic">
                "Efoy Gebya was founded on the principle that high-end shopping should be more than a transaction."
              </p>
              <p className="text-zinc-400 text-[10px] leading-relaxed font-bold tracking-widest uppercase">
                BY BLENDING TECHNOLOGY WITH A PREMIUM INTERFACE, WE PROVIDE A PLATFORM THAT IS AS BEAUTIFUL AS IT IS FUNCTIONAL.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CORE VALUES SECTION */}
      <section className="bg-zinc-50 py-24 border-y border-zinc-100">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h3 className="text-[10px] font-black uppercase tracking-[0.6em] text-zinc-300 mb-4">PHILOSOPHY</h3>
            <h2 className="text-5xl font-black uppercase italic tracking-tighter text-black leading-none">CORE VALUES</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Precision", icon: <Zap size={20} />, desc: "Engineered for a premium feel and zero-latency browsing." },
              { title: "Curation", icon: <Check size={20} />, desc: "We only list products that define excellence." },
              { title: "Trust", icon: <ShieldCheck size={20} />, desc: "Security-grade encryption protecting every transaction." }
            ].map((item, index) => (
              <div key={index} className="bg-white p-10 rounded-[30px] border border-zinc-200 group shadow-sm hover:border-purple-200 transition-colors">
                <div className="mb-6 bg-purple-50 text-purple-600 w-12 h-12 flex items-center justify-center rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-all">
                  {item.icon}
                </div>
                <h4 className="font-black text-lg tracking-tighter italic uppercase mb-3">{item.title}</h4>
                <p className="text-zinc-400 text-[9px] font-bold uppercase tracking-widest">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LEADERSHIP SECTION */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-24">
            <h3 className="text-[10px] font-black uppercase tracking-[0.6em] text-zinc-300 mb-4">EXECUTIVE BOARD</h3>
            <h2 className="text-6xl font-black uppercase italic tracking-tighter text-black leading-none">THE LEADERSHIP</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {teamMembers.map((member, idx) => (
              <div key={idx} className="group">
                <div className={`aspect-[4/5] rounded-[40px] overflow-hidden mb-8 border border-zinc-100 ${member.bgColor} flex items-center justify-center relative transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 p-10`}>
                  <div className="w-full h-full opacity-90 group-hover:opacity-100 transition-opacity">
                    {member.component}
                  </div>
                </div>
                <h4 className="font-black text-2xl uppercase italic tracking-tighter text-black leading-none">{member.name}</h4>
                <p className="text-purple-600 text-[10px] font-black uppercase tracking-[0.5em] mt-3">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER HUB */}
      <section className="h-[300px] relative mt-10 bg-zinc-950 flex items-center justify-center">
        <div className="text-center p-12 border border-white/10 bg-white/5 rounded-[40px] backdrop-blur-md">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Globe size={14} className="text-purple-500" />
            <p className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.5em]">OPERATIONS HUB</p>
          </div>
          <h2 className="text-white text-4xl md:text-5xl font-black uppercase italic tracking-tighter leading-none">
            ADAMA, <span className="text-purple-600">ETHIOPIA</span>
          </h2>
        </div>
      </section>

      <footer className="w-full px-12 py-8 flex justify-between items-center bg-white border-t border-zinc-100">
        <span className="text-[9px] font-black tracking-[0.3em] uppercase text-black">EFOY GEBYA</span>
        <span className="text-[9px] font-black tracking-[0.3em] text-zinc-300 uppercase">2026 EDITION</span>
      </footer>
    </div>
  );
};

export default About;