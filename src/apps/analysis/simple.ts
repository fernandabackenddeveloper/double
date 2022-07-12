import { consumer } from '../../libs/rabbitmq';

import { IAnalysis } from '../../database/analysis/analysis.types';

const queue = 'simple.seed';

export async function handler() {
  await consumer(queue, detailed);
}

async function detailed(message: IAnalysis) {
  console.log(message);
}