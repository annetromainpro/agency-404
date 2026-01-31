require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());

const server = http.createServer(app);

// --- CONFIGURATION CORS ---
const io = new Server(server, { 
    cors: { origin: "*", methods: ["GET", "POST"] } 
});

// --- MONGODB ---
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ CONNECTÉ À MONGODB"))
    .catch(err => console.error("❌ ERREUR MONGODB:", err));

const scoreSchema = new mongoose.Schema({
    name: String,
    score: Number,
    grade: String,
    date: { type: Date, default: Date.now }
});

const SoloScore = mongoose.model('SoloScore', scoreSchema);
const AgencyScore = mongoose.model('AgencyScore', scoreSchema);

// Récupère le Top 50
async function getLeaderboards() {
    try {
        const solo = await SoloScore.find().sort({ score: -1 }).limit(50);
        const agency = await AgencyScore.find().sort({ score: -1 }).limit(50);
        return { solo, agency };
    } catch (e) {
        console.error("Erreur lecture scores:", e);
        return { solo: [], agency: [] };
    }
}

// --- GAME LOGIC ---
const WORDS = ["PASSION", "NATURE", "CONFIANCE", "LUXE", "TECH", "ROYAL"];
const COLORS = ["rouge", "vert", "bleu", "jaune"];
const SHAPES = ["carré", "rond", "triangle"];

function generateCode() { return Math.floor(1000 + Math.random() * 9000).toString(); }
function generateRoomId() { return Math.random().toString(36).substring(2, 7).toUpperCase(); }

function generateBrandBook() {
    let book = {};
    WORDS.forEach(word => {
        book[word] = [
            { color: COLORS[Math.floor(Math.random() * COLORS.length)], shape: SHAPES[Math.floor(Math.random() * SHAPES.length)] },
            { color: COLORS[Math.floor(Math.random() * COLORS.length)], shape: SHAPES[Math.floor(Math.random() * SHAPES.length)] }
        ];
    });
    return book;
}

const socketToRoom = {};
const rooms = {};

function createGameState(mode, agencyName) {
    return {
        status: 'waiting',
        mode, agencyName, budget: 100, timeLeft: 300, finished: false, score: null,
        brandBook: generateBrandBook(), currentBrief: { word: "", requirements: [] },
        serverHeat: 0, assetsReady: false, apiKey: generateCode(), securityLock: false,
        adminCode: "", nextCheckpoint: 25, activeCrisis: null, crisisCode: null,
        players: [],
        team: {
            dev: { name: "En attente...", progress: 0, blocked: false, isHuman: false, isReady: false },
            crea: { name: "En attente...", progress: 0, blocked: false, isHuman: false, isReady: false },
            strat: { name: "En attente...", progress: 0, blocked: false, isHuman: false, isReady: false }
        }
    };
}

function rotateBrief(state) {
    const keys = Object.keys(state.brandBook);
    const randomWord = keys[Math.floor(Math.random() * keys.length)];
    state.currentBrief = { word: randomWord, requirements: state.brandBook[randomWord] };
}

function checkVictory(roomId) {
    if (!rooms[roomId]) return;
    const state = rooms[roomId].state;
    if (state.team.dev.progress >= 100 && state.team.crea.progress >= 100) finishGame(roomId);
}

// --- FIN DU JEU & SAUVEGARDE ---
async function finishGame(roomId) {
    const state = rooms[roomId].state;
    state.finished = true;
    
    let rawScore = (state.timeLeft * 10) + (state.budget * 50);
    let grade = rawScore > 4000 ? "S" : rawScore > 3000 ? "A" : rawScore > 2000 ? "B" : "C";
    state.score = { points: rawScore, grade };

    // --- CORRECTION PSEUDO ---
    // En solo, on force le nom du joueur (le premier dans la liste)
    let nameToSave = state.agencyName;
    if (state.mode === 'solo' && state.players.length > 0) {
        nameToSave = state.players[0].name; 
    }

    console.log(`💾 TENTATIVE SAUVEGARDE : ${nameToSave} - ${rawScore} pts`);

    try {
        if (state.mode === 'solo') {
            await new SoloScore({ name: nameToSave, score: rawScore, grade }).save();
        } else {
            await new AgencyScore({ name: nameToSave, score: rawScore, grade }).save();
        }
        console.log("✅ SCORE SAUVEGARDÉ EN BDD !");
    } catch (e) {
        console.error("❌ ERREUR SAUVEGARDE:", e);
    }

    // On renvoie le leaderboard mis à jour
    const leaderboards = await getLeaderboards();
    
    // On ajoute le nom utilisé pour que le Front puisse surligner le bon score
    state.savedName = nameToSave; 

    io.to(roomId).emit('game_update', { ...state, leaderboards });
    clearInterval(rooms[roomId].interval);
}

async function startGameLoop(roomId) {
    if (rooms[roomId].interval) clearInterval(rooms[roomId].interval);
    
    const state = rooms[roomId].state;
    state.status = 'playing';
    state.adminCode = generateCode();
    rotateBrief(state);
    
    const leaderboards = await getLeaderboards();
    io.to(roomId).emit('game_start', { ...state, leaderboards });

    rooms[roomId].interval = setInterval(async () => {
        if (state.status === 'finished') return;

        state.timeLeft -= 1;
        if (state.timeLeft <= 0) { state.budget = 0; await finishGame(roomId); return; }

        let heatIncrease = 0.5 + Math.random(); 
        if (Math.random() > 0.95) heatIncrease += 5;
        state.serverHeat = Math.min(100, state.serverHeat + heatIncrease);

        if (state.serverHeat >= 100) {
            state.budget = Math.max(0, state.budget - 1);
            if (!state.team.crea.blocked) { state.team.crea.blocked = true; state.team.crea.blockageType = "SERVER_OFFLINE"; }
        } else if (state.serverHeat < 95 && state.team.crea.blockageType === "SERVER_OFFLINE") {
            state.team.crea.blocked = false; state.team.crea.blockageType = null;
        }

        if (!state.activeCrisis && Math.random() > 0.985) {
            state.activeCrisis = Math.random() > 0.5 ? 'FIREWALL' : 'COPYRIGHT';
            state.crisisCode = generateCode();
        }
        
        io.to(roomId).emit('game_update', { ...state }); 
    }, 1000);
}

io.on('connection', (socket) => {
    
    socket.on('create_room', async ({ mode, agencyName, playerName }) => {
        const roomId = generateRoomId();
        rooms[roomId] = { state: createGameState(mode, agencyName), interval: null };
        socket.join(roomId);
        socketToRoom[socket.id] = roomId;

        const state = rooms[roomId].state;
        state.players.push({ id: socket.id, name: playerName, role: null });

        const leaderboards = await getLeaderboards();

        if (mode === 'solo') {
            ['dev', 'crea', 'strat'].forEach(r => { state.team[r].isHuman = true; state.team[r].name = playerName; });
            socket.emit('room_joined', { roomId, role: 'solo_master' });
            startGameLoop(roomId);
        } else {
            socket.emit('room_joined', { roomId, role: null });
            io.to(roomId).emit('lobby_update', { ...state, leaderboards });
        }
    });

    socket.on('join_room_request', async ({ roomId, playerName }) => {
        const room = rooms[roomId];
        if (!room) { socket.emit('error', 'Code Room Invalide'); return; }
        if (room.state.status !== 'waiting') { socket.emit('error', 'Partie déjà commencée'); return; }

        socket.join(roomId);
        socketToRoom[socket.id] = roomId;
        room.state.players.push({ id: socket.id, name: playerName, role: null });
        
        const leaderboards = await getLeaderboards();
        socket.emit('room_joined', { roomId, role: null }); 
        io.to(roomId).emit('lobby_update', { ...room.state, leaderboards });
    });

    socket.on('pick_role', async ({ roomId, role }) => {
        const room = rooms[roomId];
        if (!room) return;
        const player = room.state.players.find(p => p.id === socket.id);
        if (!player) return;
        if (room.state.team[role].isHuman) { socket.emit('error', 'Rôle déjà pris !'); return; }

        if (player.role) {
            room.state.team[player.role].isHuman = false;
            room.state.team[player.role].name = "En attente...";
            room.state.team[player.role].isReady = false; 
        }

        player.role = role;
        room.state.team[role].isHuman = true;
        room.state.team[role].name = player.name;
        room.state.team[role].isReady = false; 

        socket.emit('role_confirmed', role);
        const leaderboards = await getLeaderboards();
        io.to(roomId).emit('lobby_update', { ...room.state, leaderboards });
    });

    socket.on('toggle_ready', async ({ roomId, role }) => {
        const room = rooms[roomId];
        if (!room) return;
        room.state.team[role].isReady = !room.state.team[role].isReady;
        
        const t = room.state.team;
        const allRolesTaken = t.dev.isHuman && t.crea.isHuman && t.strat.isHuman;
        const allRolesReady = t.dev.isReady && t.crea.isReady && t.strat.isReady;

        const leaderboards = await getLeaderboards();
        io.to(roomId).emit('lobby_update', { ...room.state, leaderboards });

        if (allRolesTaken && allRolesReady) { startGameLoop(roomId); }
    });

    socket.on('disconnect', () => {
        const roomId = socketToRoom[socket.id];
        if (roomId && rooms[roomId]) {
            const room = rooms[roomId];
            const player = room.state.players.find(p => p.id === socket.id);
            if (player) {
                if (room.interval) clearInterval(room.interval);
                io.to(roomId).emit('game_aborted', { reason: `Le joueur ${player.name} s'est déconnecté.` });
                delete rooms[roomId];
            }
        }
        delete socketToRoom[socket.id];
    });

    const getRoom = () => rooms[socketToRoom[socket.id]];

    socket.on('action_process_spam', (isCorrect) => { const r = getRoom(); if(r) { if(isCorrect) r.state.budget+=2; else r.state.budget-=5; } });
    socket.on('action_cool_server', () => { const r = getRoom(); if(r) { r.state.serverHeat=0; if(r.state.team.crea.blockageType==="SERVER_OFFLINE") r.state.team.crea.blocked=false; } });
    socket.on('action_solve_crisis', (code) => { const r = getRoom(); if(r && code===r.state.crisisCode) { r.state.activeCrisis=null; r.state.budget+=10; } });
    socket.on('action_dev_security_unlock', (code) => { const r = getRoom(); if(r && code===r.state.adminCode) { r.state.securityLock=false; r.state.nextCheckpoint+=25; r.state.adminCode=generateCode(); } });
    
    socket.on('action_dev_validate', (success) => {
        const r = getRoom(); if(!r) return;
        if(success) {
            let p = Math.min(100, r.state.team.dev.progress+5);
            if(p >= r.state.nextCheckpoint && p < 100) { p=r.state.nextCheckpoint; r.state.securityLock=true; r.state.adminCode=generateCode(); }
            if(p >= 75 && !r.state.assetsReady) {} else { r.state.team.dev.progress=p; }
        } else { r.state.team.dev.blocked=true; r.state.team.dev.blockageType="BSOD"; r.state.budget-=5; }
        checkVictory(socketToRoom[socket.id]);
        io.to(socketToRoom[socket.id]).emit('game_update', r.state);
    });

    socket.on('action_crea_validate', (shapes) => {
        const r = getRoom(); if(!r) return;
        const target = r.state.currentBrief.requirements;
        if(shapes && shapes.length === target.length) {
             let allMatch = true; let usedIndices = [];
             target.forEach(req => {
                 const matchIndex = shapes.findIndex((us, idx) => !usedIndices.includes(idx) && us.color === req.color && us.shape === req.shape);
                 if (matchIndex === -1) allMatch = false; else usedIndices.push(matchIndex);
             });
             if (allMatch) {
                 r.state.team.crea.progress = Math.min(100, r.state.team.crea.progress + 20); r.state.assetsReady = true;
                 checkVictory(socketToRoom[socket.id]);
                 if(!r.state.finished) rotateBrief(r.state);
             } else { r.state.team.crea.blocked = true; r.state.budget -= 10; }
        } else { r.state.team.crea.blocked = true; r.state.budget -= 10; }
        io.to(socketToRoom[socket.id]).emit('game_update', r.state);
    });

    socket.on('action_unlock', (role) => { const r = getRoom(); if(r && r.state.budget>=10) { r.state.budget-=10; r.state.team[role].blocked=false; } });
    socket.on('action_buy_boost', () => { const r = getRoom(); if(r && r.state.budget>=30) { r.state.budget-=30; r.state.team.dev.progress+=10; r.state.team.crea.progress+=10; } });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`✅ SERVER READY ON PORT ${PORT}`));