import { blazeHttp, BlazeDoubleHistory, BlazeDoubleHistoryDetail, RecordHistory  } from '../../common/blaze-http';
import { ISeedDetailed } from '../../database/seeds-detailed/seeds-detailed.types';
import { SeedDetailedModel } from '../../database/seeds-detailed/seeds-detailed.model'


export async function handler() {
  const insertedNewSeeds = await generateDetailedSeeds();

  if (insertedNewSeeds) {
    // TODO: Genereate new analysis 
  }
}

async function generateDetailedAnalysis() {

}

async function generateDetailedSeeds() {
  console.log('Starting seeds generation!');

  const { data: { records } } = await blazeHttp.get<BlazeDoubleHistory>('roulette_games/recent/history', {
    params: {
      page: 1
    }
  });

  const filteredRecords = await filterNonSavedDetailedRecords(records);

  const seeds: ISeedDetailed[] = [];

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

  await Promise.all(seeds.map(saveDetailedSeeds));

  return seeds;
}

async function saveDetailedSeeds(seed: ISeedDetailed) {
  console.log(`Generating mongodb seed ${seed.externalId}`);

  const mongoSeed = new SeedDetailedModel(seed);

  await mongoSeed.save();
}

async function getSortedDateDetailedSeeds() {
  return await SeedDetailedModel.find({}).sort({ created_at: 'descending' }).limit(10);
}

async function filterNonSavedDetailedRecords(records: RecordHistory[]) {
  const savedSeeds = await getSortedDateDetailedSeeds();
  const mappedSavedExternalIds = savedSeeds.map(seed => seed.externalId);

  return records.filter(record => !mappedSavedExternalIds.includes(record.id));
}