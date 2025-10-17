import mongoose from 'mongoose';
import { PlayerSession } from '../app/lib/models';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function check() {
  await mongoose.connect(process.env.MONGODB_URI!);
  const count = await PlayerSession.countDocuments();
  const sample = await PlayerSession.findOne().lean();
  console.log('Total sessions:', count);
  if (sample) {
    console.log('Sample session:', JSON.stringify(sample, null, 2));
  }
  await mongoose.disconnect();
}

check().catch(console.error);
