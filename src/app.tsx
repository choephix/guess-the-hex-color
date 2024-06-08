import { useState } from 'preact/hooks';
import './app.css';

export function App() {
  const [colorCode, setColorCode] = useState('FFFFFF');

  const handleSubmit = (event: any) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement & { elements: { colorInput: HTMLInputElement } };
    const newColorCode = form.elements.colorInput.value;
    console.log(newColorCode);
    setColorCode(newColorCode);
  };

  return (
    <div class='game-container'>
      <h1>♥{colorCode}</h1>
      <div class='color-square' style={{ backgroundColor: `#${colorCode}` }}></div>
      <form onSubmit={handleSubmit} class='input-zone'>
        <input type='text' name='colorInput' class='color-input' placeholder='Enter color code' />
        <button type='submit' class='submit-button'>
          Submit
        </button>
      </form>
    </div>
  );
}
