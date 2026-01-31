import React, { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

const GameContext = createContext();

// CONFIGURATION URL
const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';
const socket = io(SERVER_URL);

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const [myRole, setMyRole] = useState(null);
  const [gameMode, setGameMode] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [agencyName, setAgencyName] = useState("");
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [disconnectError, setDisconnectError] = useState(null);
  
  const [lobbyData, setLobbyData] = useState(null);

  // Game States
  const [budget, setBudget] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentBrief, setCurrentBrief] = useState({});
  const [brandBook, setBrandBook] = useState({});
  const [gameFinished, setGameFinished] = useState(false);
  const [finalScore, setFinalScore] = useState(null);
  const [leaderboards, setLeaderboards] = useState({ solo: [], agency: [] });
  const [serverHeat, setServerHeat] = useState(0);
  const [assetsReady, setAssetsReady] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [securityLock, setSecurityLock] = useState(false);
  const [adminCode, setAdminCode] = useState("");
  const [activeCrisis, setActiveCrisis] = useState(null);
  const [crisisCode, setCrisisCode] = useState(null);

  const [teamStatus, setTeamStatus] = useState({
    dev: { name: "Bot", progress: 0, blocked: false, isReady: false },
    crea: { name: "Bot", progress: 0, blocked: false, isReady: false },
    strat: { name: "Bot", progress: 0, blocked: false, isReady: false }
  });

  useEffect(() => {
    // --- CORRECTION : Réception immédiate du classement ---
    socket.on('init_data', (data) => {
        if (data.leaderboards) {
            setLeaderboards(data.leaderboards);
        }
    });

    socket.on('lobby_update', (state) => {
        setLobbyData(state);
        setAgencyName(state.agencyName);
        if (state.leaderboards) {
            setLeaderboards(state.leaderboards);
        }
    });

    socket.on('room_joined', ({ roomId, role }) => {
        setRoomId(roomId);
        if (role === 'solo_master') {
            setIsGameRunning(true);
            setMyRole('solo_master');
        }
    });

    socket.on('role_confirmed', (role) => {
        setMyRole(role);
    });

    socket.on('game_start', (state) => {
        setIsGameRunning(true);
        updateGameState(state);
    });

    socket.on('game_update', (state) => updateGameState(state));
    socket.on('error', (msg) => alert(msg));

    socket.on('game_aborted', ({ reason }) => {
        setDisconnectError(reason);
        setIsGameRunning(false); 
    });

  }, []);

  const updateGameState = (state) => {
      setBudget(state.budget);
      setTimeLeft(state.timeLeft);
      setTeamStatus(state.team);
      setCurrentBrief(state.currentBrief || {});
      setBrandBook(state.brandBook || {});
      setGameFinished(state.finished);
      setFinalScore(state.score);
      
      if (state.leaderboards) setLeaderboards(state.leaderboards);
      
      setServerHeat(state.serverHeat || 0);
      setAssetsReady(state.assetsReady);
      setApiKey(state.apiKey);
      setSecurityLock(state.securityLock);
      setAdminCode(state.adminCode || "");
      setActiveCrisis(state.activeCrisis);
      setCrisisCode(state.crisisCode);
      setAgencyName(state.agencyName);
  };

  const createRoom = (mode, agencyName, playerName) => {
      setGameMode(mode);
      socket.emit('create_room', { mode, agencyName, playerName });
  };

  const joinRoomRequest = (roomId, playerName) => {
      setGameMode('agency');
      socket.emit('join_room_request', { roomId, playerName });
  };

  const pickRole = (role) => {
      socket.emit('pick_role', { roomId, role });
  };

  const toggleReady = () => {
      if (myRole) socket.emit('toggle_ready', { roomId, role: myRole });
  };

  const validateDevTask = (success) => socket.emit('action_dev_validate', success);
  const unlockDevSecurity = (code) => socket.emit('action_dev_security_unlock', code);
  const validateCreaTask = (shapes) => socket.emit('action_crea_validate', shapes);
  const processSpam = (isCorrect) => socket.emit('action_process_spam', isCorrect);
  const coolServer = () => socket.emit('action_cool_server');
  const resolveBlockage = (role) => socket.emit('action_unlock', role);
  const buyBoost = () => socket.emit('action_buy_boost');
  const solveCrisis = (code) => socket.emit('action_solve_crisis', code);

  return (
    <GameContext.Provider value={{ 
      budget, timeLeft, teamStatus, currentBrief, brandBook, serverHeat,
      assetsReady, securityLock, adminCode, apiKey, leaderboards,
      activeCrisis, crisisCode, agencyName, roomId, gameMode, lobbyData, isGameRunning,
      createRoom, joinRoomRequest, pickRole, myRole, toggleReady, disconnectError,
      solveCrisis, unlockDevSecurity, resolveBlockage, 
      validateDevTask, validateCreaTask, processSpam, coolServer, buyBoost,
      gameFinished, finalScore
    }}>
      {children}
    </GameContext.Provider>
  );
};