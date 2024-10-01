import React, { useState, useEffect } from 'react';
import './App.css';

const initialGrid = Array(5).fill(null).map(() => Array(5).fill(null));

// Náhodné generování pozice na mapě
const getRandomPosition = (size) => {
  return {
    row: Math.floor(Math.random() * size),
    col: Math.floor(Math.random() * size),
  };
};

function App() {
  const [grid, setGrid] = useState(initialGrid);
  const [score, setScore] = useState(0);
  const [animalPosition, setAnimalPosition] = useState(null);
  const [pollutionPosition, setPollutionPosition] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60); // 60 sekund na začátku
  const [difficulty, setDifficulty] = useState(1); // Obtížnost, která se postupně zvyšuje

  // Funkce pro sázení stromu
  const plantTree = (row, col) => {
    if (!grid[row][col]) {
      const newGrid = grid.map((r, rowIndex) =>
        r.map((cell, colIndex) => {
          if (rowIndex === row && colIndex === col && !cell) {
            return '🌳'; // Symbol stromu
          }
          return cell;
        })
      );
      setGrid(newGrid);
      setScore(score + 10); // +10 bodů za strom
    }
  };

  // Funkce pro záchranu zvířete
  const saveAnimal = () => {
    setAnimalPosition(null); // Odstraníme zvíře z mapy
    setScore(score + 20); // +20 bodů za záchranu
  };

  // Funkce pro odstranění znečištění
  const cleanPollution = () => {
    setPollutionPosition(null); // Odstraníme znečištění
    setScore(score + 15); // +15 bodů za odstranění
  };

  // Náhodně umístíme zvíře a překážku (znečištění)
  useEffect(() => {
    const newAnimalPosition = getRandomPosition(5);
    const newPollutionPosition = getRandomPosition(5);
    setAnimalPosition(newAnimalPosition);
    setPollutionPosition(newPollutionPosition);
  }, [difficulty]); // Zvíře a znečištění se objeví častěji s vyšší obtížností

  // Časový limit, který se snižuje každou sekundu
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  // Zvýšení obtížnosti každých 5 sekund (rychlejší obtížnost)
  useEffect(() => {
    const difficultyIncrease = setInterval(() => {
      setDifficulty((prev) => prev + 1);
    }, 5000); // Každých 5 sekund se zvýší obtížnost
    return () => clearInterval(difficultyIncrease);
  }, []);

  // Zrychlení generování zvířat a znečištění každé 3 sekundy
  useEffect(() => {
    const generateNewPositions = setInterval(() => {
      setAnimalPosition(getRandomPosition(5));
      setPollutionPosition(getRandomPosition(5));
    }, 3000); // Každé 3 sekundy nové zvíře a znečištění
    return () => clearInterval(generateNewPositions);
  }, []);

  return (
    <div className="App">
      <h1>Záchrana pralesa</h1>
      <h2>Skóre: {score}</h2>
      <h2>Čas: {timeLeft} s</h2>
      <h2>Obtížnost: {difficulty}</h2>
      <div className="map">
        {grid.map((row, rowIndex) => (
          <div className="row" key={rowIndex}>
            {row.map((cell, colIndex) => {
              const isAnimal = animalPosition && animalPosition.row === rowIndex && animalPosition.col === colIndex;
              const isPollution = pollutionPosition && pollutionPosition.row === rowIndex && pollutionPosition.col === colIndex;

              return (
                <div
                  key={colIndex}
                  className="cell"
                  onClick={() => {
                    if (isAnimal) saveAnimal();
                    else if (isPollution) cleanPollution();
                    else plantTree(rowIndex, colIndex);
                  }}
                >
                  {cell || (isAnimal ? '🐒' : isPollution ? '💀' : '🟩')}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      {timeLeft === 0 && <h2>Konec hry! Tvé skóre: {score}</h2>}
    </div>
  );
}

export default App;
