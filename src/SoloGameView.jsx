import React, { useState, useEffect } from 'react';
import StratView from './StratView';
import DevView from './DevView';
import CreaView from './CreaView';
import { BrainCircuit, Code, PenTool, BookOpen } from 'lucide-react';
import { useGame } from './GameContext';
import GameRules from './components/GameRules';

const SoloGameView = () => {
    const [activeTab, setActiveTab] = useState('strat'); 
    const [showRules, setShowRules] = useState(false);
    const { teamStatus, serverHeat, activeCrisis } = useGame();

    // Raccourcis clavier CORRIGÉS pour AZERTY (touches du haut sans Shift)
    useEffect(() => {
        const handleKeys = (e) => {
            // On ignore les raccourcis si l'utilisateur écrit dans un champ texte
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            if (e.key === '&') setActiveTab('strat'); // Touche 1
            if (e.key === 'é') setActiveTab('dev');   // Touche 2
            if (e.key === '"') setActiveTab('crea');  // Touche 3
        };
        window.addEventListener('keydown', handleKeys);
        return () => window.removeEventListener('keydown', handleKeys);
    }, []);

    return (
        <div className="h-screen w-screen flex flex-col bg-black overflow-hidden relative">
            
            {/* Modal des Règles (accessible via le bouton en haut à droite) */}
            {showRules && <GameRules onClose={() => setShowRules(false)} />}

            {/* SUPER NAVBAR */}
            <div className="h-12 bg-gray-900 border-b border-gray-700 flex items-center px-4 justify-between shrink-0 z-[9999]">
                <div className="flex items-center gap-1">
                    <span className="font-black text-white italic mr-4 hidden md:inline">
                        AGENCY 404 <span className="text-blue-500 not-italic font-normal text-xs">SOLO</span>
                    </span>
                    
                    {/* Onglets avec simple quotes pour éviter le bug de syntaxe */}
                    <TabButton 
                        id="strat" 
                        active={activeTab} 
                        onClick={setActiveTab} 
                        icon={BrainCircuit} 
                        label='1. STRAT (&)' 
                        alert={activeCrisis} 
                    />
                    <TabButton 
                        id="dev" 
                        active={activeTab} 
                        onClick={setActiveTab} 
                        icon={Code} 
                        label='2. DEV (é)' 
                        alert={serverHeat > 80 || teamStatus.dev.blocked} 
                    />
                    <TabButton 
                        id="crea" 
                        active={activeTab} 
                        onClick={setActiveTab} 
                        icon={PenTool} 
                        label='3. CRÉA (")' 
                        alert={teamStatus.crea.blocked} 
                    />
                </div>
                
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setShowRules(true)} 
                        className="flex items-center gap-2 text-gray-500 hover:text-white text-xs font-bold border border-gray-700 px-2 py-1 rounded hover:bg-gray-800 transition-colors"
                    >
                        <BookOpen size={14}/> RÈGLES
                    </button>

                    <span className={serverHeat > 80 ? "text-red-500 animate-pulse font-bold text-xs font-mono" : "text-green-500 text-xs font-mono"}>
                        TEMP: {Math.round(serverHeat)}°C
                    </span>
                </div>
            </div>

            {/* VIEWPORT : Les 3 vues sont montées mais masquées via CSS pour conserver leur état */}
            <div className="flex-1 relative">
                <div className={`absolute inset-0 ${activeTab === 'strat' ? 'z-10' : 'z-0 invisible'}`}>
                    <StratView />
                </div>
                <div className={`absolute inset-0 ${activeTab === 'dev' ? 'z-10' : 'z-0 invisible'}`}>
                    <DevView />
                </div>
                <div className={`absolute inset-0 ${activeTab === 'crea' ? 'z-10' : 'z-0 invisible'}`}>
                    <CreaView />
                </div>
            </div>
        </div>
    );
};

const TabButton = ({ id, active, onClick, icon: Icon, label, alert }) => (
    <button 
        onClick={() => onClick(id)}
        className={`
            h-8 px-4 rounded-t-lg flex items-center gap-2 text-xs font-bold transition-all border-t border-l border-r relative
            ${active === id 
                ? 'bg-[#10253e] border-gray-600 text-white translate-y-1 z-10' 
                : 'bg-gray-800 border-gray-800 text-gray-500 hover:bg-gray-700 hover:text-gray-300'}
        `}
    >
        <Icon size={14} />
        <span className="hidden md:inline">{label}</span>
        
        {/* Indicateurs d'alerte visuelle (Ping rouge sur l'onglet) */}
        {alert && (
            <>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-black"></span>
            </>
        )}
    </button>
);

export default SoloGameView;