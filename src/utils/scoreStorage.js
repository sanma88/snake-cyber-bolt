export const loadScores = () => {
      const scores = localStorage.getItem('scores');
      return scores ? JSON.parse(scores) : [];
    };

    export const saveScore = (name, score, difficulty) => {
      const scores = loadScores();
      scores.push({ name, score, difficulty });
      scores.sort((a, b) => b.score - a.score);
      localStorage.setItem('scores', JSON.stringify(scores));
    };
