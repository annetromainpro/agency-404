import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../GameContext';
import { Server, Activity, AlertTriangle, Zap, CheckCircle } from 'lucide-react';

const WireGame = ({ onComplete }) => {
    const containerRef = useRef(null);
    const [wires, setWires] = useState([]);
    const [draggingWire, setDraggingWire] = useState(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // Attendre que le composant soit bien monté avec une taille > 0
        const timer = setTimeout(() => {
            if (containerRef.current) {
                initWires();
                setIsReady(true);
            }
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    const initWires = () => {
        const colors = ['#ef4444', '#3b82f6', '#eab308', '#22c55e'];
        const newWires = colors.map((col, i) => ({
            id: i, color: col, startY: 20 + (i * 20), endY: 20 + (i * 20), connected: false
        })).sort(() => Math.random() - 0.5);
        
        const shuffledEnds = [...newWires].map(w => w.endY).sort(() => Math.random() - 0.5);
        newWires.forEach((w, i) => w.endY = shuffledEnds[i]);
        setWires(newWires);
    };

    const updateMousePos = (e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleMouseDown = (e, wire) => {
        if (wire.connected) return;
        setDraggingWire(wire);
        updateMousePos(e);
    };

    const handleMouseMove = (e) => {
        if (draggingWire) updateMousePos(e);
    };

    const handleMouseUp = (e, targetY, targetColor) => {
        if (!draggingWire) return;
        if (targetColor && draggingWire.color === targetColor) {
             setWires(prev => prev.map(w => w.id === draggingWire.id ? { ...w, connected: true } : w));
        }
        setDraggingWire(null);
    };

    useEffect(() => {
        if (isReady && wires.length > 0 && wires.every(w => w.connected)) {
            setTimeout(onComplete, 500);
        }
    }, [wires, onComplete, isReady]);

    if (!isReady) return <div ref={containerRef} className="flex-1 flex items-center justify-center text-gray-500 bg-black h-full w-full">Chargement...</div>;

    return (
        <div 
            className="flex-1 bg-black rounded-lg border-2 border-gray-700 relative overflow-hidden cursor-crosshair shadow-inner select-none h-full w-full"
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseUp={() => setDraggingWire(null)}
            onMouseLeave={() => setDraggingWire(null)}
        >
            <div className="absolute top-2 left-2 text-[10px] text-gray-500 font-mono">PATCH PANEL V4</div>
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {wires.map(w => w.connected && <line key={w.id} x1="30" y1={`${w.startY}%`} x2="calc(100% - 30px)" y2={`${w.endY}%`} stroke={w.color} strokeWidth="6" strokeLinecap="round" opacity="0.8"/>)}
                {draggingWire && <line x1="30" y1={`${draggingWire.startY}%`} x2={mousePos.x} y2={mousePos.y} stroke={draggingWire.color} strokeWidth="6" strokeLinecap="round"/>}
            </svg>
            {wires.map(w => (
                <div key={'l'+w.id} onMouseDown={(e) => handleMouseDown(e, w)} className="absolute left-2 w-6 h-6 rounded-full border-2 border-gray-500 hover:border-white transition-transform shadow-lg z-10 cursor-pointer" style={{ top: `calc(${w.startY}% - 12px)`, backgroundColor: w.color }} />
            ))}
            {wires.map(w => (
                <div key={'r'+w.id} onMouseUp={(e) => handleMouseUp(e, w.endY, w.color)} className="absolute right-2 w-6 h-6 rounded-full border-2 border-gray-500 z-10" style={{ top: `calc(${w.endY}% - 12px)`, backgroundColor: w.color, boxShadow: 'inset 0 0 5px rgba(0,0,0,0.5)' }} />
            ))}
        </div>
    );
};

const UpdateGame = ({ onComplete }) => {
    const [blocks, setBlocks] = useState([]);

    useEffect(() => {
        const newBlocks = Array(12).fill(true);
        let corrupted = 0;
        while (corrupted < 5) {
            const idx = Math.floor(Math.random() * 12);
            if (newBlocks[idx]) { newBlocks[idx] = false; corrupted++; }
        }
        setBlocks(newBlocks);
    }, []);

    const fixBlock = (index) => {
        const newBlocks = [...blocks];
        newBlocks[index] = true;
        setBlocks(newBlocks);
        if (newBlocks.every(b => b === true)) setTimeout(onComplete, 300);
    };

    return (
        <div className="flex-1 bg-[#0f172a] rounded-lg border-2 border-gray-700 p-4 flex flex-col items-center justify-center select-none h-full">
            <h3 className="text-white text-xs font-mono mb-4 uppercase animate-pulse flex items-center gap-2">
                <AlertTriangle size={14} className="text-red-500"/> RÉPAREZ LES SECTEURS ROUGES
            </h3>
            <div className="grid grid-cols-4 gap-3 w-full max-w-xs">
                {blocks.map((isHealthy, i) => (
                    <button key={i} onClick={() => !isHealthy && fixBlock(i)} className={`h-12 rounded border-2 transition-all duration-150 active:scale-95 flex items-center justify-center ${isHealthy ? 'bg-green-500/20 border-green-500 cursor-default' : 'bg-red-500/80 border-red-400 hover:bg-red-500 cursor-pointer animate-pulse'}`}>
                        {isHealthy ? <CheckCircle size={16} className="text-green-500"/> : <AlertTriangle size={16} className="text-white"/>}
                    </button>
                ))}
            </div>
            <div className="mt-6 w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 transition-all duration-300" style={{width: `${(blocks.filter(b => b).length / 12) * 100}%`}}></div>
            </div>
        </div>
    );
};

const MaintenanceApp = () => {
    const { serverHeat, coolServer } = useGame();
    const [mode, setMode] = useState('monitor');
    const [gameType, setGameType] = useState('wires');
    const isCritical = serverHeat > 80;

    const startMaintenance = () => {
        setGameType(Math.random() > 0.5 ? 'wires' : 'update');
        setMode('game');
    };

    const handleVictory = () => {
        coolServer();
        setMode('monitor');
    };

    return (
        <div className="h-full flex flex-col bg-[#1a1a1a] text-gray-300 font-mono p-4">
            <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
                <h2 className="text-lg font-bold text-white flex items-center gap-2"><Server size={20} className={isCritical ? "text-red-500 animate-bounce" : "text-green-500"} /> SERVER RACK</h2>
                <span className="text-[10px] bg-gray-800 px-2 py-1 rounded border border-gray-600 font-mono">192.168.0.1</span>
            </div>
            <div className="mb-6">
                <div className="flex justify-between text-xs mb-1 font-bold"><span>CPU TEMP</span><span className={isCritical ? "text-red-500 animate-pulse" : "text-blue-400"}>{Math.round(serverHeat)}°C</span></div>
                <div className="w-full h-6 bg-gray-900 rounded border border-gray-600 relative overflow-hidden">
                    <div className={`h-full transition-all duration-300 ${isCritical ? 'bg-red-600' : 'bg-blue-500'}`} style={{ width: `${serverHeat}%` }}></div>
                </div>
            </div>
            <div className="flex-1 flex flex-col relative overflow-hidden">
                {mode === 'monitor' ? (
                    <div className="flex-1 flex flex-col items-center justify-center bg-[#111] rounded border border-gray-700 p-6 text-center">
                        <Activity size={48} className={`mb-4 ${isCritical ? 'text-red-500 animate-pulse' : 'text-green-500'}`} />
                        <h3 className="text-lg font-bold text-white mb-2">STATUS: {isCritical ? "CRITICAL" : "OK"}</h3>
                        <button onClick={startMaintenance} disabled={serverHeat < 10} className={`mt-4 px-6 py-3 rounded font-bold flex items-center gap-2 transition-all ${serverHeat < 10 ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg hover:scale-105'}`}>
                            <Zap size={18} /> OPEN MAINTENANCE
                        </button>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col h-full">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-yellow-500 font-bold animate-pulse uppercase">Module: {gameType}</span>
                            <button onClick={() => setMode('monitor')} className="text-xs underline hover:text-white">Annuler</button>
                        </div>
                        {gameType === 'wires' ? <WireGame onComplete={handleVictory} /> : <UpdateGame onComplete={handleVictory} />}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MaintenanceApp;