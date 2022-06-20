import { blazeHttp, BlazeDoubleHistory, BlazeDoubleHistoryDetail  } from './blaze-http';
import * as fs from 'fs';

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

export async function handler() {
  const { data: { records } } = await blazeHttp.get<BlazeDoubleHistory>('roulette_games/recent/history', {
    params: {
      page: 1
    }
  });

  // TODO: verify non inserted double history

  const seeds: Seed[] = [];

  for await (const record of records) {
    try {
      const { data: { totalBetPages } } = await blazeHttp.get<BlazeDoubleHistoryDetail>(`roulette_games/${record.id}`);
  
      const pages = [ ...Array(totalBetPages).keys() ];
  
      const historyBets = await Promise.all(pages.map(page => blazeHttp.get<BlazeDoubleHistoryDetail>(`roulette_games/${record.id}`, {
        params: {
          page: page + 1
        }
      })));

      const bets = historyBets.flatMap(bet => ([ ...bet.data.bets ]));

      seeds.push({ ...record, bets });
      
    } catch (error) {
      console.log(error);
    }
  }

  const json = JSON.stringify(seeds);

  // TODO: modify to save on database

  fs.writeFile ("bets.json", json, (err) => {
      if (err) throw err;
    }
  );

  // TODO: after all insert new double history 
}

const timetaken = "Time taken by handler bets generation function";

console.time(timetaken);

handler().then(() => console.timeEnd(timetaken));
