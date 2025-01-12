import React from 'react';

    function Scoreboard({ scores }) {
      return (
        <div className="mt-4">
          <h2 className="text-2xl font-bold mb-2">Scoreboard</h2>
          <ul>
            {scores.map((score, index) => (
              <li key={index} className="text-lg">
                {score.name}: {score.score} ({score.difficulty})
              </li>
            ))}
          </ul>
        </div>
      );
    }

    export default Scoreboard;
