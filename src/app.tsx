import { useState, useCallback } from 'preact/hooks';
import { h } from 'preact';
import './app.css';

// Custom hook for game logic
function useGame() {
  const [colorCode, setColorCode] = useState<string>(getRandomColor());
  const [score, setScore] = useState<number>(0);
  const [health, setHealth] = useState<number>(0xffffff);

  function getRandomColor(): string {
    return Math.floor(Math.random() * 16777215)
      .toString(16)
      .toUpperCase();
  }

  const handleGuess = useCallback(
    (guess: string) => {
      if (guess === colorCode) {
        setScore(score + 1);
      } else {
        setHealth(health - 1);
      }
      console.log(`Score: ${score}`);
      setColorCode(getRandomColor());
    },
    [colorCode, score, health]
  );

  return { colorCode, score, health, handleGuess };
}

interface ColorInputFormProps {
  onSubmit: (guess: string) => void;
}

// Component for the color input form
function ColorInputForm({ onSubmit }: ColorInputFormProps) {
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
    const guess = form.elements.colorInput.value;
    onSubmit(guess);
  };

  return (
    <form onSubmit={handleSubmit} class='input-zone'>
      <input
        type='text'
        name='colorInput'
        class='color-input'
        placeholder='Guess the color'
        onInput={handleInputChange}
      />
      <button type='submit' class='submit-button'>
        Submit
      </button>
    </form>
  );
}

// Main App component
export function App() {
  const { colorCode, health, handleGuess } = useGame();

  return (
    <div class='game-container'>
      <h1>♥{health.toString(16).toUpperCase()}</h1>
      <div class='color-square' style={{ backgroundColor: `#${colorCode}` }}></div>
      <ColorInputForm onSubmit={handleGuess} />
    </div>
  );
}
