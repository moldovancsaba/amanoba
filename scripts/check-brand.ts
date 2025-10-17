import mongoose from 'mongoose';
import { Brand } from '../app/lib/models';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function check() {
  await mongoose.connect(process.env.MONGODB_URI!);
  const brands = await Brand.find().lean();
  console.log('Total brands:', brands.length);
  if (brands.length > 0) {
    console.log('Brands:', JSON.stringify(brands, null, 2));
  } else {
    console.log('❌ NO BRANDS FOUND - This is why player creation fails!');
  }
  await mongoose.disconnect();
}

check().catch(console.error);
