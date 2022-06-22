import * as MongoDB from './database';
import { handler } from './apps/seeds/simple';
import { scheduleJob } from 'node-schedule';

async function start() {
  console.log('Starting double services');
  
  // await MongoDB.run();
  
  scheduleJob('*/1 * * * *', () => {
    const timetaken = "Time taken by handler simple seeds generation function";
    console.time(timetaken);

    handler();

    console.timeEnd(timetaken);
  });
}

start();
