import { FunctionComponent } from 'preact';

interface GuessHistoryEntry {
  colorToGuess: string;
  userGuess: string;
  rgbDifference: { r: number; g: number; b: number };
  damage: number;
}

export const GuessHistory: FunctionComponent<{ history: GuessHistoryEntry[] }> = ({ history }) => {
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
          </p>{' '}
          <p className='detail'>
            <DamageDisplay value={entry.damage} />
          </p>
        </div>
      ))}
    </div>
  );
};

interface DamageDisplayProps {
  value: number;
}

const DamageDisplay: FunctionComponent<DamageDisplayProps> = ({ value }) => {
  const dangerPart = value.toString(16).toUpperCase();
  const perfectPart = '0'.repeat(6 - dangerPart.length);

  return (
    <span>
      <span style={{ color: 'green' }}>{perfectPart}</span>
      <span style={{ color: 'red' }}>{dangerPart}</span>
    </span>
  );
};
