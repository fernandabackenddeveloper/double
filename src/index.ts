import { blazeHttp, BlazeDoubleHistory, BlazeDoubleHistoryDetail  } from './blaze-http';
import * as fs from 'fs';

export async function handler() {
  const { data: { records } } = await blazeHttp.get<BlazeDoubleHistory>('roulette_games/recent/history', {
    params: {
      page: 1
    }
  });

  // TODO: verify non inserted double history

  const parsedBets = [];

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

      parsedBets.push({ record, bets });
      
    } catch (error) {
      console.log(error);
    }
  }

  const json = JSON.stringify(parsedBets);

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
