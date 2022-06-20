import bets from '../bets.json';

type Seed = {
  id: string;
  created_at: Date;
  color: number;
  roll: number;
  bets: {
    id: string;
    color: number;
    amount: number;
    win_amount: number;
    current_type: string;
    status: string;
  }[];
};

type SeedGroupedBets = {
  id: string;
  color: number;
  roll: number;
  amounts: {
    red: number;
    black: number;
    white: number;
  };
  total: number;
  winner: number;
  rest: number;
};

const Colors = {
  0: 'white',
  1: 'red',
  2: 'black'
};

function handler() {
  const results = reducer(bets as any);

  console.log(results);
}

function reducer(seeds: Seed[]): SeedGroupedBets[] {
  const results = [];

  for (const seed of seeds) {
    const result = seed.bets.reduce((acc, bet) => {
      const { amounts, total, winner } = acc;

      const color = Colors[bet.color as keyof typeof Colors];

      const parsedTotal = total + bet.amount;
      const parsedWinner = winner + (bet.color == seed.color ? bet.amount : 0)
      const rest = parsedTotal - parsedWinner;

      const parsedAcc = {
        amounts: {
          ...amounts,
          [color]: amounts[ color as keyof typeof amounts ] + bet.amount
        },
        total: parsedTotal,
        winner: parsedWinner,
        rest,
      }

      return parsedAcc;
    }, { 
      amounts: { 
        red: 0,
        black: 0,
        white: 0
      },
      total: 0,
      winner: 0,
      rest: 0
    });

    results.push({ ...result, id: seed.id, color: seed.color, roll: seed.roll });
  }

  return results;
}

const timetaken = "Time taken by handler analysis function";

console.time(timetaken);

handler()

console.timeEnd(timetaken);
