import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, Folder, ArrowRight } from 'lucide-react';

const BOARDS = [
    { id: 'fire', name: 'Palette FEU', css: 'bg-red-100 border-red-400 text-red-800' }, 
    { id: 'ocean', name: 'Palette OCÉAN', css: 'bg-blue-100 border-blue-400 text-blue-800' }, 
    { id: 'nature', name: 'Palette NATURE', css: 'bg-green-100 border-green-400 text-green-800' }
];

const TrendrApp = ({ onGainInspiration }) => {
    const [pins, setPins] = useState([]);
    const [selectedPin, setSelectedPin] = useState(null);
    const [feedback, setFeedback] = useState(null);

    const generatePin = () => {
        const type = Math.random();
        let category, color;

        if (type < 0.33) {
            category = 'fire';
            color = `hsl(${0 + Math.random() * 40}, 80%, 60%)`;
        } else if (type < 0.66) {
            category = 'ocean';
            color = `hsl(${200 + Math.random() * 40}, 80%, 60%)`;
        } else {
            category = 'nature';
            color = `hsl(${100 + Math.random() * 40}, 80%, 60%)`;
        }
        
        return {
            id: Date.now() + Math.random(),
            height: Math.random() > 0.5 ? 'h-32' : 'h-48',
            color: color,
            category: category,
            title: `Ref #${Math.floor(Math.random() * 999)}`
        };
    };

    const refreshFeed = () => {
        setPins(Array.from({ length: 9 }).map(generatePin));
        setSelectedPin(null);
    };

    useEffect(() => { refreshFeed(); }, []);

    const handleBoardClick = (boardId) => {
        if (!selectedPin) return;

        if (selectedPin.category === boardId) {
            onGainInspiration(25); 
            setFeedback({ type: 'success', text: '+25 INSPI' });
            setPins(prev => prev.filter(p => p.id !== selectedPin.id));
            setTimeout(() => setPins(prev => [...prev, generatePin()]), 300);
        } else {
            onGainInspiration(-10);
            setFeedback({ type: 'error', text: 'MAUVAIS CLASSEMENT (-10)' });
        }

        setSelectedPin(null);
        setTimeout(() => setFeedback(null), 800);
    };

    return (
        <div className="h-full flex flex-col bg-white overflow-hidden font-sans relative">
            
            {/* Feedback Overlay */}
            {feedback && (
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 px-6 py-3 rounded-full font-black text-white shadow-xl animate-bounce ${feedback.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {feedback.text}
                </div>
            )}

            {/* Header: Les Dossiers (Cibles FIXES) */}
            <div className="h-28 bg-white border-b flex items-center justify-around px-2 shrink-0 shadow-sm z-10">
                {BOARDS.map(board => (
                    <div
                        key={board.id}
                        // Utilisation d'un div au lieu d'un button pour éviter les comportements par défaut bizarres
                        onClick={() => handleBoardClick(board.id)}
                        className={`flex flex-col items-center justify-center w-24 h-20 rounded-xl border-2 transition-colors duration-200
                            ${board.css} 
                            ${selectedPin ? 'cursor-pointer ring-4 ring-offset-2 ring-black/10 hover:brightness-95' : 'opacity-60 cursor-not-allowed'}
                        `}
                    >
                        <Folder size={24} fill="currentColor" className="mb-1 pointer-events-none"/>
                        <span className="text-[10px] font-bold uppercase text-center leading-tight pointer-events-none">{board.name}</span>
                        {/* Indicateur visuel "Drop Here" sans changer la taille */}
                        {selectedPin && (
                            <div className="absolute inset-0 bg-white/30 animate-pulse rounded-xl pointer-events-none border-2 border-dashed border-black/20"></div>
                        )}
                    </div>
                ))}
            </div>

            {/* Masonry Grid (Pins) */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-4 text-gray-400 text-xs uppercase font-bold">
                    <span>Inspirations non triées</span>
                    <button onClick={refreshFeed} className="flex items-center gap-1 hover:text-gray-800"><RefreshCw size={12}/> Refresh</button>
                </div>
                
                <div className="columns-2 gap-4 space-y-4">
                    {pins.map((pin) => (
                        <div 
                            key={pin.id}
                            onClick={() => setSelectedPin(pin.id === selectedPin?.id ? null : pin)}
                            className={`break-inside-avoid rounded-2xl overflow-hidden cursor-pointer relative transition-all duration-200 ${pin.height} 
                                ${selectedPin?.id === pin.id ? 'ring-4 ring-black scale-[0.98] shadow-none' : 'hover:scale-[1.02] shadow-md'}
                            `}
                            style={{ backgroundColor: pin.color }}
                        >
                            <div className="absolute bottom-0 w-full bg-black/20 p-2 text-white text-[10px] font-bold backdrop-blur-sm pointer-events-none">
                                {pin.title}
                            </div>

                            {selectedPin?.id === pin.id && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                                    <div className="bg-black text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                                        <ArrowRight size={12}/> CHOISIR DOSSIER
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TrendrApp;