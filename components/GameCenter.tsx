
import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';

const GameCenter: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [score, setScore] = useState(0);
  const [targetPos, setTargetPos] = useState({ x: 50, y: 50 });
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isPlaying && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, timeLeft]);

  const moveTarget = () => {
    if (!isPlaying) return;
    setTargetPos({
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10
    });
    setScore(s => s + 1);
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setIsPlaying(true);
    moveTarget();
  };

  return (
    <div className="absolute inset-0 z-[200] bg-[#87CEEB] flex flex-col">
      <header className="p-4 flex items-center justify-between text-white drop-shadow-md">
        <ArrowLeft size={24} onClick={onBack} className="cursor-pointer" />
        <h1 className="text-lg font-bold">Mini Jump Game</h1>
        <RefreshCw size={24} onClick={startGame} className="cursor-pointer" />
      </header>

      <div className="flex-1 relative overflow-hidden bg-gradient-to-b from-[#87CEEB] to-[#E0F6FF]">
        <div className="absolute top-4 w-full text-center">
          <p className="text-4xl font-black text-white drop-shadow-lg">{score}</p>
          <p className="text-sm text-white/80 font-bold">Time: {timeLeft}s</p>
        </div>

        {isPlaying ? (
          <button 
            onClick={moveTarget}
            className="absolute w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center text-4xl shadow-xl transition-all duration-75 active:scale-90"
            style={{ left: `${targetPos.x}%`, top: `${targetPos.y}%`, transform: 'translate(-50%, -50%)' }}
          >
            🪙
          </button>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-10 bg-black/20 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-white mb-2">Game Over!</h2>
            <p className="text-white mb-6">You caught {score} coins!</p>
            <button 
              onClick={startGame}
              className="bg-[#07C160] text-white px-10 py-3 rounded-full font-bold shadow-lg text-lg active:scale-95"
            >
              Start Game
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameCenter;
