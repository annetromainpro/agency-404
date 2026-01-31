import React from 'react';
import { GameProvider, useGame } from './GameContext';
import Lobby from './Lobby';
import DevView from './DevView';
import CreaView from './CreaView';
import StratView from './StratView';
import SoloGameView from './SoloGameView';
import ResultsView from './ResultsView';
import OverheatOverlay from './components/OverheatOverlay';
import { AlertTriangle } from 'lucide-react';

// --- MODIFICATION ICI : Suppression de animate-bounce ---
const DisconnectOverlay = ({ reason }) => (
    <div className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm transition-opacity duration-300">
        <div className="bg-gray-900 border-2 border-red-600 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl transform scale-100 transition-transform">
            <AlertTriangle size={64} className="mx-auto text-red-500 mb-6" />
            <h2 className="text-3xl font-black text-white mb-2 uppercase">Partie Interrompue</h2>
            <p className="text-gray-300 mb-8">{reason}</p>
            <button 
                onClick={() => window.location.reload()} 
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full transition-colors shadow-lg hover:scale-105 transform duration-200"
            >
                Retour au Menu
            </button>
        </div>
    </div>
);

const GameManager = () => {
    const { myRole, gameFinished, isGameRunning, gameMode, disconnectError } = useGame();

    if (disconnectError) return <DisconnectOverlay reason={disconnectError} />;
    if (gameFinished) return <ResultsView />;
    if (!isGameRunning) return <Lobby />;

    if (gameMode === 'solo') return <SoloGameView />;

    switch (myRole) {
        case 'dev': return <DevView />;
        case 'crea': return <CreaView />;
        case 'strat': return <StratView />;
        default: return <div className="text-white text-center mt-20">Chargement...</div>;
    }
};

const App = () => (
  <GameProvider>
    <div className="h-screen w-screen overflow-hidden bg-black">
        <OverheatOverlay /> 
        <GameManager />
    </div>
  </GameProvider>
);

export default App;