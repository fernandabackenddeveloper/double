import * as MongoDB from './database';
import { handler } from './apps/seeds';

async function start() {
  const timetaken = "Time taken by handler bets generation function";

  console.time(timetaken);

  await MongoDB.run();  
  await handler();

  console.timeEnd(timetaken);
}

start();
