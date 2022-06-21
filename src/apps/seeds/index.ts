import { blazeHttp, BlazeDoubleHistory, BlazeDoubleHistoryDetail, RecordHistory  } from '../../common/blaze-http';
import { ISeed } from '../../database/seeds/seeds.types';
import { SeedModel } from '../../database/seeds/seeds.model';

export async function handler() {
  const insertedSeeds = await generateSeeds();

  if (insertedSeeds) {
    // TODO: Genereate new analysis 
  }
}

async function generateAnalysis() {

}

async function generateSeeds() {
  console.log('Starting seeds generation!');

  const { data: { records } } = await blazeHttp.get<BlazeDoubleHistory>('roulette_games/recent/history', {
    params: {
      page: 1
    }
  });

  const filteredRecords = await filterNonSavedRecords(records);

  const seeds: ISeed[] = [];

  for await (const record of filteredRecords) {
    console.log(`Getting record ${record.id}`);

    try {
      const { data: { totalBetPages } } = await blazeHttp.get<BlazeDoubleHistoryDetail>(`roulette_games/${record.id}`);

      const pages = [ ...Array(totalBetPages).keys() ];

      const historyBets = [];

      for (const page of pages) {
        console.log(`Getting page ${page}/${pages.length} of record ${record.id}`);

        const { data: { bets } } = await blazeHttp.get<BlazeDoubleHistoryDetail>(`roulette_games/${record.id}`, {
          params: {
            page: page + 1
          }
        });

        historyBets.push(...bets);
      }

      seeds.push({ ...record, bets: historyBets, externalId: record.id });
    } catch (error) {
      console.log(error);
    }
  }

  await Promise.all(seeds.map(saveSeeds));

  return seeds;
}

async function saveSeeds(seed: ISeed) {
  console.log(`Generating mongodb seed ${seed.externalId}`);

  const mongoSeed = new SeedModel(seed);

  await mongoSeed.save();
}

async function getSortedDateSeeds() {
  return await SeedModel.find({}).sort({ created_at: 'descending' }).limit(10);
}

async function filterNonSavedRecords(records: RecordHistory[]) {
  const savedSeeds = await getSortedDateSeeds();
  const mappedSavedExternalIds = savedSeeds.map(seed => seed.externalId);

  return records.filter(record => !mappedSavedExternalIds.includes(record.id));
}