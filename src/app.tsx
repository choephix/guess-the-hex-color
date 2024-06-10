import { FunctionComponent, h } from 'preact';

import { useEffect } from 'preact/hooks';

import { GuessHistory } from './components/GuessHistory';
import { HealthBar } from './components/HealthBar';
import { gameConfig2, useGame } from './gameplay/useGame';

import './app.css';

export const maxHealth = 0xffffff;

const defaultInput = '808080';

interface ColorInputFormProps {
  onSubmit: (guess: string) => void;
}

// Component for the color input form
export const ColorInputForm: FunctionComponent<ColorInputFormProps> = ({ onSubmit }) => {
  const handleInputChange = (event: h.JSX.TargetedEvent<HTMLInputElement, Event>) => {
    let value = event.currentTarget.value.toUpperCase();
    value = value.slice(0, 6);
    value = value.replace(/[^A-Fa-f0-9]/g, '');
    event.currentTarget.value = value;
  };

  const handleSubmit = (event: h.JSX.TargetedEvent<HTMLFormElement, Event>) => {
    event.preventDefault();

    const form = event.currentTarget as HTMLFormElement & {
      elements: { colorInput: HTMLInputElement };
    };
    const guess = form.elements.colorInput.value.padStart(6, '0');

    onSubmit(guess);

    form.elements.colorInput.value = defaultInput;
  };

  return (
    <form onSubmit={handleSubmit} class='input-zone'>
      <div class='hashtag'>#</div>
      <input
        type='text'
        name='colorInput'
        class='color-input'
        placeholder='Guess the color'
        onInput={handleInputChange}
        defaultValue={defaultInput}
      />
      <button type='submit' class='submit-button'>
        Submit
      </button>
    </form>
  );
};

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
