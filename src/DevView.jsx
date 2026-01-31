import React, { useState, useEffect } from 'react';
import { useGame } from './GameContext';
import Desktop from './components/Desktop';
import MailApp from './MailApp';
import MaintenanceApp from './components/MaintenanceApp';
import { Code, Mail, Server, AlertTriangle, ShieldAlert, WifiOff, Lock } from 'lucide-react';

const CHALLENGES = [
    { id: 1, q: "<div class='row'>", a: "</div>", traps: ["</span>", "</header>"] },
    { id: 2, q: "const user =", a: "new User();", traps: ["User();", "int User;"] },
    { id: 3, q: "background:", a: "#000;", traps: ["100px;", "bold;"] },
    { id: 4, q: "git commit", a: "-m 'fix'", traps: ["push", "pull"] },
    { id: 5, q: "array.map(e =>", a: "e.id)", traps: ["e;)", "return;"] },
    { id: 6, q: "z-index:", a: "9999;", traps: ["bold;", "absolute;"] },
];

const BSOD = ({ error }) => (
    <div className="absolute inset-0 bg-[#0000AA] text-white font-mono p-8 z-50 flex flex-col items-center justify-center text-center select-none">
        <h1 className="text-8xl mb-4">:(</h1>
        <p className="text-2xl mb-8">Un problème a été détecté.</p>
        <p className="text-sm bg-white text-blue-900 px-2 py-1 mb-4 font-bold">CODE : {error}</p>
        <div className="animate-pulse text-yellow-300 font-bold border-2 border-yellow-300 p-4 rounded">ATTENTE DE DÉPANNAGE (STRATÈGE)</div>
    </div>
);

const SecurityLockScreen = () => {
    const { unlockDevSecurity } = useGame();
    const [code, setCode] = useState("");
    const handleKeyDown = (e) => { if (e.key === 'Enter') unlockDevSecurity(code); };

    // --- CORRECTION : FILTRE NUMÉRIQUE STRICT ---
    const handleInputChange = (e) => {
        const val = e.target.value;
        if (/^\d*$/.test(val)) {
            setCode(val);
        }
    };

    return (
        <div className="absolute inset-0 bg-gray-900/95 z-50 flex flex-col items-center justify-center text-white font-mono p-4">
            <ShieldAlert size={64} className="text-red-500 mb-4 animate-pulse" />
            <h2 className="text-3xl font-bold text-red-500 mb-2">ACCÈS REFUSÉ</h2>
            <p className="text-gray-400 mb-8 text-center max-w-md">Pare-feu actif. Entrez le <span className="text-white font-bold">CODE ADMIN</span> du Stratège.</p>
            <div className="flex gap-2">
                <input 
                    type="text" 
                    maxLength={4} 
                    value={code} 
                    onChange={handleInputChange} 
                    onKeyDown={handleKeyDown} 
                    className="bg-black border-2 border-red-500 text-white px-4 py-3 text-center text-2xl tracking-[1em] w-48 focus:outline-none" 
                    placeholder="0000" 
                    autoFocus 
                />
                <button onClick={() => unlockDevSecurity(code)} className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 font-bold">UNLOCK</button>
            </div>
        </div>
    );
};

const VSCodeApp = () => {
    const { teamStatus, validateDevTask, serverHeat, assetsReady, securityLock, activeCrisis, crisisCode } = useGame();
    const myData = teamStatus.dev;
    const [currentChallenge, setCurrentChallenge] = useState(null);
    const [options, setOptions] = useState([]);
    
    const loadNewChallenge = () => {
        let challenge;
        do { challenge = CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)]; } 
        while (currentChallenge && challenge.id === currentChallenge.id);
        setCurrentChallenge(challenge);
        setOptions([challenge.a, ...challenge.traps].sort(() => Math.random() - 0.5));
    };
    useEffect(() => { loadNewChallenge(); }, []);

    const handleOptionClick = (opt) => {
        if (myData.blocked || securityLock || serverHeat >= 100) return;
        if (opt === currentChallenge.a) { validateDevTask(true); loadNewChallenge(); } 
        else { validateDevTask(false); }
    };

    return (
        <div className="h-full flex bg-[#1e1e1e] text-gray-300 font-mono text-sm select-none relative">
            {myData.blocked && <BSOD error={myData.blockageType || "FATAL_ERROR"} />}
            {securityLock && <SecurityLockScreen />}

            {/* MESSAGE CRISE FIREWALL (Visible par dessus le code mais non bloquant pour le reste du bureau) */}
            {activeCrisis === 'FIREWALL' && (
                <div className="absolute inset-0 bg-black/80 z-40 flex flex-col items-center justify-center p-8 backdrop-blur-sm animate-pulse-bg">
                    <div className="bg-red-900 border-4 border-red-500 p-6 rounded-xl flex flex-col items-center text-white shadow-2xl">
                        <Lock size={48} className="mb-2 animate-bounce"/>
                        <h3 className="text-2xl font-black uppercase mb-1">ALERTE SÉCURITÉ</h3>
                        <p className="text-sm mb-4">LE PARE-FEU EST ATTAQUÉ !</p>
                        <p className="text-xs uppercase bg-black/40 px-2 py-1 rounded mb-2">Code d'urgence pour le Stratège :</p>
                        <div className="text-5xl font-mono font-black tracking-widest bg-black px-6 py-2 rounded border border-red-500/50 text-red-500">
                            {crisisCode}
                        </div>
                    </div>
                </div>
            )}

            {serverHeat >= 100 && (
                <div className="absolute inset-0 bg-black/90 z-40 flex flex-col items-center justify-center text-red-500">
                    <WifiOff size={64} className="mb-4 animate-pulse"/>
                    <h2 className="text-2xl font-bold">CONNEXION PERDUE</h2>
                    <p className="text-gray-400">Le serveur ne répond plus.</p>
                    <p className="mt-4 text-white bg-blue-600 px-4 py-1 rounded animate-bounce">Ouvrez l'app "Server Mgr" !</p>
                </div>
            )}

            <div className="w-12 bg-[#333333] flex flex-col items-center py-4 gap-4 border-r border-black shrink-0">
                <Code size={24} className="text-white" />
                <Server size={24} className={serverHeat > 80 ? "text-red-500 animate-bounce" : "opacity-50"} />
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="bg-[#252526] px-4 py-2 text-white text-xs border-t border-blue-400 flex justify-between items-center shrink-0">
                    <span>index.js</span>
                    {!assetsReady && myData.progress >= 75 && (
                        <span className="text-yellow-400 font-bold flex items-center gap-1 animate-pulse"><AlertTriangle size={12}/> ATTENTE ASSETS (CRÉA)</span>
                    )}
                </div>
                <div className="flex-1 p-8 overflow-y-auto">
                    <div className="space-y-4">
                        <div className="text-gray-500">// TODO: Refactor everything</div>
                        <div className="flex items-center gap-3 text-lg">
                            <span className="text-blue-400">{currentChallenge?.q}</span>
                            <span className="w-2 h-5 bg-white animate-pulse block"></span>
                        </div>
                    </div>
                </div>
                <div className="h-32 bg-[#1e1e1e] border-t border-gray-700 flex flex-col shrink-0">
                    <div className="flex px-4 py-1 gap-4 text-xs uppercase bg-[#252526]">
                        <span className="text-white border-b border-white">Terminal</span>
                        <span className={`${serverHeat > 80 ? 'text-red-500 font-bold animate-pulse' : 'text-green-500'}`}>Temp: {Math.round(serverHeat)}°C</span>
                    </div>
                    <div className="flex-1 p-4 grid grid-cols-3 gap-4">
                        {options.map((opt, i) => <button key={i} onClick={() => handleOptionClick(opt)} className="bg-[#3c3c3c] hover:bg-[#505050] text-white border border-gray-600 rounded text-xs">{opt}</button>)}
                    </div>
                </div>
            </div>
        </div>
    );
};

const DevView = () => {
    const apps = [
        { id: 'vscode', title: 'VS Code', icon: Code, component: VSCodeApp },
        { id: 'server', title: 'Server Mgr', icon: Server, component: MaintenanceApp }, 
        { id: 'gmail', title: 'Gmail', icon: Mail, component: MailApp }
    ];
    return <Desktop apps={apps} />;
};

export default DevView;