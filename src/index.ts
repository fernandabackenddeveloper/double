import * as MongoDB from './database';
import { handler as simpleProducer } from './apps/seeds/simple';
import { scheduleJob } from 'node-schedule';
import { handler as simpleConsumer } from './apps/analysis/simple';

async function start() {
  console.log('Starting double services');
  
  await MongoDB.run();
  
  await simpleProducer();
  await simpleConsumer();
  
  scheduleJob('*/1 * * * *', () => {
    const timetaken = "Time taken by handler simple seeds generation function";
    console.time(timetaken);
    console.timeEnd(timetaken);
  });
}

start();
