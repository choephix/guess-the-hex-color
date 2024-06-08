import { FunctionComponent, h } from 'preact';
import { useCallback, useState } from 'preact/hooks';

import { Ticker, Tick } from 'react-flip-ticker';

import './app.css';

const maxHealth = 0xffffff;

const defaultInput = '808080';

function calculateColorDifference(color1: string, color2: string) {
  // Convert hex color code to RGB
  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return { r, g, b };
  };

  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  // Calculate the difference between each channel
  const diffR = rgb1.r - rgb2.r;
  const diffG = rgb1.g - rgb2.g;
  const diffB = rgb1.b - rgb2.b;

  return [diffR, diffG, diffB] as const;
}

function calculateDamage(diffR: number, diffG: number, diffB: number) {
  const sumDiff = Math.abs(diffR) + Math.abs(diffG) + Math.abs(diffB);
  const mulDiff = Math.abs(diffR * diffG * diffB);
  const sqrDiff = ~~Math.sqrt(diffR ** 2 + diffG ** 2 + diffB ** 2);

  console.log(`
    RGB diff: ${diffR}, ${diffG}, ${diffB}
    Total diff: ${sumDiff.toString(16).toUpperCase()}
    Square diff: ${sqrDiff.toString(16).toUpperCase()}
    Mul diff: ${mulDiff.toString(16).toUpperCase()}
    `);

  return sumDiff * (0xffff / 3);
  // return mulDiff * 16;
}

// Custom hook for game logic
function useGame() {
  const [guessHistory, setGuessHistory] = useState<GuessHistoryEntry[]>([]);

  const [colorCode, setColorCode] = useState<string>(getRandomColor());
  const [score, setScore] = useState<number>(0);
  const [health, setHealth] = useState<number>(maxHealth);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  function getRandomColor(): string {
    return Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .toUpperCase();
  }

  const handleGuess = useCallback(
    (guess: string) => {
      if (isGameOver) return;

      const diffs = calculateColorDifference(guess, colorCode);
      const damage = calculateDamage(...diffs);
      const newHealth = health - damage;
      setHealth(newHealth);

      // Add this block
      setGuessHistory(prevHistory => [
        ...prevHistory,
        {
          colorToGuess: '' + colorCode,
          userGuess: guess,
          rgbDifference: { r: diffs[0], g: diffs[1], b: diffs[2] },
          damage,
        },
      ]);

      if (newHealth <= 0) {
        setIsGameOver(true);
      } else {
        setScore(score + 1);
      }

      console.log({ guess, colorCode, diffs, damage: damage.toString(16), newHealth, isGameOver });

      setColorCode(getRandomColor());
    },
    [colorCode, score, health || 0, isGameOver]
  );

  const resetGame = useCallback(() => {
    setColorCode(getRandomColor());
    setScore(0);
    setHealth(0xffffff);
    setIsGameOver(false);
  }, []);

  return { colorCode, score, health, guessHistory, isGameOver, handleGuess, resetGame };
}

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

interface GameOverProps {
  resetGame: () => void;
}

export const GameOver: FunctionComponent<GameOverProps> = ({ resetGame }) => {
  return (
    <div>
      <h1>Game Over</h1>
      <button onClick={resetGame}>New Game</button>
    </div>
  );
};

interface GameProps {
  onGameOver: () => void;
}

export const Game: FunctionComponent<GameProps> = ({ onGameOver }) => {
  const { colorCode, health, score, guessHistory, isGameOver, handleGuess } = useGame();

  if (isGameOver) {
    onGameOver();
    return null;
  }

  return (
    <>
      <div class='game'>
        <h1 className={score > 0 ? '' : 'hidden'}>{'★' + score}</h1>
        <HPTicker value={health} />
        <div class='color-square' style={{ backgroundColor: `#${colorCode}` }}></div>
        <ColorInputForm onSubmit={handleGuess} />
      </div>
      <hr />
      <GuessHistory history={guessHistory} />
    </>
  );
};

export const App: FunctionComponent = () => {
  const [gameOver, setGameOver] = useState(false);

  const handleGameOver = () => {
    setGameOver(true);
  };

  const resetGame = () => {
    setGameOver(false);
  };

  return (
    <div class='game-container'>
      {gameOver ? <GameOver resetGame={resetGame} /> : <Game onGameOver={handleGameOver} />}
      <div style='height: 20dvh'></div>
    </div>
  );
};

const HPTicker: FunctionComponent<{ value: number }> = ({ value }) => {
  const HEX_DIGITS = '0123456789ABCDEFNa-/'.split('');
  const valueHex = isNaN(value) ? 'NaN' : value.toString(16).toUpperCase().padStart(6, '0');
  const hpPercentage = isNaN(value) ? 0 : (100 * value) / maxHealth; // Ensure value is a number

  return (
    <div class='hp-container'>
      <div class='hp-bar' style={{ width: `${hpPercentage}%` }}></div>
      <div class='hp-ticker'>
        <Ticker textClassName='text'>
          ♥
          {valueHex.split('').map((char, index) => (
            <Tick key={'d' + index} rotateItems={HEX_DIGITS}>
              {char}
            </Tick>
          ))}
        </Ticker>
      </div>
    </div>
  );
};

interface GuessHistoryEntry {
  colorToGuess: string;
  userGuess: string;
  rgbDifference: { r: number; g: number; b: number };
  damage: number;
}

const GuessHistory: FunctionComponent<{ history: GuessHistoryEntry[] }> = ({ history }) => {
  return (
    <div className='guess-history'>
      <h2>Guess History</h2>
      {history.map((entry, index) => (
        <div key={index} className='guess-entry'>
          <div className='colors'>
            <div className='color-box' style={{ backgroundColor: '#' + entry.colorToGuess }}></div>
            <div className='color-box' style={{ backgroundColor: '#' + entry.userGuess }}></div>
          </div>
          <h3 className='detail'>
            R{entry.rgbDifference.r} G{entry.rgbDifference.g} B{entry.rgbDifference.b}
          </h3>
          <p className='detail'>
            {entry.colorToGuess} | {entry.userGuess}
          </p>
          <p className='detail'>Damage {entry.damage}</p>
        </div>
      ))}
    </div>
  );
};
