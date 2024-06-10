import { FunctionComponent } from 'preact';

import { useEffect } from 'preact/hooks';

import { ColorInputForm } from './components/ColorInputForm';
import { GuessHistory } from './components/GuessHistory';
import { HealthBar } from './components/HealthBar';
import { gameConfig2, useGame } from './gameplay/useGame';

import './app.css';

export const maxHealth = 0xffffff;

export const defaultInput = '808080';

interface GameOverProps {}

export const GameOver: FunctionComponent<GameOverProps> = ({}) => {
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

interface GameProps {}

export const Game: FunctionComponent<GameProps> = ({}) => {
  const { colorCode, health, score, handleGuess } = useGame();

  return (
    <>
      <div class='game'>
        <h1 className={score > 0 ? '' : 'hidden'}>{'★' + score}</h1>
        <HealthBar value={health} />
        <div class='color-square' style={{ backgroundColor: `#${colorCode}` }}></div>
        <ColorInputForm onSubmit={handleGuess} />
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
      <hr />
      <GuessHistory history={guessHistory} />
      <div style='height: 20dvh'></div>
    </div>
  );
};
