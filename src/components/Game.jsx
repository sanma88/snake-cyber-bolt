import React, { useState, useEffect, useRef } from 'react';
    import { useInterval } from '../hooks/useInterval';
    import { Apple } from 'lucide-react';

    const initialSnake = [{ x: 5, y: 5 }];
    const initialFood = { x: 10, y: 10 };
    const gridSize = 30;
    const maxWalls = 5;

    function Game({ onGameOver, difficulty }) {
      const [snake, setSnake] = useState(initialSnake);
      const [food, setFood] = useState(initialFood);
      const [direction, setDirection] = useState('RIGHT');
      const [delay, setDelay] = useState(difficulty.speed);
      const [walls, setWalls] = useState([]);
      const score = useRef(0);
      const gameOverRef = useRef(false);

      useEffect(() => {
        setDelay(difficulty.speed);
        if (difficulty.label === 'Hard') {
          setWalls(generateRandomWalls());
        } else {
          setWalls([]);
        }
      }, [difficulty]);

      useEffect(() => {
        gameOverRef.current = false;
        return () => {
          gameOverRef.current = true;
        };
      }, []);

      const changeDirection = ({ key }) => {
        const directionMap = {
          ArrowUp: 'UP',
          ArrowDown: 'DOWN',
          ArrowLeft: 'LEFT',
          ArrowRight: 'RIGHT',
        };

        const newDirection = directionMap[key];

        if (newDirection) {
          setDirection(newDirection);
        }
      };

      const moveSnake = () => {
        if (gameOverRef.current) {
          return;
        }

        setSnake((prevSnake) => {
          if (prevSnake.length === 0) {
            return prevSnake;
          }

          const newSnake = prevSnake.map((segment, index) => {
            if (index === 0) {
              let { x, y } = segment;
              switch (direction) {
                case 'UP':
                  y = y - 1;
                  break;
                case 'DOWN':
                  y = y + 1;
                  break;
                case 'LEFT':
                  x = x - 1;
                  break;
                case 'RIGHT':
                  x = x + 1;
                  break;
              }

              if (difficulty.borders || difficulty.label === 'Hard') {
                if (
                  x < 0 ||
                  x >= gridSize ||
                  y < 0 ||
                  y >= gridSize ||
                  isWallCollision(x, y)
                ) {
                  onGameOver(score.current);
                  gameOverRef.current = true;
                  setSnake(initialSnake);
                  score.current = 0;
                  return [];
                }
              } else {
                x = (x + gridSize) % gridSize;
                y = (y + gridSize) % gridSize;
              }

              return { x, y };
            } else {
              return prevSnake[index - 1];
            }
          });

          if (isCollision(newSnake)) {
            onGameOver(score.current);
            gameOverRef.current = true;
            setSnake(initialSnake);
            score.current = 0;
            return [];
          }

          if (
            newSnake.length > 0 &&
            newSnake[0].x === food.x &&
            newSnake[0].y === food.y
          ) {
            score.current += 1;
            createFirework(food.x, food.y);
            setFood(createFood());
            if (difficulty.label === 'Hard') {
              setWalls(generateRandomWalls());
            }
            return [newSnake[0], ...prevSnake];
          }

          return newSnake;
        });
      };

      const createFood = () => ({
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize),
      });

      const isCollision = (snake) => {
        const [head, ...body] = snake;
        return body.some((segment) => segment.x === head.x && segment.y === head.y);
      };

      const isWallCollision = (x, y) => {
        return walls.some((wall) => wall.x === x && wall.y === y);
      };

      const generateRandomWalls = () => {
        const newWalls = [];
        for (let i = 0; i < maxWalls; i++) {
          let randomX, randomY;
          do {
            randomX = Math.floor(Math.random() * gridSize);
            randomY = Math.floor(Math.random() * gridSize);
          } while (
            isWallCollision(randomX, randomY) ||
            (randomX === food.x && randomY === food.y) ||
            snake.some((segment) => segment.x === randomX && segment.y === randomY)
          );

          newWalls.push({ x: randomX, y: randomY });
        }
        return newWalls;
      };

      const createFirework = (x, y) => {
        const fireworkContainer = document.createElement('div');
        fireworkContainer.className = 'firework';
        fireworkContainer.style.left = `${x * 10}px`;
        fireworkContainer.style.top = `${y * 10}px`;
        document.querySelector('.game-area').appendChild(fireworkContainer);

        for (let i = 0; i < 10; i++) {
          const particle = document.createElement('div');
          particle.className = 'particle';
          particle.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
          const angle = (Math.PI * 2 * i) / 10;
          const speed = Math.random() * 3 + 1;
          particle.style.left = '5px';
          particle.style.top = '5px';
          particle.animate(
            [
              {
                transform: 'translate(0, 0)',
                opacity: 1,
              },
              {
                transform: `translate(${Math.cos(angle) * speed * 10}px, ${
                  Math.sin(angle) * speed * 10
                }px)`,
                opacity: 0,
              },
            ],
            {
              duration: 1000,
              easing: 'ease-out',
            }
          );
          fireworkContainer.appendChild(particle);
        }

        setTimeout(() => {
          fireworkContainer.remove();
        }, 1000);
      };

      useEffect(() => {
        window.addEventListener('keydown', changeDirection);
        return () => window.removeEventListener('keydown', changeDirection);
      }, []);

      useInterval(moveSnake, delay);

      const getSnakeHeadStyle = (head) => {
        let rotation = 0;
        switch (direction) {
          case 'UP':
            rotation = 180;
            break;
          case 'DOWN':
            rotation = 0;
            break;
          case 'LEFT':
            rotation = 90;
            break;
          case 'RIGHT':
            rotation = -90;
            break;
        }
        return {
          left: head.x * 10,
          top: head.y * 10,
          transform: `rotate(${rotation}deg)`,
          width: '10px',
          height: '15px',
        };
      };

      const getSnakeEyeStyle = (head, side) => {
        let top = side === 'left' ? 2 : 2;
        let left = side === 'left' ? 0 : 7;

        return {
          top: `${top}px`,
          left: `${left}px`,
        };
      };

      return (
        <div
          className="game-area relative"
          style={{ width: gridSize * 10, height: gridSize * 10 }}
        >
          {snake.map((segment, index) => {
            if (index === 0) {
              return (
                <div key={index} className="snake-head" style={getSnakeHeadStyle(segment)}>
                  <div className="snake-head-eye" style={getSnakeEyeStyle(segment, 'left')}></div>
                  <div className="snake-head-eye" style={getSnakeEyeStyle(segment, 'right')}></div>
                </div>
              );
            } else {
              return (
                <div
                  key={index}
                  className="snake-segment"
                  style={{
                    left: segment.x * 10,
                    top: segment.y * 10,
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                  }}
                />
              );
            }
          })}
          <div className="food" style={{ left: food.x * 10, top: food.y * 10 }}>
            <Apple size={10} color="#FF00FF" />
          </div>
          {walls.map((wall, index) => (
            <div
              key={`wall-${index}`}
              className="wall"
              style={{ left: wall.x * 10, top: wall.y * 10 }}
            />
          ))}
        </div>
      );
    }

    export default Game;
