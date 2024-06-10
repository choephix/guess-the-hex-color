import { useCallback } from 'preact/hooks';
import { create } from 'zustand';

type GameConfig = Readonly<typeof gameConfig1>;

export const gameConfig1 = {
  maxHealth: 0xf,
  inputTemplate: 'RGB' as 'RGB' | 'RRGGBB',
  inputDefault: '888',
  makeRandomColor() {
    return Math.floor(Math.random() * 0xfff)
      .toString(16)
      .toUpperCase()
      .padStart(3, '0');
  },
  calculateDamage(diffR: number, diffG: number, diffB: number) {
    const sumDiff = Math.abs(diffR) + Math.abs(diffG) + Math.abs(diffB);
    const damage = sumDiff / 0xf;
    console.log({ sumDiff, damage });
    return damage;
  },
};

export const gameConfig2: GameConfig = {
  maxHealth: 0xffffff,
  inputTemplate: 'RRGGBB',
  inputDefault: '808080',
  makeRandomColor() {
    return Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .toUpperCase()
      .padStart(6, '0');
  },
  calculateDamage(diffR: number, diffG: number, diffB: number) {
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
  },
};

type State = {
  cfg: GameConfig;
  setCfg: (cfg: GameConfig) => void;

  guessHistory: GuessHistoryEntry[];
  colorCode: string;
  score: number;
  health: number;
  isGameOver: boolean;
  addGuessHistoryEntry: (entry: GuessHistoryEntry) => void;
  clearGuessHistory: () => void;
  setColorCode: (colorCode: string) => void;
  setScore: (score: number) => void;
  setHealth: (health: number) => void;
  setIsGameOver: (isGameOver: boolean) => void;
};

export const useGameStateStore = create<State>(set => ({
  cfg: gameConfig1,
  setCfg: cfg => set({ cfg }),

  guessHistory: [],
  colorCode: '',
  score: 0,
  health: 0,
  isGameOver: false,
  addGuessHistoryEntry: entry => set(state => ({ guessHistory: [entry, ...state.guessHistory] })),
  clearGuessHistory: () => set({ guessHistory: [] }),
  setColorCode: colorCode => set({ colorCode }),
  setScore: score => set({ score }),
  setHealth: health => set({ health }),
  setIsGameOver: isGameOver => set({ isGameOver }),
}));

interface GuessHistoryEntry {
  colorToGuess: string;
  userGuess: string;
  rgbDifference: { r: number; g: number; b: number };
  damage: number;
}

// Custom hook for game logic
export function useGame() {
  const {
    guessHistory,
    colorCode,
    score,
    health,
    isGameOver,
    addGuessHistoryEntry,
    clearGuessHistory,
    setColorCode,
    setScore,
    setHealth,
    setIsGameOver,
    cfg,
    setCfg,
  } = useGameStateStore();

  const handleGuess = useCallback(
    (guess: string) => {
      if (isGameOver) return;

      const diffs = calculateColorDifference(guess, colorCode);
      const damage = calculateDamage(...diffs);
      const newHealth = health - damage;
      setHealth(newHealth);

      // Add this block
      addGuessHistoryEntry({
        colorToGuess: colorCode,
        userGuess: guess,
        rgbDifference: { r: diffs[0], g: diffs[1], b: diffs[2] },
        damage,
      });

      if (newHealth <= 0) {
        setIsGameOver(true);
      } else {
        setScore(score + 1);
      }

      console.log({ guess, colorCode, diffs, damage: damage.toString(16), newHealth, isGameOver });

      setColorCode(cfg.makeRandomColor());
    },
    [colorCode, score, health || 0, isGameOver, cfg]
  );

  const resetGame = useCallback(
    (cfg: GameConfig) => {
      setCfg(cfg);
      setColorCode(cfg.makeRandomColor());
      setScore(0);
      setHealth(cfg.maxHealth);
      setIsGameOver(false);
      clearGuessHistory();
    },
    [cfg]
  );

  return {
    colorCode,
    score,
    health,
    guessHistory,
    isGameOver,
    handleGuess,
    resetGame,
    getCfg: () => cfg,
  };
}

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
