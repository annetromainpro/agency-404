import React, { useState, useEffect } from 'react';
import { useGame } from './GameContext';
import Desktop from './components/Desktop';
import MailApp from './MailApp';
import { BrainCircuit, Mail, Activity, Unlock, Coffee, BookOpen, Radio, ShieldCheck, PowerOff, Siren, User, Lock } from 'lucide-react';

// --- ECRAN NOIR LOCAL (Surchauffe) ---
// S'affiche par dessus Gantt quand le serveur est à 100°C
const BlackoutGantt = () => (
    <div className="absolute inset-0 bg-black z-[60] flex flex-col items-center justify-center text-red-700 font-mono">
        <PowerOff size={64} className="mb-4 animate-pulse"/>
        <h1 className="text-4xl font-black tracking-tighter mb-2">SYSTEM FAILURE</h1>
        <p className="text-sm text-red-500 border border-red-800 px-2">SERVER OVERHEATED (100°C)</p>
        <p className="mt-4 animate-bounce text-xs text-gray-500">WAITING FOR REPAIR...</p>
    </div>
);

// --- ECRAN DE VERROUILLAGE SÉCURITÉ (Crise) ---
// S'affiche par dessus Gantt pour forcer le joueur à aller sur Crisis Control
const SecurityLockout = () => (
    <div className="absolute inset-0 bg-gray-900/95 z-[50] flex flex-col items-center justify-center text-white font-mono p-4">
        <Lock size={64} className="mb-4 text-yellow-500 animate-pulse"/>
        <h2 className="text-3xl font-black text-yellow-500 mb-2 uppercase">Application Verrouillée</h2>
        <p className="text-center max-w-xs text-gray-300 mb-6">
            Une procédure d'urgence est en cours. L'accès aux projets est suspendu tant que la menace n'est pas neutralisée.
        </p>
        <div className="bg-red-600 text-white px-6 py-3 rounded animate-bounce font-bold flex items-center gap-2 shadow-lg border border-red-400">
            <ShieldCheck size={20}/>
            OUVREZ L'APP "CRISIS CTRL"
        </div>
    </div>
);

// --- APP FENÊTRÉE DE CRISE (Le cœur de la résolution) ---
const CrisisApp = () => {
    const { activeCrisis, solveCrisis } = useGame();
    const [code, setCode] = useState("");

    // Reset du champ si la crise change ou disparait
    useEffect(() => { setCode(""); }, [activeCrisis]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            solveCrisis(code);
            setCode("");
        }
    };

    // --- CORRECTION : FILTRE NUMÉRIQUE STRICT ---
    const handleInputChange = (e) => {
        const val = e.target.value;
        // N'autorise que les chiffres (0-9)
        if (/^\d*$/.test(val)) {
            setCode(val);
        }
    };

    // MODE NORMAL (Tout va bien)
    if (!activeCrisis) {
        return (
            <div className="h-full bg-gray-900 flex flex-col items-center justify-center text-green-500 font-mono select-none p-4">
                <ShieldCheck size={64} className="mb-4 text-green-500"/>
                <h2 className="text-xl font-bold">SYSTEM SECURE</h2>
                <div className="w-full max-w-xs bg-gray-800 h-px my-4"></div>
                <div className="grid grid-cols-2 gap-4 text-xs text-gray-400 w-full max-w-xs">
                    <div className="border border-gray-700 p-2 rounded flex flex-col items-center bg-gray-800/50">
                        <span className="font-bold text-white mb-1">FIREWALL</span>
                        <span className="text-green-400 text-[10px] uppercase">ACTIVE ●</span>
                    </div>
                    <div className="border border-gray-700 p-2 rounded flex flex-col items-center bg-gray-800/50">
                        <span className="font-bold text-white mb-1">LEGAL</span>
                        <span className="text-green-400 text-[10px] uppercase">CLEAN ●</span>
                    </div>
                </div>
            </div>
        );
    }

    // MODE CRISE (Rouge partout + Input)
    return (
        <div className="h-full bg-red-950 flex flex-col items-center justify-center text-white font-mono p-6 relative overflow-hidden">
            {/* Effet d'arrière plan */}
            <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(0,0,0,0.1)_10px,rgba(0,0,0,0.1)_20px)] pointer-events-none"></div>
            
            <Siren size={64} className="mb-4 text-red-500 animate-spin-slow z-10"/>
            <h2 className="text-3xl font-black mb-2 tracking-tighter text-red-500 z-10 animate-pulse">MENACE DÉTECTÉE</h2>
            
            <div className="bg-red-600 text-black font-bold px-4 py-1 rounded mb-6 w-full text-center text-xs z-10 uppercase shadow-lg border border-red-400">
                {activeCrisis === 'FIREWALL' ? "⚠️ INTRUSION SYSTÈME (HACK)" : "⚠️ VIOLATION COPYRIGHT (LEGAL)"}
            </div>
            
            <p className="text-gray-300 text-center mb-6 text-sm z-10 bg-black/30 p-2 rounded border border-red-500/30">
                {activeCrisis === 'FIREWALL' 
                    ? "Demandez le CODE D'URGENCE au Développeur !" 
                    : "Demandez le NUMÉRO DE DOSSIER au Créatif !"}
            </p>

            <div className="flex flex-col gap-2 w-full max-w-xs z-10">
                <label className="text-[10px] uppercase font-bold text-red-400">Code de Neutralisation</label>
                <input 
                    type="text" 
                    maxLength={4} 
                    value={code} 
                    onChange={handleInputChange} 
                    onKeyDown={handleKeyDown} 
                    className="bg-black border-2 border-red-500 text-white px-4 py-3 text-center text-3xl tracking-[0.5em] w-full focus:outline-none focus:border-red-400 placeholder-red-900/50 shadow-inner rounded" 
                    placeholder="0000" 
                    autoFocus
                />
                <button 
                    onClick={() => { solveCrisis(code); setCode(""); }} 
                    className="mt-2 w-full bg-red-600 hover:bg-red-500 text-white py-3 font-bold uppercase tracking-widest shadow-lg active:scale-95 transition-transform rounded"
                >
                    EXÉCUTER
                </button>
            </div>
        </div>
    );
};

const BriefDecrypter = ({ currentBrief }) => {
    const [frequency, setFrequency] = useState(50);
    const [targetFreq, setTargetFreq] = useState(Math.floor(Math.random() * 80) + 10);
    useEffect(() => { setTargetFreq(Math.floor(Math.random() * 80) + 10); setFrequency(50); }, [currentBrief.word]);
    const signalQuality = Math.max(0, 100 - Math.abs(frequency - targetFreq) * 5);
    const isClear = signalQuality > 90;
    return (
        <div className="mb-6 border-b pb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4"><Radio className={isClear ? "text-green-600 animate-pulse" : "text-gray-400"} /> SIGNAL CLIENT</h2>
            <div className="bg-black p-6 rounded-lg font-mono text-center mb-4 border-4 border-gray-700 relative overflow-hidden shadow-inner">
                <p className={`text-3xl font-black tracking-widest transition-all ${isClear ? "text-green-400" : "text-gray-600 blur-sm"}`}>{isClear ? `"${currentBrief?.word}"` : "••••••••••"}</p>
            </div>
            <input type="range" min="0" max="100" value={frequency} onChange={(e) => setFrequency(parseInt(e.target.value))} className="w-full h-2 bg-gray-300 rounded-lg cursor-pointer accent-blue-600" />
        </div>
    );
};

const GanttApp = () => {
    const { teamStatus, budget, timeLeft, currentBrief, brandBook, resolveBlockage, buyBoost, adminCode, securityLock, serverHeat, activeCrisis } = useGame();

    if (!teamStatus || !teamStatus.dev || !teamStatus.crea) return <div>Chargement...</div>;

    return (
        <div className="h-full flex flex-col bg-white font-sans text-sm relative overflow-hidden">
            
            {/* 1. PRIORITÉ ABSOLUE : Panne de courant (Surchauffe) */}
            {serverHeat >= 100 && <BlackoutGantt />}
            
            {/* 2. PRIORITÉ SECONDAIRE : Verrouillage Crise (Si pas de surchauffe) */}
            {activeCrisis && serverHeat < 100 && <SecurityLockout />}

            <div className="h-10 bg-[#f0f0f0] border-b flex items-center px-4 gap-4 shrink-0">
                <div className="flex items-center gap-2 border bg-white px-3 py-1 rounded shadow-sm"><span className="w-3 h-3 rounded-full bg-green-500"></span><span className="font-bold">{budget || 0} $</span></div>
                <div className="flex items-center gap-2 border bg-white px-3 py-1 rounded shadow-sm"><Activity size={14} /><span>{Math.floor((timeLeft || 0) / 60)}:{( (timeLeft || 0) % 60).toString().padStart(2, '0')}</span></div>
                <div className="border-l h-6 mx-2"></div>
                <button onClick={buyBoost} className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded border border-blue-300 active:translate-y-0.5"><Coffee size={14} /> Café (30$)</button>
            </div>

            <div className="flex-1 flex overflow-hidden">
                <div className="w-1/3 border-r bg-gray-50 p-4 flex flex-col overflow-y-auto shrink-0">
                    <h3 className="font-bold text-gray-700 mb-4 uppercase text-xs">Ressources Humaines</h3>
                    
                    {/* Code de sécurité DEV (25% progress) */}
                    {securityLock && (
                        <div className="bg-red-600 text-white p-4 rounded mb-4 shadow-lg animate-pulse">
                            <p className="text-xs font-bold flex items-center gap-2 mb-1"><ShieldCheck size={14}/> SÉCURITÉ ACTIVE</p>
                            <p className="text-sm mb-2">Dictez ce code au Dev :</p>
                            <p className="text-3xl font-mono font-black text-center tracking-widest bg-black/20 rounded py-1 border-2 border-white/30">{adminCode}</p>
                        </div>
                    )}

                    {/* CARTE DEV */}
                    <div className={`mb-4 p-3 rounded border shadow-sm ${teamStatus.dev.blocked ? 'bg-red-50 border-red-300' : 'bg-white border-gray-200'}`}>
                        <div className="flex justify-between items-center mb-1">
                            <span className="font-bold flex items-center gap-2"><User size={14}/> Développeur</span>
                            {teamStatus.dev.blocked && <span className="text-[10px] bg-red-600 text-white px-1 rounded animate-pulse">BSOD</span>}
                        </div>
                        <div className="text-xs text-gray-500 mb-2 italic">Pseudo: {teamStatus.dev.name}</div>
                        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mb-2"><div className="bg-blue-600 h-full transition-all duration-300" style={{width: `${teamStatus.dev.progress || 0}%`}}></div></div>
                        {teamStatus.dev.blocked && <button onClick={() => resolveBlockage('dev')} className="w-full bg-red-600 text-white py-1 rounded text-xs hover:bg-red-700 font-bold">DÉBLOQUER (-10$)</button>}
                    </div>

                    {/* CARTE CREA */}
                    <div className={`mb-4 p-3 rounded border shadow-sm ${teamStatus.crea.blocked ? 'bg-red-50 border-red-300' : 'bg-white border-gray-200'}`}>
                        <div className="flex justify-between items-center mb-1">
                            <span className="font-bold flex items-center gap-2"><User size={14}/> Graphiste</span>
                            {teamStatus.crea.blocked && <span className="text-[10px] bg-red-600 text-white px-1 rounded animate-pulse">CRASH</span>}
                        </div>
                        <div className="text-xs text-gray-500 mb-2 italic">Pseudo: {teamStatus.crea.name}</div>
                        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mb-2"><div className="bg-pink-600 h-full transition-all duration-300" style={{width: `${teamStatus.crea.progress || 0}%`}}></div></div>
                        {teamStatus.crea.blocked && <button onClick={() => resolveBlockage('crea')} className="w-full bg-red-600 text-white py-1 rounded text-xs hover:bg-red-700 font-bold">DÉBLOQUER (-10$)</button>}
                    </div>
                </div>

                <div className="flex-1 p-6 bg-white overflow-y-auto">
                    <BriefDecrypter currentBrief={currentBrief} />
                    <div className="border rounded-lg overflow-hidden shadow-sm mt-6">
                        <div className="bg-gray-100 px-4 py-2 border-b flex items-center gap-2"><BookOpen size={16} className="text-gray-500"/><span className="font-bold text-gray-600 uppercase text-xs">Manuel de Marque (Version 2.0)</span></div>
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-white text-gray-400 uppercase text-[10px]"><tr><th className="p-3 border-b">Mot Clé</th><th className="p-3 border-b">Logo Requis (Composite)</th></tr></thead>
                            <tbody className="text-sm">
                                {Object.entries(brandBook || {}).map(([word, requirements]) => (
                                    <tr key={word} className={`border-b hover:bg-blue-50 transition-colors`}>
                                        <td className="p-3 font-mono font-bold text-gray-700">{word}</td>
                                        <td className="p-3">
                                            <div className="flex gap-4">
                                                {/* On affiche les 2 formes requises pour le logo */}
                                                {requirements.map((req, i) => (
                                                    <div key={i} className="flex items-center gap-2 border border-gray-200 px-2 py-1 rounded bg-white shadow-sm">
                                                        <span className="text-gray-400 text-xs font-bold">{i+1}.</span>
                                                        <span className="text-xs capitalize">
                                                            {req.shape === 'carré' ? '■ Carré' : req.shape === 'triangle' ? '▲ Triangle' : '● Rond'}
                                                        </span>
                                                        <span className={`px-2 py-0.5 rounded text-white text-[10px] uppercase font-bold ${req.color === 'rouge' ? 'bg-red-500' : req.color === 'vert' ? 'bg-green-500' : req.color === 'bleu' ? 'bg-blue-500' : 'bg-yellow-500'}`}>
                                                            {req.color}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StratView = () => {
    const apps = [
        { id: 'project', title: 'GanttProject', icon: BrainCircuit, component: GanttApp },
        { id: 'crisis', title: 'Crisis Ctrl', icon: ShieldCheck, component: CrisisApp },
        { id: 'gmail', title: 'Gmail', icon: Mail, component: MailApp }
    ];

    return <Desktop apps={apps} />;
};

export default StratView;