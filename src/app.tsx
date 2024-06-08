import { useState } from 'preact/hooks';
import './app.css';

export function App() {
  const [colorCode, setColorCode] = useState(getRandomColor());
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(0xFFFFFF);

  function getRandomColor() {
    return Math.floor(Math.random()*16777215).toString(16).toUpperCase();
  }

  const handleInputChange = (event: any) => {
    let value = event.target.value.toUpperCase();
    value = value.slice(0, 6);
    value = value.replace(/[^A-Fa-f0-9]/g, '');
    event.target.value = value;
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement & { elements: { colorInput: HTMLInputElement } };
    const guess = form.elements.colorInput.value;
    if (guess === colorCode) {
      setScore(score + 1);
    } else {
      setHealth(health - 1);
    }
    console.log(`Score: ${score}`);
    setColorCode(getRandomColor());
  };

  return (
    <div class='game-container'>
      <h1>♥{health.toString(16).toUpperCase()}</h1>
      <div class='color-square' style={{ backgroundColor: `#${colorCode}` }}></div>
      <form onSubmit={handleSubmit} class='input-zone'>
        <input type='text' name='colorInput' class='color-input' placeholder='Guess the color' onInput={handleInputChange} />
        <button type='submit' class='submit-button'>
          Submit
        </button>
      </form>
    </div>
  );
}
