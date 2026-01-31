import React, { useState } from 'react';
import { useGame } from './GameContext';
import GameRules from './components/GameRules';
import { Users, User, Rocket, Copy, Check, Code, PenTool, BrainCircuit, BookOpen, Trophy, Play } from 'lucide-react';

// ... (Garder le composant LeaderboardPanel tel quel, il était bon) ...
const LeaderboardPanel = ({ data, title }) => (
    <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-2xl p-6 flex flex-col h-full animate-slideInRight shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/20 transition-all"></div>
        <h3 className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Trophy size={16} className="text-yellow-500"/> {title}
        </h3>
        <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1 pr-2">
            {data.length === 0 ? <div className="text-xs text-gray-600 text-center py-10 italic">Aucune donnée classifiée.</div> : 
                data.slice(0, 5).map((entry, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all group/item">
                        <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 flex items-center justify-center rounded text-xs font-bold ${i===0 ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-gray-300'}`}>{i+1}</div>
                            <div className="flex flex-col"><span className="text-gray-200 font-bold text-xs">{entry.name}</span><span className="text-[9px] text-gray-500 uppercase">{entry.grade}-Tier</span></div>
                        </div>
                        <span className="font-mono text-blue-300 font-bold text-xs">{entry.score}</span>
                    </div>
                ))
            }
        </div>
    </div>
);

const Lobby = () => {
    const { createRoom, joinRoomRequest, pickRole, toggleReady, lobbyData, roomId, myRole, leaderboards } = useGame();
    const [mode, setMode] = useState('solo'); 
    const [name, setName] = useState('');
    const [agencyName, setAgencyName] = useState('');
    const [joinCode, setJoinCode] = useState('');
    const [copied, setCopied] = useState(false);
    const [showRules, setShowRules] = useState(false);

    // --- LOGIQUE ATTENTE (ROOM) - Identique à avant ---
    if (roomId && lobbyData) {
        // ... (Garder tout le bloc if (roomId && lobbyData) identique à la version précédente) ...
        // Je remets le code pour être sûr, mais c'est surtout la partie d'après qui change.
        const copyCode = () => { navigator.clipboard.writeText(roomId); setCopied(true); setTimeout(() => setCopied(false), 2000); };
        const roles = [{ id: 'strat', label: 'Stratège', icon: BrainCircuit, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/50' }, { id: 'dev', label: 'Développeur', icon: Code, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/50' }, { id: 'crea', label: 'Créatif', icon: PenTool, color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/50' }];
        const readyCount = Object.values(lobbyData.team).filter(t => t.isHuman && t.isReady).length;
        const imReady = myRole && lobbyData.team[myRole]?.isReady;

        return (
            <div className="h-screen w-screen bg-[#0a0a0a] text-white flex items-center justify-center font-sans p-4 relative overflow-hidden">
                {showRules && <GameRules onClose={() => setShowRules(false)} />}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-50"></div>
                <div className="max-w-4xl w-full z-10 flex flex-col items-center animate-fadeIn">
                    <div className="w-full flex justify-between items-center mb-8">
                        <h2 className="text-4xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">AGENCY 404</h2>
                        <button onClick={() => setShowRules(true)} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white border border-gray-700 px-3 py-1 rounded-full"><BookOpen size={16}/> Manuel</button>
                    </div>
                    <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-8 text-center shadow-2xl w-full max-w-md relative">
                        <p className="text-xs text-gray-500 uppercase font-bold mb-2">Code d'accès</p>
                        <div onClick={copyCode} className="flex items-center justify-center gap-4 bg-black/60 p-4 rounded-xl border border-gray-600 hover:border-white transition-all cursor-pointer"><span className="text-5xl font-mono font-black tracking-[0.15em] text-white">{roomId}</span>{copied ? <Check className="text-green-500" /> : <Copy className="text-gray-600" />}</div>
                        <p className="text-xs text-gray-500 mt-2 flex justify-between px-4"><span>Connectés: {lobbyData.players.length}</span><span>Prêts: <span className={readyCount===3?"text-green-400":"text-white"}>{readyCount}/3</span></span></p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 w-full mb-8">{roles.map(role => { const data = lobbyData.team[role.id]; const isTaken = data.isHuman; const takenByMe = myRole === role.id; return (<button key={role.id} onClick={() => !isTaken && pickRole(role.id)} disabled={isTaken} className={`relative p-4 rounded-2xl border flex flex-col items-center justify-center gap-3 transition-all duration-300 group ${takenByMe ? 'bg-gradient-to-b from-gray-800 to-black ring-2 ring-white scale-105 z-10 '+role.bg.replace('bg-', 'border-') : isTaken ? 'bg-gray-950 border-gray-900 opacity-60 grayscale cursor-not-allowed' : 'bg-gray-900/50 border-gray-800 hover:bg-gray-800 hover:border-gray-600 cursor-pointer'}`}><div className={`p-3 rounded-full bg-black/50 ${isTaken ? 'text-gray-600' : role.color}`}><role.icon size={32} /></div><div className="text-center"><div className="font-bold text-sm uppercase text-white">{role.label}</div><div className="text-[10px] font-mono mt-1 text-gray-500">{isTaken ? data.name : "LIBRE"}</div></div>{isTaken && data.isReady && <div className="absolute top-3 right-3 w-3 h-3 bg-green-500 rounded-full shadow-[0_0_10px_lime] animate-pulse"></div>}{takenByMe && !data.isReady && <div className="absolute top-3 right-3 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>}</button>); })}</div>
                    {myRole && <button onClick={toggleReady} className={`w-full py-5 rounded-2xl font-black text-lg shadow-xl transition-all duration-300 transform uppercase tracking-widest flex items-center justify-center gap-3 ${imReady ? 'bg-gray-800 text-green-500 border border-green-500/50' : 'bg-white text-black hover:bg-gray-200'}`}>{imReady ? <><Check/> En attente...</> : "JE SUIS PRÊT"}</button>}
                </div>
            </div>
        );
    }

    // --- ACCUEIL (CORRECTION ICI) ---
    const handleSoloStart = () => { if (!name) return alert("Pseudo requis"); createRoom('solo', "Solo Squad", name); };
    const handleCreateAgency = () => { if (!name || !agencyName) return alert("Tout remplir !"); createRoom('agency', agencyName, name); };
    const handleJoinAgency = () => { if (!name || !joinCode) return alert("Tout remplir !"); joinRoomRequest(joinCode.toUpperCase().trim(), name); };

    return (
        <div className="h-screen w-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center font-sans p-8 relative overflow-hidden">
            {showRules && <GameRules onClose={() => setShowRules(false)} />}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/80 pointer-events-none"></div>
            
            <div className="absolute top-8 right-8 z-50">
                <button onClick={() => setShowRules(true)} className="group bg-black/50 hover:bg-white text-gray-400 hover:text-black border border-gray-700 hover:border-white px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center gap-2">
                    <BookOpen size={16} className="group-hover:scale-110 transition-transform"/> Règles du jeu
                </button>
            </div>

            <div className="z-10 w-full max-w-7xl grid grid-cols-12 gap-8 h-[75vh]">
                
                {/* --- INTERFACE DE JEU --- */}
                <div className="col-span-8 bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 shadow-2xl flex flex-col relative overflow-hidden">
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>

                    <div className="mb-8">
                        <h1 className="text-6xl font-black italic tracking-tighter text-white mb-2">AGENCY <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">404</span></h1>
                        <p className="text-gray-400 font-mono text-sm uppercase tracking-widest flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Le simulateur de chaos en agence web</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <button onClick={() => setMode('solo')} className={`p-6 rounded-2xl border transition-all duration-300 text-left group relative overflow-hidden ${mode === 'solo' ? 'bg-gradient-to-br from-blue-900/80 to-black border-blue-500 ring-1 ring-blue-400/50' : 'bg-black/40 border-gray-800 hover:bg-gray-800'}`}>
                            <div className="absolute right-4 top-4 text-blue-500/20 group-hover:text-blue-500/40 transition-colors"><Rocket size={64}/></div>
                            <h3 className={`text-xl font-black uppercase mb-1 ${mode === 'solo' ? 'text-white' : 'text-gray-400'}`}>Solo Hardcore</h3>
                            <p className="text-xs text-gray-500 font-mono">1 Joueur • 3 Rôles</p>
                        </button>
                        <button onClick={() => setMode('agency')} className={`p-6 rounded-2xl border transition-all duration-300 text-left group relative overflow-hidden ${mode === 'agency' ? 'bg-gradient-to-br from-purple-900/80 to-black border-purple-500 ring-1 ring-purple-400/50' : 'bg-black/40 border-gray-800 hover:bg-gray-800'}`}>
                            <div className="absolute right-4 top-4 text-purple-500/20 group-hover:text-purple-500/40 transition-colors"><Users size={64}/></div>
                            <h3 className={`text-xl font-black uppercase mb-1 ${mode === 'agency' ? 'text-white' : 'text-gray-400'}`}>Agence Coop</h3>
                            <p className="text-xs text-gray-500 font-mono">3 Joueurs • Rôles Fixes</p>
                        </button>
                    </div>

                    <div className="flex-1 bg-black/40 rounded-2xl p-6 border border-gray-800/50 flex flex-col justify-center">
                        {mode === 'solo' ? (
                            <div className="animate-fadeIn space-y-4 max-w-sm mx-auto w-full">
                                <div><label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Identifiant Agent</label><input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none transition-colors" placeholder="Ex: Neo" /></div>
                                <button onClick={handleSoloStart} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-blue-500/20 transition-all flex items-center justify-center gap-2"><Rocket size={18} /> LANCER LA SIMULATION</button>
                            </div>
                        ) : (
                            // NOUVELLE MISE EN PAGE DU FORMULAIRE MULTI
                            <div className="animate-fadeIn flex gap-8 h-full items-center">
                                {/* PARTIE GAUCHE : CRÉER */}
                                <div className="flex-1 space-y-4">
                                    <h4 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Rocket size={14}/> Créer un Lobby</h4>
                                    <div className="space-y-3">
                                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm text-white focus:border-purple-500 outline-none placeholder-gray-600" placeholder="Votre Pseudo" />
                                        <input type="text" value={agencyName} onChange={e => setAgencyName(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm text-white focus:border-purple-500 outline-none placeholder-gray-600" placeholder="Nom de l'Agence" />
                                        <button onClick={handleCreateAgency} className="w-full bg-purple-600 hover:bg-purple-500 py-3 rounded-lg text-sm font-bold text-white transition-colors shadow-lg hover:shadow-purple-500/20">Initialiser</button>
                                    </div>
                                </div>

                                {/* SÉPARATEUR */}
                                <div className="w-px h-32 bg-gray-800"></div>

                                {/* PARTIE DROITE : REJOINDRE */}
                                <div className="flex-1 space-y-4">
                                    <h4 className="text-xs font-bold text-green-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Users size={14}/> Rejoindre</h4>
                                    <div className="space-y-3">
                                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm text-white focus:border-green-500 outline-none placeholder-gray-600" placeholder="Votre Pseudo" />
                                        <div className="flex gap-2">
                                            <input type="text" value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm font-mono tracking-widest text-white focus:border-green-500 outline-none uppercase placeholder-gray-600" placeholder="CODE" />
                                            <button onClick={handleJoinAgency} className="bg-green-600 hover:bg-green-500 px-6 rounded-lg text-sm font-bold text-white transition-colors shadow-lg hover:shadow-green-500/20"><Play size={18}/></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* --- LEADERBOARD & CREDITS --- */}
                <div className="col-span-4 flex flex-col gap-6">
                    <div className="flex-1">
                        <LeaderboardPanel data={mode === 'solo' ? leaderboards.solo : leaderboards.agency} title={mode === 'solo' ? "Meilleurs Agents" : "Top Agences"} />
                    </div>
                    <div className="text-center opacity-50 hover:opacity-100 transition-opacity">
                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-[0.2em]">Développé par</p>
                        <p className="text-xs text-white font-mono mt-1">ANNET Romain © 2026</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Lobby;