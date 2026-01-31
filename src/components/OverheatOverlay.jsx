import React from 'react';
import { useGame } from '../GameContext';

const OverheatOverlay = () => {
    const { serverHeat } = useGame();

    // Opacité progressive
    const opacity = Math.max(0, (serverHeat - 50) / 50); // Commence à 50°C, max à 100°C

    if (serverHeat < 50) return null;

    return (
        // Z-INDEX BOOSTÉ À 100000 pour passer au dessus du Header Solo (z-9999)
        <div 
            className="fixed inset-0 pointer-events-none z-[100000] flex items-center justify-center overflow-hidden"
            style={{ opacity: opacity }}
        >
            {/* Vignette Rouge Pulsante */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(255,0,0,0.2)_50%,rgba(255,0,0,0.6)_100%)] animate-pulse"></div>
            
            {/* Effet de chaleur (Bruit + Rouge) */}
            <div className="absolute inset-0 bg-red-900/10 mix-blend-overlay"></div>

            {/* Alerte Critique si > 90% */}
            {serverHeat > 90 && (
                <div className="text-red-500 font-black text-6xl tracking-widest uppercase animate-bounce opacity-50 drop-shadow-[0_0_10px_red]">
                    DANGER
                </div>
            )}
        </div>
    );
};

export default OverheatOverlay;