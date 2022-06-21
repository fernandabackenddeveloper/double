import * as MongoDB from './database';
import { handler } from './apps/seeds';
import { scheduleJob } from 'node-schedule';

async function start() {
  console.log('Starting double services');
  
  await MongoDB.run();
  
  scheduleJob('*/5 * * * *', () => {
    const timetaken = "Time taken by handler bets generation function";
    console.time(timetaken);

    handler();

    console.timeEnd(timetaken);
  });
}

start();
