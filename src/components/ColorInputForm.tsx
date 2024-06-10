import { FunctionComponent, h } from 'preact';

interface ColorInputFormProps {
  defaultInput?: string;
  onSubmit: (guess: string) => void;
}

export const ColorInputForm: FunctionComponent<ColorInputFormProps> = ({
  defaultInput = '',
  onSubmit,
}) => {
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

    let guess = form.elements.colorInput.value;
    if (guess.length < 3) {
      //// pad with zeros e.g. ab -> 0ab
      guess = guess.padStart(3, '0');
    }

    if (guess.length === 3) {
      //// double the chars e.g. abc -> aabbcc
      guess = guess
        .split('')
        .map(c => c + c)
        .join('');
    }

    if (guess.length < 6) {
      //// pad with zeros e.g. abc -> 00abcd
      guess = guess.padStart(6, '0');
    }

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
