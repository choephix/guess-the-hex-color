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
