import { blazeHttp, BlazeDoubleHistory } from '../../common/blaze-http';

import { ISeed } from '../../database/seeds/seeds.types';
import { SeedModel } from '../../database/seeds/seeds.model';

import { AnalysisModel } from '../../database/analysis/analysis.model';

import { producer } from '../../libs/rabbitmq';

const queue = 'simple.seed';


export async function handler() {
  await generateSimpleAnalysis();

  // const insertedSeeds = await generateSimpleSeeds();

  // if (insertedSeeds.length) {
  // }
}

async function generateSimpleAnalysis() {
  const seeds = await getSortedDateSimpleSeeds();
  const analysis = new AnalysisModel({ seeds });
  await analysis.save();

  await producer(queue, analysis);
}

async function generateSimpleSeeds() {
  console.log('Starting simple seeds generation!');

  const pages = [ ...Array(1).keys() ];

  const responses = await Promise.all(pages.map(page => blazeHttp.get<BlazeDoubleHistory>('roulette_games/recent/history', {
    params: {
      page
    }
  })));

  const seeds = responses.flatMap(response => response.data.records.map(record => ({ ...record, externalId: record.id })));

  const filteredSeeds = await filterNonSavedSimpleRecords(seeds);

  if (filteredSeeds.length) {
    await Promise.all(filteredSeeds.map(saveSimpleSeeds));
  }

  return filteredSeeds;
}

async function saveSimpleSeeds(seed: ISeed) {
  console.log(`Generating mongodb seed ${seed.externalId}`);

  const mongoSeed = new SeedModel(seed);

  await mongoSeed.save();
}

async function getSortedDateSimpleSeeds() {
  return await SeedModel.find({}).sort({ created_at: 'descending' }).limit(200);
}

async function filterNonSavedSimpleRecords(records: ISeed[]) {
  const savedSeeds = await getSortedDateSimpleSeeds();
  const mappedSavedExternalIds = savedSeeds.map(seed => seed.externalId);

  return records.filter(record => !mappedSavedExternalIds.includes(record.externalId));
}