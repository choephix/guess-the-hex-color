import { useState } from 'preact/hooks';
import './app.css';

export function App() {
  const [colorCode, setColorCode] = useState('FFFFFF');

  const handleInputChange = (event: any) => {
    let value = event.target.value.toUpperCase();
    value = value.slice(0, 6);
    value = value.replace(/[^A-Fa-f0-9]/g, '');
    event.target.value = value;
  };

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
        <input type='text' name='colorInput' class='color-input' placeholder='Enter color code' onInput={handleInputChange} />
        <button type='submit' class='submit-button'>
          Submit
        </button>
      </form>
    </div>
  );
}
