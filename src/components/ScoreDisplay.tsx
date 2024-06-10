type ScoreDisplayProps = {
  score: number;
};

export const ScoreDisplay = ({ score }: ScoreDisplayProps) => {
  const className = score > 0 ? 'score-display' : 'score-display hidden';
  return <h1 className={className}>{'★' + score}</h1>;
};
