import React, { useState, createContext, useContext, useMemo } from 'react';
import { useGame } from './GameContext';
import Desktop from './components/Desktop';
import MailApp from './MailApp';
import TrendrApp from './components/TrendrApp';
import { PenTool, Mail, Square, Circle, Triangle, MousePointer, PaintBucket, Send, Trash2, Zap, WifiOff, ShieldAlert, Layers } from 'lucide-react';

const CreaLocalContext = createContext();

const AdobeCrash = () => (
    <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
        <div className="bg-[#f0f0f0] w-96 rounded-lg shadow-2xl border border-gray-400 overflow-hidden font-sans text-sm text-gray-900">
            <div className="h-6 bg-white px-2 flex items-center justify-between border-b"><span>Adobe Photoshop CS6</span><span className="text-gray-400">x</span></div>
            <div className="p-6 flex gap-4"><div className="text-red-600 text-4xl">⚠</div><div><p className="font-bold mb-2">Adobe Photoshop a cessé de fonctionner</p></div></div>
            <div className="bg-[#dcdcdc] p-3 flex justify-end gap-2 border-t border-gray-300"><div className="px-4 py-1 border border-blue-300 bg-blue-100 text-blue-800 font-bold animate-pulse">Attendre le Stratège...</div></div>
        </div>
    </div>
);

const ServerOfflineScreen = () => (
    <div className="absolute inset-0 bg-black z-[60] flex flex-col items-center justify-center text-gray-500 font-mono">
        <WifiOff size={64} className="mb-4 text-red-600 animate-pulse"/><h2 className="text-2xl text-white font-bold mb-2">CONNEXION PERDUE</h2><p>Erreur 503 : Serveur en Surchauffe</p>
    </div>
);

const PhotoshopApp = () => {
    const { teamStatus, validateCreaTask, activeCrisis, crisisCode } = useGame();
    const { inspiration, consumeInspiration } = useContext(CreaLocalContext);
    const myData = teamStatus.crea;
    
    const [tool, setTool] = useState('select');
    const [color, setColor] = useState('#ef4444'); 
    
    // On gère maintenant une LISTE de formes
    const [layers, setLayers] = useState([]); // [{id, type, x, y, w, h, fill}]
    const [currentShape, setCurrentShape] = useState(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });

    const colors = [{ id: 'rouge', hex: '#ef4444' }, { id: 'vert', hex: '#22c55e' }, { id: 'bleu', hex: '#3b82f6' }, { id: 'jaune', hex: '#eab308' }];

    const handleMouseDown = (e) => {
        if (myData.blocked || tool === 'select' || tool === 'bucket') return;
        if (inspiration <= 0) { alert("Plus d'inspiration !"); return; }

        const rect = e.currentTarget.getBoundingClientRect();
        setIsDrawing(true);
        setStartPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        // Création forme temporaire
        setCurrentShape({ type: tool, x: e.clientX - rect.left, y: e.clientY - rect.top, w: 0, h: 0, fill: null });
    };

    const handleMouseMove = (e) => {
        if (!isDrawing) return;
        const rect = e.currentTarget.getBoundingClientRect();
        let w = (e.clientX - rect.left) - startPos.x;
        let h = (e.clientY - rect.top) - startPos.y;
        if (tool === 'circle' || tool === 'triangle') { 
            const size = Math.max(Math.abs(w), Math.abs(h)); 
            w = w < 0 ? -size : size; h = h < 0 ? -size : size; 
        }
        setCurrentShape(prev => ({ ...prev, w, h }));
    };

    const handleMouseUp = () => {
        if (isDrawing) {
            consumeInspiration(10);
            if (currentShape && Math.abs(currentShape.w) > 5) {
                // Normalisation et ajout au calque
                const newLayer = {
                    ...currentShape,
                    id: Date.now(),
                    x: currentShape.w < 0 ? currentShape.x + currentShape.w : currentShape.x,
                    y: currentShape.h < 0 ? currentShape.y + currentShape.h : currentShape.y,
                    w: Math.abs(currentShape.w),
                    h: Math.abs(currentShape.h)
                };
                setLayers(prev => [...prev, newLayer]);
            }
        }
        setIsDrawing(false);
        setCurrentShape(null);
    };

    const handleLayerClick = (e, layerId) => {
        e.stopPropagation();
        if (tool === 'bucket') {
            setLayers(prev => prev.map(l => l.id === layerId ? { ...l, fill: color } : l));
        } else if (tool === 'select') {
            // Pourrait servir à déplacer, pour l'instant ne fait rien
        }
    };

    const handleClear = () => setLayers([]);

    const handleExport = () => {
        if (layers.length === 0 || myData.blocked) return;
        
        // Vérif coût
        if (inspiration < 40) { alert("Pas assez d'inspiration ! (Requis: 40)"); return; }

        // Conversion des calques en format compréhensible par le serveur
        const shapesToSend = layers
            .filter(l => l.fill) // Seulement ceux coloriés
            .map(l => {
                const colorId = colors.find(c => c.hex === l.fill)?.id;
                let shapeId = 'carré';
                if (l.type === 'circle') shapeId = 'rond';
                if (l.type === 'triangle') shapeId = 'triangle';
                return { color: colorId, shape: shapeId };
            });

        if (shapesToSend.length > 0) { 
            consumeInspiration(40);
            validateCreaTask(shapesToSend); 
            setLayers([]); // Reset après envoi
        }
    };

    return (
        <div className="h-full flex bg-[#535353] text-gray-200 font-sans select-none overflow-hidden relative">
            {myData.blockageType === "ADOBE_CRASH" && <AdobeCrash />}
            {myData.blockageType === "SERVER_OFFLINE" && <ServerOfflineScreen />}

            {activeCrisis === 'COPYRIGHT' && (
                <div className="absolute top-0 right-0 m-4 z-50 bg-red-600 text-white p-4 rounded shadow-xl animate-pulse max-w-xs">
                    <h3 className="font-bold flex items-center gap-2"><ShieldAlert size={20}/> PROCÈS COPYRIGHT !</h3>
                    <p className="text-sm">Donnez ce n° au Stratège :</p>
                    <p className="text-3xl font-mono font-black mt-2 bg-black/20 text-center">{crisisCode}</p>
                </div>
            )}

            {/* Toolbar */}
            <div className="w-12 bg-[#383838] border-r border-[#2b2b2b] flex flex-col items-center py-2 gap-2 z-10">
                <ToolButton icon={MousePointer} active={tool === 'select'} onClick={() => setTool('select')} />
                <div className="w-8 h-px bg-gray-600 my-1"></div>
                <div className={inspiration <= 0 ? "opacity-30 pointer-events-none grayscale" : ""}>
                    <ToolButton icon={Square} active={tool === 'rect'} onClick={() => setTool('rect')} />
                    <ToolButton icon={Circle} active={tool === 'circle'} onClick={() => setTool('circle')} />
                    <ToolButton icon={Triangle} active={tool === 'triangle'} onClick={() => setTool('triangle')} />
                    <ToolButton icon={PaintBucket} active={tool === 'bucket'} onClick={() => setTool('bucket')} />
                </div>
                <div className="w-8 h-px bg-gray-600 my-1"></div>
                <ToolButton icon={Trash2} onClick={handleClear} color="text-red-400" />
                <div className="mt-auto mb-2 flex flex-col gap-2">
                    {colors.map(c => <button key={c.id} onClick={() => setColor(c.hex)} className={`w-8 h-8 rounded-full border-2 shadow-lg ${color === c.hex ? 'scale-110 border-white ring-2 ring-black' : 'border-gray-600'}`} style={{backgroundColor: c.hex}} />)}
                </div>
            </div>

            {/* Canvas */}
            <div className="flex-1 bg-[#282828] flex flex-col relative">
                <div className="h-8 bg-[#383838] border-b border-[#2b2b2b] flex items-center px-4 text-xs gap-4 text-gray-400">
                    <span>File</span><span>Edit</span>
                    <div className="ml-4 flex items-center gap-2 bg-black/30 px-2 py-0.5 rounded-full border border-gray-600">
                        <Zap size={12} className={inspiration > 0 ? "text-yellow-400" : "text-gray-500"} fill={inspiration > 0 ? "currentColor" : "none"}/>
                        <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden"><div className={`h-full ${inspiration < 20 ? 'bg-red-500 animate-pulse' : 'bg-yellow-400'}`} style={{width: `${inspiration}%`}}></div></div>
                    </div>
                    <button className={`ml-auto px-4 py-1 rounded font-bold text-white flex items-center gap-2 ${layers.length > 0 ? 'bg-blue-600 hover:bg-blue-500' : 'bg-gray-600 opacity-50'}`} onClick={handleExport}><Send size={12}/> EXPORT LOGO</button>
                </div>
                <div className="flex-1 relative cursor-crosshair overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-white shadow-2xl pointer-events-none"></div>
                    
                    {/* Calques existants */}
                    {layers.map(layer => (
                        <div 
                            key={layer.id}
                            onClick={(e) => handleLayerClick(e, layer.id)}
                            className={`absolute border-4 border-black box-border hover:opacity-90 transition-colors cursor-pointer
                                ${layer.type === 'circle' ? 'rounded-full' : ''}
                                ${layer.type === 'triangle' ? 'border-none bg-transparent clip-triangle' : ''}
                                ${tool === 'bucket' ? 'hover:ring-4 ring-blue-400' : ''}
                            `}
                            style={{ 
                                left: layer.x, top: layer.y, width: layer.w, height: layer.h, 
                                backgroundColor: layer.type === 'triangle' ? 'transparent' : (layer.fill || 'transparent'),
                                pointerEvents: 'auto'
                            }}
                        >
                            {/* Rendu spécifique Triangle via CSS border hack ou clip-path */}
                            {layer.type === 'triangle' && (
                                <div 
                                    className="w-full h-full"
                                    style={{
                                        borderLeft: `${layer.w/2}px solid transparent`,
                                        borderRight: `${layer.w/2}px solid transparent`,
                                        borderBottom: `${layer.h}px solid ${layer.fill || 'rgba(0,0,0,0.1)'}`,
                                        filter: !layer.fill ? 'drop-shadow(0 0 2px black)' : ''
                                    }}
                                ></div>
                            )}
                            
                            {!layer.fill && layer.type !== 'triangle' && <div className="absolute inset-0 flex items-center justify-center text-black/20 font-bold text-xs uppercase pointer-events-none">?</div>}
                        </div>
                    ))}

                    {/* Forme en cours de tracé */}
                    {currentShape && (
                        <div 
                            className={`absolute border-2 border-white border-dashed pointer-events-none ${currentShape.type === 'circle' ? 'rounded-full' : ''}`}
                            style={{ left: currentShape.x, top: currentShape.y, width: currentShape.w, height: currentShape.h }}
                        ></div>
                    )}
                </div>
            </div>

            {/* Panneau Calques */}
            <div className="w-48 bg-[#383838] border-l border-[#2b2b2b] flex flex-col text-xs text-gray-300">
                <div className="bg-[#2b2b2b] px-3 py-2 font-bold flex items-center gap-2"><Layers size={14}/> LAYERS ({layers.length})</div>
                <div className="flex-1 p-2 space-y-1 overflow-y-auto">
                    {layers.map((l, i) => (
                        <div key={l.id} className="flex items-center gap-2 p-2 bg-[#535353] rounded border border-gray-600">
                            <div className="w-4 h-4 rounded-sm" style={{backgroundColor: l.fill || '#ccc'}}></div>
                            <span>{l.type} {i+1}</span>
                        </div>
                    ))}
                </div>
                <div className="p-4 bg-[#282828] border-t border-gray-600 mt-auto">
                    <div className="text-gray-400 mb-2 uppercase text-[10px] font-bold">Progression</div>
                    <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden"><div className="bg-gradient-to-r from-pink-500 to-purple-500 h-full" style={{width: `${myData.progress}%`}}></div></div>
                </div>
            </div>
        </div>
    );
};

const ToolButton = ({ icon: Icon, active, onClick, color = "text-gray-400" }) => (
    <button onClick={onClick} className={`p-2 rounded transition-all ${active ? 'bg-black text-white shadow-inner' : 'hover:bg-[#4a4a4a] ' + color}`}><Icon size={20} /></button>
);

const TrendrWrapper = () => {
    const { gainInspiration } = useContext(CreaLocalContext);
    return <TrendrApp onGainInspiration={gainInspiration} />;
};

const CreaView = () => {
    const [inspiration, setInspiration] = useState(100);
    const gainInspiration = (amount) => setInspiration(prev => Math.min(100, prev + amount));
    const consumeInspiration = (amount) => setInspiration(prev => Math.max(0, prev - amount));

    const apps = useMemo(() => [
        { id: 'photoshop', title: 'Ps CS6', icon: PenTool, component: PhotoshopApp },
        { id: 'trendr', title: 'Trendr', icon: Zap, component: TrendrWrapper },
        { id: 'gmail', title: 'Gmail', icon: Mail, component: MailApp }
    ], []);

    return (
        <CreaLocalContext.Provider value={{ inspiration, gainInspiration, consumeInspiration }}>
            <Desktop apps={apps} />
        </CreaLocalContext.Provider>
    );
};

export default CreaView;