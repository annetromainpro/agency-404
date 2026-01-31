import React from 'react';
import { useGame } from './GameContext';
import { Trophy, Clock, DollarSign, Award, Rocket, Users, RotateCcw } from 'lucide-react';

const ResultsView = () => {
    const { finalScore, leaderboards, gameMode, agencyName } = useGame();

    // Sécurité si les résultats ne sont pas encore arrivés
    if (!finalScore) {
        return (
            <div className="h-screen w-screen bg-black text-white flex items-center justify-center font-mono animate-pulse">
                CALCUL DES PERFORMANCES...
            </div>
        );
    }

    // Sélection du bon classement selon le mode de jeu
    const currentBoard = gameMode === 'solo' ? (leaderboards?.solo || []) : (leaderboards?.agency || []);
    
    // Titre du mode
    const modeTitle = gameMode === 'solo' ? "CLASSEMENT SOLO (MMI)" : "CLASSEMENT AGENCES";
    const ModeIcon = gameMode === 'solo' ? Rocket : Users;

    return (
        <div className="h-screen w-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-8 font-sans overflow-hidden relative select-none">
            
            {/* Background Grid & Effects */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black pointer-events-none"></div>

            <div className="z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                
                {/* --- PARTIE GAUCHE : SCORE ACTUEL --- */}
                <div className="flex flex-col items-center text-center animate-slideInLeft">
                    <h1 className="text-6xl font-black italic tracking-tighter mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 drop-shadow-lg">
                        MISSION COMPLETE
                    </h1>
                    <div className="text-[10rem] leading-none font-black text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.4)] mb-6 flex items-center gap-4">
                        {finalScore.grade}
                        <span className="text-2xl font-bold text-gray-500 uppercase tracking-widest mt-12 bg-gray-900 px-3 py-1 rounded border border-gray-700">Rang</span>
                    </div>
                    
                    <div className="bg-gray-900/80 backdrop-blur border border-gray-700 rounded-2xl p-8 w-full shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                        
                        <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-800">
                            <span className="text-gray-400 flex items-center gap-3 font-bold uppercase text-sm"><DollarSign size={20} className="text-green-400"/> Budget Restant</span>
                            <span className="text-2xl font-mono font-bold text-green-400">+ {finalScore.points - (finalScore.points % 50)} pts</span>
                        </div>
                        <div className="flex justify-between items-center mb-8">
                            <span className="text-gray-400 flex items-center gap-3 font-bold uppercase text-sm"><Clock size={20} className="text-blue-400"/> Temps Bonus</span>
                            <span className="text-2xl font-mono font-bold text-blue-400">+ {finalScore.points % 50} pts</span>
                        </div>
                        
                        <div className="bg-white text-black py-4 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.2)] transform group-hover:scale-105 transition-transform duration-300">
                            <div className="text-xs font-bold uppercase text-gray-500 mb-1">Score Final</div>
                            <div className="text-5xl font-black tracking-tighter">{finalScore.points}</div>
                        </div>
                    </div>
                </div>

                {/* --- PARTIE DROITE : LEADERBOARD DYNAMIQUE --- */}
                <div className="bg-gray-900/90 backdrop-blur-md border border-gray-700 rounded-2xl p-8 h-[600px] flex flex-col shadow-2xl animate-slideInRight relative">
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-800">
                        <h2 className="text-2xl font-black flex items-center gap-3 uppercase tracking-widest text-white">
                            <Trophy className="text-yellow-500" /> {modeTitle}
                        </h2>
                        <div className="bg-gray-800 p-2 rounded-lg text-gray-400">
                            <ModeIcon size={24} />
                        </div>
                    </div>
                    
                    <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        {currentBoard.length === 0 ? (
                            <div className="text-center text-gray-500 py-10">Aucun score enregistré.</div>
                        ) : (
                            currentBoard.map((entry, index) => (
                                <div 
                                    key={index} 
                                    className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 
                                    ${entry.isCurrent 
                                        ? 'bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-400 scale-105 shadow-[0_0_15px_rgba(59,130,246,0.3)] z-10' 
                                        : 'bg-black/40 border-gray-800 hover:bg-gray-800'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-8 h-8 flex items-center justify-center rounded-full font-black text-sm 
                                            ${index === 0 ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/50' : 
                                              index === 1 ? 'bg-gray-400 text-black' : 
                                              index === 2 ? 'bg-orange-700 text-white' : 'bg-gray-800 text-gray-500'}`}>
                                            {index + 1}
                                        </div>
                                        <div>
                                            <div className={`font-bold text-lg ${entry.isCurrent ? 'text-white' : 'text-gray-300'}`}>
                                                {entry.name} {entry.isCurrent && <span className="text-[10px] bg-blue-600 px-1.5 rounded ml-2 align-middle">VOUS</span>}
                                            </div>
                                            <div className="text-xs text-gray-500 font-mono uppercase">{entry.grade}-Tier Performance</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`font-mono font-bold text-xl ${entry.isCurrent ? 'text-blue-300' : 'text-gray-400'}`}>{entry.score}</div>
                                        <div className="text-[10px] text-gray-600">PTS</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <button 
                        onClick={() => window.location.reload()} 
                        className="mt-6 w-full bg-white hover:bg-gray-200 text-black font-black py-4 rounded-xl transition-all uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg hover:shadow-white/20 active:scale-95"
                    >
                        <RotateCcw size={20} /> Nouvelle Mission
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResultsView;