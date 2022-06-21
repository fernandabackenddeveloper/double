import { blazeHttp, BlazeDoubleHistory, BlazeDoubleHistoryDetail  } from '../../common/blaze-http';
import { ISeed } from '../../database/seeds/seeds.types';
import { SeedModel } from '../../database/seeds/seeds.model';

export async function handler() {
  console.log('Starting seeds generation!');

  const { data: { records } } = await blazeHttp.get<BlazeDoubleHistory>('roulette_games/recent/history', {
    params: {
      page: 1
    }
  });

  // TODO: verify non inserted double history

  const seeds: ISeed[] = [];

  for await (const record of records) {
    console.log(`Getting record ${record.id}`);
    try {
      const { data: { totalBetPages } } = await blazeHttp.get<BlazeDoubleHistoryDetail>(`roulette_games/${record.id}`);

      const pages = [ ...Array(totalBetPages).keys() ];

      const historyBets = [];

      for (const page of pages) {
        console.log(`Getting page ${page}/${pages.length} of record ${record.id}`);

        const historyBet = await blazeHttp.get<BlazeDoubleHistoryDetail>(`roulette_games/${record.id}`, {
          params: {
            page: page + 1
          }
        });

        historyBets.push(historyBet);
      }

      const bets = historyBets.flatMap(bet => ([ ...bet.data.bets ]));

      const seed = await new SeedModel({ ...record, bets });

      console.log(`Generating mongodb seed ${seed}`);

      await seed.save();

      seeds.push({ ...record, bets });

    } catch (error) {
      console.log(error);
    }
  }
}
