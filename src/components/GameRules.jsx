import React, { useState } from 'react';
import { BrainCircuit, Code, PenTool, X, ShieldCheck, Siren, Server, DollarSign, Zap, AlertTriangle, Coffee, Lock } from 'lucide-react';

const MiniWindow = ({ title, color, children }) => (
    <div className={`border rounded bg-gray-900 overflow-hidden text-[10px] font-mono shadow-lg ${color} mb-2`}>
        <div className={`px-2 py-1 text-white font-bold flex justify-between ${color.replace('border', 'bg').replace('400', '600').replace('500', '700')}`}>
            <span>{title}</span>
            <div className="flex gap-1"><div className="w-2 h-2 rounded-full bg-white/50"></div></div>
        </div>
        <div className="p-2 text-gray-300 relative flex flex-col gap-1">
            {children}
        </div>
    </div>
);

const GameRules = ({ onClose }) => {
    const [tab, setTab] = useState('general'); // general | roles | economy

    return (
        <div className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4 backdrop-blur-md animate-fadeIn">
            <div className="bg-[#0f172a] w-full max-w-6xl h-[90vh] rounded-2xl border border-gray-700 shadow-2xl flex flex-col overflow-hidden relative">
                
                {/* Header */}
                <div className="p-6 border-b border-gray-700 flex justify-between items-center bg-gray-950">
                    <div>
                        <h2 className="text-3xl font-black italic tracking-tighter text-white">AGENCY <span className="text-blue-500">404</span></h2>
                        <p className="text-xs text-gray-400 font-mono">MANUEL OPÉRATIONNEL V3.0</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-full transition-colors"><X size={24} className="text-white" /></button>
                </div>

                {/* Navigation Onglets */}
                <div className="flex border-b border-gray-700 bg-gray-900">
                    <button onClick={() => setTab('general')} className={`flex-1 py-4 font-bold text-sm uppercase tracking-widest transition-colors ${tab === 'general' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-white hover:bg-gray-800'}`}>1. Mission & Survie</button>
                    <button onClick={() => setTab('roles')} className={`flex-1 py-4 font-bold text-sm uppercase tracking-widest transition-colors ${tab === 'roles' ? 'bg-purple-600 text-white' : 'text-gray-500 hover:text-white hover:bg-gray-800'}`}>2. Fiches de Poste</button>
                    <button onClick={() => setTab('economy')} className={`flex-1 py-4 font-bold text-sm uppercase tracking-widest transition-colors ${tab === 'economy' ? 'bg-green-600 text-white' : 'text-gray-500 hover:text-white hover:bg-gray-800'}`}>3. Bonus & Malus</button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 bg-[#0f172a]">
                    
                    {/* --- ONGLET 1 : GÉNÉRAL --- */}
                    {tab === 'general' && (
                        <div className="space-y-8 animate-fadeIn">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2"><ShieldCheck className="text-blue-500"/> L'OBJECTIF</h3>
                                    <p className="text-gray-300 leading-relaxed mb-4">
                                        Vous êtes une agence web au bord du chaos. Pour survivre, vous devez livrer le projet (remplir les barres de progression Développeur et Créatif à <strong>100%</strong>) avant la fin du temps imparti ou la faillite.
                                    </p>
                                    <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg">
                                        <h4 className="font-bold text-blue-400 text-sm uppercase mb-2">La règle d'or : COMMUNICATION</h4>
                                        <p className="text-xs text-gray-400">
                                            L'information est fragmentée. Le Stratège connait la demande client, mais ne peut rien produire. Le Créatif et le Développeur peuvent produire, mais ne savent pas quoi faire sans le Stratège.
                                            <br/><strong className="text-white">PARLEZ-VOUS CONSTAMMENT !</strong>
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg flex gap-4">
                                        <Siren className="text-red-500 shrink-0" size={32} />
                                        <div>
                                            <h4 className="font-bold text-red-400">GESTION DE CRISE</h4>
                                            <p className="text-xs text-gray-400 mt-1">
                                                Des alertes <strong>(Firewall, Copyright)</strong> vont bloquer totalement un joueur. Pour le débloquer, un AUTRE joueur possède un <strong>Code de Sécurité</strong> sur son écran. Il doit le dicter à haute voix.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="bg-orange-900/20 border border-orange-500/30 p-4 rounded-lg flex gap-4">
                                        <Server className="text-orange-500 shrink-0" size={32} />
                                        <div>
                                            <h4 className="font-bold text-orange-400">SURCHAUFFE SERVEUR</h4>
                                            <p className="text-xs text-gray-400 mt-1">
                                                La température monte en permanence. À <strong>100°C</strong>, c'est le <strong>BLACKOUT</strong> (écran noir pour le Stratège et le Créatif). Le Développeur doit impérativement refroidir le serveur via l'app "Server Mgr".
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- ONGLET 2 : RÔLES --- */}
                    {tab === 'roles' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
                            
                            {/* STRAT */}
                            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                                <div className="flex items-center gap-3 mb-4 text-yellow-500">
                                    <BrainCircuit size={32} />
                                    <h3 className="font-black text-xl uppercase">Stratège</h3>
                                </div>
                                <ul className="text-sm text-gray-300 space-y-2 mb-4 list-disc pl-4">
                                    <li><strong>Brief Decrypter :</strong> Utilisez la molette pour trouver la fréquence claire et lire le mot clé du client.</li>
                                    <li><strong>Brand Book :</strong> Traduisez ce mot clé en consignes (ex: "NATURE" = Rond Vert + Triangle Bleu).</li>
                                    <li><strong>Codes Admin :</strong> Donnez les codes de déverrouillage au Dev quand il est bloqué (Security Check).</li>
                                </ul>
                                <MiniWindow title="GanttProject" color="border-yellow-600">
                                    <div className="text-center text-xs">Signal: "ROYAL"</div>
                                    <div className="text-[8px] bg-yellow-900/50 text-yellow-200 p-1 mt-1 rounded">
                                        ROYAL -> ■ Carré Rouge + ▲ Triangle Jaune
                                    </div>
                                </MiniWindow>
                            </div>

                            {/* DEV */}
                            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                                <div className="flex items-center gap-3 mb-4 text-blue-500">
                                    <Code size={32} />
                                    <h3 className="font-black text-xl uppercase">Développeur</h3>
                                </div>
                                <ul className="text-sm text-gray-300 space-y-2 mb-4 list-disc pl-4">
                                    <li><strong>VS Code :</strong> Résolvez des bugs de syntaxe (QCM) pour avancer le projet.</li>
                                    <li><strong>Maintenance :</strong> Surveillez la température ! Faites les mini-jeux (Câbles / Update) pour refroidir.</li>
                                    <li><strong>Sécurité :</strong> À 25%, 50%, 75%, un firewall vous bloque. Demandez le code au Stratège.</li>
                                </ul>
                                <MiniWindow title="Server Mgr" color="border-blue-600">
                                    <div className="flex justify-between text-xs font-bold text-red-400">
                                        <span>TEMP</span><span>98°C ⚠️</span>
                                    </div>
                                    <div className="w-full bg-gray-700 h-1 mt-1"><div className="w-[98%] bg-red-500 h-full"></div></div>
                                    <div className="mt-2 text-center bg-blue-600 text-white rounded text-[8px] py-1">OPEN MAINTENANCE</div>
                                </MiniWindow>
                            </div>

                            {/* CREA */}
                            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                                <div className="flex items-center gap-3 mb-4 text-pink-500">
                                    <PenTool size={32} />
                                    <h3 className="font-black text-xl uppercase">Créatif</h3>
                                </div>
                                <ul className="text-sm text-gray-300 space-y-2 mb-4 list-disc pl-4">
                                    <li><strong>Photoshop :</strong> Dessinez les logos demandés par le Stratège (superposition de formes).</li>
                                    <li><strong>Trendr :</strong> Votre énergie (Inspiration) baisse vite. Triez des images par couleur pour recharger.</li>
                                    <li><strong>Export :</strong> Coûte 40 points d'Inspiration. Soyez sûr de votre coup !</li>
                                </ul>
                                <MiniWindow title="Trendr" color="border-pink-600">
                                    <div className="flex gap-1 justify-center mb-1">
                                        <div className="w-4 h-3 bg-red-200 rounded"></div>
                                        <div className="w-4 h-3 bg-blue-200 rounded border border-blue-500"></div>
                                        <div className="w-4 h-3 bg-green-200 rounded"></div>
                                    </div>
                                    <div className="text-center text-[8px] text-gray-400">Trier l'image bleue...</div>
                                </MiniWindow>
                            </div>

                        </div>
                    )}

                    {/* --- ONGLET 3 : ÉCONOMIE --- */}
                    {tab === 'economy' && (
                        <div className="space-y-6 animate-fadeIn">
                            
                            <div className="bg-green-900/10 border border-green-500/30 p-6 rounded-xl">
                                <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2"><DollarSign/> LE BUDGET (Votre Vie)</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="text-sm font-bold text-white uppercase mb-2">Gains (+)</h4>
                                        <ul className="text-sm text-green-300 space-y-1">
                                            <li>+ 2$ : Traiter un mail correctement (Spam/Legit)</li>
                                            <li>+ 10$ : Résoudre une crise (Code)</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white uppercase mb-2">Pertes (-)</h4>
                                        <ul className="text-sm text-red-300 space-y-1">
                                            <li>- 1$ / sec : Coût de fonctionnement normal</li>
                                            <li>- 5$ : Erreur de code (Dev) ou Erreur Mail</li>
                                            <li>- 10$ : Erreur de logo (Créa)</li>
                                            <li>- 1$ / sec : Pénalité Surchauffe (si > 100°C)</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-purple-900/10 border border-purple-500/30 p-6 rounded-xl">
                                    <h3 className="text-lg font-bold text-purple-400 mb-2 flex items-center gap-2"><Zap/> INSPIRATION (Créatif)</h3>
                                    <p className="text-sm text-gray-400 mb-2">Le carburant du graphiste.</p>
                                    <ul className="text-sm text-gray-300 space-y-1">
                                        <li><span className="text-red-400">- 2 pts</span> : Par coup de pinceau</li>
                                        <li><span className="text-red-400 font-bold">- 40 pts</span> : Par export de logo (Attention !)</li>
                                        <li><span className="text-green-400 font-bold">+ 25 pts</span> : Par tri réussi sur Trendr</li>
                                        <li><span className="text-red-400">- 10 pts</span> : Par erreur de tri</li>
                                    </ul>
                                </div>

                                <div className="bg-blue-900/10 border border-blue-500/30 p-6 rounded-xl">
                                    <h3 className="text-lg font-bold text-blue-400 mb-2 flex items-center gap-2"><Coffee/> BOOSTS</h3>
                                    <p className="text-sm text-gray-400 mb-2">Le Stratège peut acheter du café.</p>
                                    <ul className="text-sm text-gray-300 space-y-1">
                                        <li><strong>Coût :</strong> 30$</li>
                                        <li><strong>Effet :</strong> +10% de progression immédiate pour le Dev et le Créa.</li>
                                        <li><em>À utiliser en fin de partie pour le rush final !</em></li>
                                    </ul>
                                </div>
                            </div>

                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default GameRules;