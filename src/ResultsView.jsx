import React from 'react';
import { useGame } from './GameContext';
import { Trophy, RotateCcw, Award } from 'lucide-react';

const ResultsView = () => {
    // On récupère "teamStatus" pour avoir accès au savedName ou au pseudo local
    const { finalScore, leaderboards, gameMode, teamStatus, agencyName } = useGame();
    
    const handleRetry = () => {
        window.location.reload(); 
    };

    const currentLeaderboard = gameMode === 'solo' ? leaderboards.solo : leaderboards.agency;

    return (
        <div className="h-screen w-screen bg-[#050505] text-white flex items-center justify-center font-sans overflow-hidden relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1a1a2e_0%,#000000_100%)]"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            
            <div className="z-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-12 p-8">
                
                {/* COLONNE GAUCHE : SCORE */}
                <div className="flex flex-col items-center justify-center animate-slideInLeft">
                    <h1 className="text-6xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-2 filter drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                        MISSION COMPLETE
                    </h1>
                    
                    <div className="relative mb-8">
                        <div className="text-[12rem] font-black leading-none text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]">
                            {finalScore?.grade || "?"}
                        </div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl -z-10 animate-pulse"></div>
                    </div>

                    <div className="bg-gray-900/80 backdrop-blur border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-4">
                            <span className="text-gray-400 font-bold uppercase text-xs tracking-widest">Score Final</span>
                            <span className="text-4xl font-mono font-black text-white">{finalScore?.points || 0}</span>
                        </div>
                        <div className="space-y-2 text-sm text-center text-gray-400">
                             Félicitations <span className="text-white font-bold">{gameMode === 'solo' ? teamStatus?.strat?.name : agencyName}</span> !
                        </div>
                    </div>

                    <div className="mt-8 flex gap-4">
                        <button onClick={handleRetry} className="bg-white text-black px-8 py-4 rounded-full font-black uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-2">
                            <RotateCcw size={20}/> Nouvelle Mission
                        </button>
                    </div>
                </div>

                {/* COLONNE DROITE : LEADERBOARD */}
                <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 flex flex-col h-[600px] animate-slideInRight shadow-2xl">
                    <div className="flex items-center gap-3 mb-6 border-b border-gray-700 pb-4">
                        <Trophy className="text-yellow-500" size={32} />
                        <div>
                            <h2 className="text-2xl font-black italic uppercase text-white">Classement {gameMode === 'solo' ? 'SOLO' : 'AGENCE'}</h2>
                            <p className="text-xs text-gray-400 font-mono">TOP 50 GLOBAL</p>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2">
                        {(!currentLeaderboard || currentLeaderboard.length === 0) ? (
                            <div className="text-center text-gray-500 py-20 flex flex-col items-center">
                                <Award size={48} className="mb-4 opacity-20"/>
                                <p>Aucun score enregistré.</p>
                            </div>
                        ) : (
                            currentLeaderboard.map((entry, index) => {
                                // LOGIQUE DE SURBRILLANCE CORRIGÉE :
                                // On vérifie si c'est le score qu'on vient de faire (Même score exact ET (Nom pseudo OU Nom agence))
                                const isMe = entry.score === finalScore?.points && 
                                             (entry.name === teamStatus?.strat?.name || entry.name === agencyName);

                                return (
                                    <div 
                                        key={index} 
                                        className={`flex items-center justify-between p-4 rounded-xl border transition-all ${isMe ? 'bg-blue-600/20 border-blue-500 scale-[1.02] shadow-lg shadow-blue-900/20' : 'bg-black/40 border-gray-800 hover:bg-gray-800'}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-8 h-8 flex items-center justify-center rounded-lg font-black text-sm ${index === 0 ? 'bg-yellow-400 text-black' : index === 1 ? 'bg-gray-300 text-black' : index === 2 ? 'bg-orange-600 text-white' : 'bg-gray-800 text-gray-500'}`}>
                                                {index + 1}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className={`font-bold ${isMe ? 'text-blue-400' : 'text-white'}`}>{entry.name}</span>
                                                <span className="text-[10px] text-gray-500 uppercase">{new Date(entry.date).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-mono font-bold text-lg">{entry.score}</div>
                                            <div className={`text-[10px] font-bold px-2 rounded inline-block ${entry.grade === 'S' ? 'bg-purple-500 text-black' : 'bg-gray-700 text-gray-300'}`}>RANG {entry.grade}</div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ResultsView;