import React, { useState } from 'react';
import WindowFrame from './WindowFrame';
import StartMenu from './StartMenu';
import { useGame } from '../GameContext';
import { Battery, Wifi, Volume2 } from 'lucide-react';

const Desktop = ({ apps }) => {
  const { timeLeft, teamStatus } = useGame();
  const [menuOpen, setMenuOpen] = useState(false);
  
  const [openWindows, setOpenWindows] = useState(() => {
      const defaults = [];
      if (apps.length > 0) defaults.push(apps[0].id);
      if (apps.length > 1) defaults.push(apps[1].id);
      return defaults;
  }); 
  
  const toggleApp = (appId) => {
    if (openWindows.includes(appId)) {
      setOpenWindows(openWindows.filter(id => id !== appId));
    } else {
      if (openWindows.length >= 2) {
        setOpenWindows([openWindows[1], appId]);
      } else {
        setOpenWindows([...openWindows, appId]);
      }
    }
  };

  const isAppOpen = (id) => openWindows.includes(id);

  return (
    // --- CORRECTION ICI : h-full au lieu de h-screen ---
    // Cela permet au bureau de s'adapter à l'espace disponible (sous les onglets en solo, ou tout l'écran en multi)
    <div 
      className="h-full w-full overflow-hidden flex flex-col font-sans relative"
      style={{ 
        backgroundImage: 'url("https://4kwallpapers.com/images/wallpapers/windows-7-5120x2880-14368.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      
      {/* START MENU */}
      {menuOpen && <StartMenu teamStatus={teamStatus} onClose={() => setMenuOpen(false)} />}

      {/* DESKTOP AREA */}
      <div className="flex-1 p-4 flex gap-4 overflow-hidden relative" onClick={() => setMenuOpen(false)}>
        
        {/* ICÔNES */}
        <div className="absolute top-4 left-4 flex flex-col gap-6 z-0">
          {apps.map(app => (
            <button 
                key={app.id} 
                onDoubleClick={() => !isAppOpen(app.id) && toggleApp(app.id)}
                className="flex flex-col items-center gap-1 group w-20 cursor-pointer"
            >
                <div className="w-12 h-12 bg-white/10 rounded-lg border border-white/20 shadow-lg flex items-center justify-center group-hover:bg-white/30 transition-all backdrop-blur-sm">
                    {app.icon && <app.icon size={32} className="text-white drop-shadow-lg" />}
                </div>
                <span className="text-white text-xs font-bold text-shadow px-1 bg-black/0 group-hover:bg-[#1f5083]/80 rounded text-center leading-tight">
                    {app.title}
                </span>
            </button>
          ))}
        </div>

        {/* FENÊTRES */}
        <div className="relative z-10 flex gap-4 w-full h-full pointer-events-none">
            {openWindows.map((appId) => {
              const app = apps.find(a => a.id === appId);
              if (!app) return null;
              
              return (
                <div key={app.id} className={`h-full pointer-events-auto transition-all duration-300 ${openWindows.length === 1 ? 'w-full' : 'w-1/2'}`}>
                  <WindowFrame 
                    title={app.title} 
                    icon={app.icon} 
                    onClose={() => toggleApp(app.id)}
                    onMinimize={() => toggleApp(app.id)}
                    isActive={true}
                  >
                    <app.component />
                  </WindowFrame>
                </div>
              );
            })}
        </div>
      </div>

      {/* BARRE DES TÂCHES */}
      <div className="h-10 bg-[#10253e]/90 backdrop-blur-md border-t border-white/20 flex items-center justify-between px-2 relative z-[101] shadow-[0_-5px_10px_rgba(0,0,0,0.5)] shrink-0">
        <div className="flex items-center gap-2">
            
            {/* BOUTON DÉMARRER */}
            <div 
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1f5083] to-[#0f2641] border border-[#3e7cb4] shadow-[0_0_10px_rgba(31,80,131,0.6)] flex items-center justify-center hover:brightness-125 cursor-pointer transition-all active:scale-95"
            >
                <div className="grid grid-cols-2 gap-0.5">
                    <div className="w-1.5 h-1.5 bg-[#f25022]"></div>
                    <div className="w-1.5 h-1.5 bg-[#7fba00]"></div>
                    <div className="w-1.5 h-1.5 bg-[#00a4ef]"></div>
                    <div className="w-1.5 h-1.5 bg-[#ffb900]"></div>
                </div>
            </div>

            <div className="h-6 w-[1px] bg-white/10 mx-2"></div>
            
            {/* APPS OUVERTES */}
            {apps.map(app => (
                <button
                    key={app.id}
                    onClick={() => toggleApp(app.id)}
                    className={`
                        h-8 px-3 flex items-center gap-2 rounded border border-transparent transition-all
                        ${isAppOpen(app.id) 
                            ? 'bg-white/20 border-white/30 shadow-[inset_0_0_10px_rgba(255,255,255,0.2)]' 
                            : 'hover:bg-white/10 hover:border-white/10'}
                    `}
                >
                    {app.icon && <app.icon size={20} className="drop-shadow-md text-white" />}
                    <span className="text-white text-xs font-bold hidden md:block">{app.title}</span>
                </button>
            ))}
        </div>

        <div className="flex items-center gap-3 px-3 py-1 bg-[#0a1624]/50 rounded border border-white/5 mx-2">
            <Wifi size={14} className="text-white" />
            <Volume2 size={14} className="text-white" />
            <Battery size={14} className="text-white" />
            <div className="flex flex-col items-center leading-none text-white text-[10px]">
                <span>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Desktop;