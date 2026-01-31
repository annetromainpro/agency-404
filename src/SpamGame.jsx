import React, { useState, useEffect } from 'react';
import { useGame } from './GameContext';
import { Mail, Star, Trash2, Archive, AlertCircle, RefreshCw } from 'lucide-react';

const EMAILS = [
    { subject: "💰 Héritage Prince Nigérian", type: "spam", from: "Prince Al-Yab" },
    { subject: "💊 Enlarge your... productivity", type: "spam", from: "Dr. Spamacus" },
    { subject: "✅ Validation Maquette V3", type: "legit", from: "Client Dupont" },
    { subject: "🎁 Gagnez un iPhone 15", type: "spam", from: "Apple (Fake)" },
    { subject: "📅 Réunion Lundi 9h", type: "legit", from: "Boss" },
    { subject: "📢 Facture EDF Impayée", type: "legit", from: "EDF Service" },
    { subject: "Brief_final_final_v2.pdf", type: "legit", from: "Chef de Projet" },
    { subject: "🎰 CASINO FREE SPINS", type: "spam", from: "Golden Palace" },
];

const MailApp = () => {
    const { processSpam, budget } = useGame();
    const [currentMail, setCurrentMail] = useState(null);
    const [feedback, setFeedback] = useState(null);

    const nextMail = () => {
        const random = EMAILS[Math.floor(Math.random() * EMAILS.length)];
        setCurrentMail({ ...random, id: Date.now() });
    };

    useEffect(() => { nextMail(); }, []);

    const handleAction = (action) => {
        if (!currentMail) return;
        const isCorrect = (action === 'trash' && currentMail.type === 'spam') || 
                          (action === 'archive' && currentMail.type === 'legit');
        processSpam(isCorrect);
        setFeedback(isCorrect ? "✅ TRAITÉ" : "❌ ERREUR");
        setTimeout(() => setFeedback(null), 500);
        nextMail();
    };

    return (
        <div className="h-full flex flex-col bg-white">
            {/* Header Gmail Style */}
            <div className="bg-[#f1f3f4] p-2 border-b flex items-center gap-4">
                <span className="text-red-600 font-bold text-lg flex items-center gap-1">M <span className="text-gray-500 font-normal text-sm">Gmail</span></span>
                <input type="text" placeholder="Rechercher dans les messages" className="bg-[#eaf1fb] border-none rounded px-4 py-1 w-full text-sm" disabled />
            </div>

            <div className="flex h-full">
                {/* Sidebar */}
                <div className="w-48 p-2 border-r hidden md:block">
                    <button className="bg-white hover:bg-gray-100 w-full text-left px-4 py-2 rounded-r-full font-bold text-red-600 bg-red-50 mb-2">📥 Boîte de réception (1)</button>
                    <button className="text-gray-600 w-full text-left px-4 py-2 hover:bg-gray-100 rounded-r-full">★ Messages suivis</button>
                    <button className="text-gray-600 w-full text-left px-4 py-2 hover:bg-gray-100 rounded-r-full">✈️ Envoyés</button>
                    <div className="mt-auto pt-4 text-xs text-gray-400 pl-4">Budget: {budget}$</div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col p-4 bg-white relative">
                    {/* Toolbar */}
                    <div className="flex gap-2 mb-4 border-b pb-2">
                        <button onClick={() => handleAction('archive')} className="p-2 hover:bg-gray-100 rounded text-gray-600" title="Archiver (Legit)">
                            <Archive size={18} />
                        </button>
                        <button onClick={() => handleAction('trash')} className="p-2 hover:bg-gray-100 rounded text-gray-600" title="Supprimer (Spam)">
                            <Trash2 size={18} />
                        </button>
                        <div className="border-l mx-2"></div>
                        <button className="p-2 hover:bg-gray-100 rounded text-gray-600"><RefreshCw size={18} /></button>
                    </div>

                    {/* Email View */}
                    <div className="border rounded-lg p-6 shadow-sm flex-1 flex flex-col items-center justify-center bg-gray-50">
                        {feedback && (
                            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-3 rounded shadow-xl text-white font-bold z-10 ${feedback.includes('✅') ? 'bg-green-600' : 'bg-red-600'}`}>
                                {feedback}
                            </div>
                        )}
                        
                        <div className="w-full max-w-lg bg-white p-6 rounded shadow border">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="font-bold text-xl">{currentMail?.subject}</h2>
                                    <p className="text-sm text-gray-500">De: {currentMail?.from} &lt;{currentMail?.from.toLowerCase().replace(' ', '')}@internet.com&gt;</p>
                                </div>
                                <div className="bg-gray-100 text-xs px-2 py-1 rounded">19:42</div>
                            </div>
                            <div className="h-32 bg-gray-100 rounded mb-6 p-4 text-gray-400 text-sm">
                                [Contenu du message crypté...] <br/><br/>
                                Veuillez vérifier la légitimité de ce message pour débloquer les fonds de l'agence.
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={() => handleAction('trash')} className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 py-3 rounded font-bold flex items-center justify-center gap-2">
                                    <AlertCircle size={18} /> C'EST UN SPAM
                                </button>
                                <button onClick={() => handleAction('archive')} className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 py-3 rounded font-bold flex items-center justify-center gap-2">
                                    <Archive size={18} /> C'EST LEGIT
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MailApp;