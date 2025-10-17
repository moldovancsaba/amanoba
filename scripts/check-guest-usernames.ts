import mongoose from 'mongoose';
import { GuestUsername } from '../app/lib/models/guest-username';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function check() {
  await mongoose.connect(process.env.MONGODB_URI!);
  const count = await GuestUsername.countDocuments();
  console.log('Total guest usernames:', count);
  if (count > 0) {
    const sample = await GuestUsername.findOne().lean();
    console.log('Sample:', sample);
  } else {
    console.log('❌ NO GUEST USERNAMES - Anonymous login will fail!');
    console.log('Run: npm run seed:guest-usernames');
  }
  await mongoose.disconnect();
}

check().catch(console.error);
