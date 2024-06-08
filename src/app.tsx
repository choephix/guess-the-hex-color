import { useState, useCallback } from 'preact/hooks';
import { h } from 'preact';
import './app.css';

function calculateColorDifference(color1: string, color2: string): number {
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
  const diffR = Math.abs(rgb1.r - rgb2.r);
  const diffG = Math.abs(rgb1.g - rgb2.g);
  const diffB = Math.abs(rgb1.b - rgb2.b);

  const totalDiff = diffR + diffG + diffB;
  const finalDiff = ~~Math.sqrt(diffR ** 2 + diffG ** 2 + diffB ** 2);

  console.log(
    `Color difference: ${diffR}, ${diffG}, ${diffB} | Total: ${totalDiff} | Final: ${finalDiff}`
  );

  // Return the sum of the differences
  return diffR + diffG + diffB;
}

// Custom hook for game logic
function useGame() {
  const [colorCode, setColorCode] = useState<string>(getRandomColor());
  const [score, setScore] = useState<number>(0);
  const [health, setHealth] = useState<number>(0xff);

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
        const colorDifference = calculateColorDifference(guess, colorCode);
        setHealth(health - colorDifference);
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

  console.log('Rendering App. Color code:', colorCode);

  return (
    <div class='game-container'>
      <h1>♥{health.toString(16).toUpperCase()}</h1>
      <div class='color-square' style={{ backgroundColor: `#${colorCode}` }}></div>
      <ColorInputForm onSubmit={handleGuess} />
    </div>
  );
}
