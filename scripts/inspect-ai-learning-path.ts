#!/usr/bin/env tsx
import connectDB from '../app/lib/mongodb';
import { CCS } from '../app/lib/models';

async function inspect() {
  await connectDB();
  
  const ccs = await CCS.findOne({ ccsId: 'AI_LEARNING_PATH_2026' }).lean();
  
  console.log('\nAI_LEARNING_PATH_2026 Full Data:');
  console.log(JSON.stringify(ccs, null, 2));
  
  process.exit(0);
}

inspect();
