import { FunctionComponent } from 'preact';

import { useEffect } from 'preact/hooks';

import { ColorInputForm } from './components/ColorInputForm';
import { GuessHistory } from './components/GuessHistory';
import { HealthBar } from './components/HealthBar';
import { gameConfig2, useGame } from './gameplay/useGame';

import './app.css';
import { ColorPreview } from './components/ColorPreview';
import { ScoreDisplay } from './components/ScoreDisplay';

export const GameOver: FunctionComponent = () => {
  const { resetGame } = useGame();

  const startNewGame = () => {
    resetGame(gameConfig2);
  };

  return (
    <div class='game-over'>
      <h1>Game Over</h1>
      <button onClick={startNewGame}>New Game</button>
    </div>
  );
};

export const Game: FunctionComponent = () => {
  const { colorCode, health, score, handleGuess, getCfg } = useGame();
  const { maxHealth, inputDefault } = getCfg();

  return (
    <>
      <div class='game'>
        <ScoreDisplay score={score} />
        <HealthBar value={health} valueMax={maxHealth} />
        <ColorPreview colorCode={colorCode} />
        <ColorInputForm defaultInput={inputDefault} onSubmit={handleGuess} />
      </div>
    </>
  );
};

export const App: FunctionComponent = () => {
  const { guessHistory, isGameOver, resetGame } = useGame();

  useEffect(() => resetGame(gameConfig2), []);

  return (
    <div class='game-container'>
      {isGameOver ? <GameOver /> : <Game />}
      {guessHistory.length <= 0 ? null : (
        <>
          <hr />
          <GuessHistory history={guessHistory} />
        </>
      )}
      <div style='height: 20dvh'></div>
    </div>
  );
};
