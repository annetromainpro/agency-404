export const FAKE_CODE = `
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

// Initializing Core Systems...
const SYSTEM_CORE = {
    cpu: '100%',
    memory: 'allocating...',
    coffee: 'needed'
};

function deployProject(clientNeeds) {
    if (!clientNeeds.budget) {
        throw new Error("Pas d'argent, pas de projet");
    }
    
    // Optimizing pixels
    const design = renderGraphics('4k');
    
    return (
        <div className="awesome-project">
            <h1>{clientNeeds.title}</h1>
            <p>Made with passion and caffeine</p>
            {/* TODO: Fix the bugs later */}
        </div>
    );
}

// Hacking the mainframe...
// Access granted.
// Downloading RAM...
// CSS is awesome but hard to center.
.center-div {
    display: flex;
    justify-content: center;
    align-items: center;
}

// Deadline approaching...
// Panik mode: ON
const stressLevel = 9999;
while(stressLevel > 0) {
    codeFaster();
}
`;