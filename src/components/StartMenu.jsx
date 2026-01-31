import React from 'react';
import { Power, User, Users } from 'lucide-react';

const StartMenu = ({ teamStatus, onClose }) => {
    return (
        <div className="absolute bottom-12 left-0 w-72 bg-[#10253e]/95 backdrop-blur-md border border-white/20 rounded-tr-lg shadow-2xl flex flex-col overflow-hidden animate-slideUp origin-bottom-left z-[100] text-white font-sans">
            
            {/* Header User */}
            <div className="p-4 bg-gradient-to-r from-[#1f5083] to-[#0f2641] flex items-center gap-3 border-b border-white/10">
                <div className="w-10 h-10 rounded-full bg-white border-2 border-white/50 overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`} alt="avatar" />
                </div>
                <div>
                    <div className="font-bold text-sm">Agency 404</div>
                    <div className="text-[10px] text-blue-200">Système Connecté</div>
                </div>
            </div>

            {/* Listes des Joueurs */}
            <div className="flex-1 p-2 space-y-1">
                <div className="text-[10px] uppercase font-bold text-gray-400 px-2 py-1">Équipe Active</div>
                
                <PlayerItem role="Stratège" data={teamStatus.strat} />
                <PlayerItem role="Développeur" data={teamStatus.dev} />
                <PlayerItem role="Créatif" data={teamStatus.crea} />
            </div>

            {/* Footer Actions */}
            <div className="p-2 border-t border-white/10 bg-[#0a1624]/50 flex justify-end">
                <button 
                    onClick={() => window.location.reload()}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-red-600/80 rounded transition-colors text-xs font-bold"
                >
                    <Power size={14} /> Arrêter le système
                </button>
            </div>
        </div>
    );
};

const PlayerItem = ({ role, data }) => (
    <div className="flex items-center gap-3 p-2 rounded hover:bg-white/10 transition-colors">
        <div className={`w-8 h-8 rounded flex items-center justify-center ${data.isHuman ? 'bg-blue-600' : 'bg-gray-600'}`}>
            {data.isHuman ? <User size={16}/> : <Users size={16}/>}
        </div>
        <div className="flex-1">
            <div className="text-xs font-bold">{role}</div>
            <div className={`text-[10px] ${data.isHuman ? 'text-white' : 'text-gray-500 italic'}`}>
                {data.name}
            </div>
        </div>
        <div className={`w-2 h-2 rounded-full ${data.isHuman ? 'bg-green-500 shadow-[0_0_5px_lime]' : 'bg-gray-500'}`}></div>
    </div>
);

export default StartMenu;