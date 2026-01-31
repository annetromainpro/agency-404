import React, { useState, useEffect } from 'react';
import { useGame } from './GameContext';
import { Trash2, Archive, AlertCircle, RefreshCw, Star, Mail } from 'lucide-react';

const RAW_EMAILS = [
    { id: 1, subject: "💰 Héritage Prince Nigérian", type: "spam", from: "Prince Al-Yab" },
    { id: 2, subject: "💊 Enlarge your... productivity", type: "spam", from: "Dr. Spamacus" },
    { id: 3, subject: "✅ Validation Maquette V3", type: "legit", from: "Client Dupont" },
    { id: 4, subject: "🎁 Gagnez un iPhone 15", type: "spam", from: "Apple (Fake)" },
    { id: 5, subject: "📅 Réunion Lundi 9h", type: "legit", from: "Boss" },
    { id: 6, subject: "📢 Facture EDF Impayée", type: "legit", from: "EDF Service" },
    { id: 7, subject: "Brief_final_final_v2.pdf", type: "legit", from: "Chef de Projet" },
    { id: 8, subject: "🎰 CASINO FREE SPINS", type: "spam", from: "Golden Palace" },
    { id: 9, subject: "Urgent : Bug Prod", type: "legit", from: "Support Tech" },
    { id: 10, subject: "💋 Singles in your area", type: "spam", from: "Lover69" },
    { id: 11, subject: "Facture Adobe Creative Cloud", type: "legit", from: "Adobe" },
    { id: 12, subject: "Virement reçu : 5000$", type: "legit", from: "Comptabilité" },
    { id: 13, subject: "🚀 Devenez Riche en Crypto", type: "spam", from: "Elon Musk (Real)" },
    { id: 14, subject: "Maquette moche, à refaire", type: "legit", from: "Client Pas Content" },
    { id: 15, subject: "Colis en attente (Arnaque)", type: "spam", from: "DHL-Fake" },
    { id: 16, subject: "Photos du chat", type: "legit", from: "Maman" },
    { id: 17, subject: "Mise en demeure", type: "legit", from: "Juridique" },
    { id: 18, subject: "Gagnez une Tesla", type: "spam", from: "ContestWinner" },
    { id: 19, subject: "Planning vacances", type: "legit", from: "RH" },
    { id: 20, subject: "OFFRE SPECIALE VIAGRA", type: "spam", from: "Pharmastore" },
];

const MailApp = () => {
    const { processSpam, budget } = useGame();
    const [currentMail, setCurrentMail] = useState(null);
    const [feedback, setFeedback] = useState(null);

    const nextMail = () => {
        let random;
        // ANTI-DOUBLON : On cherche tant qu'on tombe sur le même
        do {
            random = RAW_EMAILS[Math.floor(Math.random() * RAW_EMAILS.length)];
        } while (currentMail && random.id === currentMail.id);
        
        // On recrée un objet pour changer la référence
        setCurrentMail({ ...random, timestamp: Date.now() });
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
        <div className="h-full flex flex-col bg-white overflow-hidden font-sans">
            <div className="bg-[#f1f3f4] p-2 border-b flex items-center gap-4 shrink-0">
                <span className="text-red-600 font-bold text-lg flex items-center gap-1">M <span className="text-gray-500 font-normal text-sm">Gmail</span></span>
                <input type="text" placeholder="Rechercher" className="bg-[#eaf1fb] border-none rounded px-4 py-2 w-full text-sm outline-none focus:bg-white focus:shadow-sm transition-all" />
            </div>

            <div className="flex h-full overflow-hidden">
                <div className="w-48 py-2 pr-2 hidden md:flex flex-col shrink-0 bg-white">
                    <button className="bg-[#fce8e6] text-[#d93025] font-bold w-full text-left px-6 py-2 rounded-r-full mb-1 text-sm flex items-center gap-2">
                        <Mail size={16}/> Boîte (1)
                    </button>
                    <div className="mt-auto px-6 pb-4 text-xs text-gray-400">
                        <p>Trésorerie Agence</p>
                        <p className="text-lg font-bold text-green-600">{budget} $</p>
                    </div>
                </div>

                <div className="flex-1 flex flex-col bg-white relative overflow-hidden rounded-tl-2xl border-t border-l border-gray-200 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]">
                    <div className="flex gap-1 p-2 border-b shrink-0 bg-white">
                        <button onClick={() => handleAction('archive')} className="p-2 hover:bg-gray-100 rounded-full text-gray-600" title="Archiver (Legit)"><Archive size={18} /></button>
                        <button onClick={() => handleAction('trash')} className="p-2 hover:bg-gray-100 rounded-full text-gray-600" title="Supprimer (Spam)"><Trash2 size={18} /></button>
                        <div className="border-l mx-2 h-6 self-center"></div>
                        <button onClick={nextMail} className="p-2 hover:bg-gray-100 rounded-full text-gray-600"><RefreshCw size={18} /></button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-white flex flex-col items-center">
                        {feedback && (
                            <div className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-3 rounded-lg shadow-2xl text-white font-bold z-50 animate-bounce ${feedback.includes('✅') ? 'bg-green-600' : 'bg-red-600'}`}>
                                {feedback}
                            </div>
                        )}
                        
                        <div className="w-full max-w-2xl bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-6">
                                <h2 className="font-normal text-2xl mb-4 text-gray-900">{currentMail?.subject}</h2>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">{currentMail?.from.charAt(0)}</div>
                                    <div className="flex-1">
                                        <div className="font-bold text-sm text-gray-900">{currentMail?.from}</div>
                                        <div className="text-xs text-gray-500">&lt;{currentMail?.from.toLowerCase().replace(/[^a-z]/g, '')}@mail.com&gt;</div>
                                    </div>
                                    <div className="text-xs text-gray-400">10:42</div>
                                </div>
                                <div className="text-sm text-gray-600 leading-relaxed mb-8 whitespace-pre-wrap font-serif">
                                    Bonjour,<br/><br/>Voici le message que vous attendiez.<br/>Merci de traiter cette demande.<br/><br/>Cordialement,<br/>{currentMail?.from}
                                </div>
                                <div className="flex gap-4 pt-4 border-t">
                                    <button onClick={() => handleAction('archive')} className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 py-3 rounded-lg font-bold flex items-center justify-center gap-2 border border-blue-200 transition-colors"><Archive size={18} /> C'EST LEGIT</button>
                                    <button onClick={() => handleAction('trash')} className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 py-3 rounded-lg font-bold flex items-center justify-center gap-2 border border-red-200 transition-colors"><AlertCircle size={18} /> C'EST DU SPAM</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MailApp;