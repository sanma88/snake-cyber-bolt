import React, { useState, useEffect, useRef } from 'react';
    import Game from './components/Game';
    import Scoreboard from './components/Scoreboard';
    import { loadScores, saveScore } from './utils/scoreStorage';
    import { ArrowUpCircle, PlayCircle, RefreshCw } from 'lucide-react';

    const difficultyLevels = {
      EASY: { speed: 100, label: 'Easy', borders: false },
      MEDIUM: { speed: 75, label: 'Medium', borders: true },
      HARD: { speed: 50, label: 'Hard', borders: true },
    };

    function App() {
      const [scores, setScores] = useState([]);
      const [isGameOver, setIsGameOver] = useState(false);
      const [isGameStarted, setIsGameStarted] = useState(false);
      const [playerName, setPlayerName] = useState('');
      const [currentDifficulty, setCurrentDifficulty] = useState(
        difficultyLevels.EASY
      );
      const score = useRef(0);

      useEffect(() => {
        setScores(loadScores());
      }, []);

      const handleGameOver = (finalScore) => {
        setIsGameOver(true);
        score.current = finalScore;
      };

      const handleRestart = () => {
        setIsGameOver(false);
        setIsGameStarted(true);
        if (playerName) {
          saveScore(playerName, score.current, currentDifficulty.label);
          setScores(loadScores());
        }
      };

      const handleStart = () => {
        const name = prompt('Enter your name:', 'Player');
        if (name) {
          setPlayerName(name);
          setIsGameStarted(true);
        }
      };

      const handleDifficultyChange = (level) => {
        setCurrentDifficulty(difficultyLevels[level]);
      };

      return (
        <div className="p-4 text-neon-blue">
          <div className="flex justify-center items-center mb-4">
            <ArrowUpCircle size={48} className="mr-2" />
            <h1 className="text-4xl font-bold">Cyber Snake</h1>
          </div>
          <div className="flex justify-center mb-4">
            {Object.keys(difficultyLevels).map((level) => (
              <button
                key={level}
                onClick={() => handleDifficultyChange(level)}
                className={`mx-2 px-4 py-2 rounded-lg ${
                  currentDifficulty.label === difficultyLevels[level].label
                    ? 'bg-neon-green'
                    : 'bg-neon-blue'
                } text-dark-bg shadow-lg hover:bg-neon-green transition duration-300`}
              >
                {difficultyLevels[level].label}
              </button>
            ))}
          </div>
          {!isGameStarted && (
            <div className="flex justify-center">
              <button
                onClick={handleStart}
                className="bg-neon-blue text-dark-bg px-6 py-3 rounded-lg shadow-lg hover:bg-neon-green transition duration-300 flex items-center"
              >
                <PlayCircle size={24} className="mr-2" />
                Start Game
              </button>
            </div>
          )}
          {isGameStarted && (
            <Game
              onGameOver={handleGameOver}
              difficulty={currentDifficulty}
            />
          )}
          {isGameOver && (
            <div className="game-over-popup">
              <h2>Game Over!</h2>
              <p>
                {playerName}: {score.current} ({currentDifficulty.label})
              </p>
              <button onClick={handleRestart}>
                <RefreshCw size={20} className="mr-2" />
                Restart
              </button>
            </div>
          )}
          <Scoreboard scores={scores} />
        </div>
      );
    }

    export default App;
