/**
 * Seed Guest Usernames
 * 
 * Populates 100 pre-generated 3-word usernames for anonymous guests.
 * 
 * Run: npm run seed:guest-usernames
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Why: Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { GuestUsername } from '../app/lib/models/guest-username';
import logger from '../app/lib/logger';

// Why: 100 pre-generated unique 3-word combinations
const GUEST_USERNAMES = [
  'London Snake Africa', 'Rome York Firefly', 'Tokyo Zebra Ocean', 'Prague Butterfly Sea',
  'Vienna Cylon Balaton', 'Bangkok Mystral Leon', 'Moscow Snake Zulu', 'Riga Firefly York',
  'Oslo Africa Alfa', 'Beijing Butterfly Tokyo', 'Chicago Zebra Rome', 'Leon Ocean Snake',
  'Balaton Firefly Africa', 'Miskolc Cylon Sea', 'Zulu London Mystral', 'Alfa Tokyo Snake',
  'Snake Rome Ocean', 'Firefly Prague Africa', 'Butterfly Vienna Leon', 'Ocean Chicago Zebra',
  'Africa Bangkok Firefly', 'Zebra Moscow Snake', 'Cylon Riga Ocean', 'Mystral Oslo Africa',
  'Sea Beijing Butterfly', 'York Balaton Firefly', 'Leon Miskolc Cylon', 'Tokyo Africa Snake',
  'Rome Ocean Zebra', 'Prague Firefly London', 'Vienna Snake Butterfly', 'Bangkok Africa Ocean',
  'Moscow Zebra Firefly', 'Riga Cylon Sea', 'Oslo Mystral Africa', 'Beijing Snake Tokyo',
  'Chicago Ocean Firefly', 'Balaton Butterfly Rome', 'Miskolc Africa Zebra', 'London Leon Snake',
  'York Ocean Prague', 'Tokyo Firefly Vienna', 'Rome Africa Bangkok', 'Prague Snake Moscow',
  'Vienna Zebra Riga', 'Bangkok Ocean Oslo', 'Moscow Firefly Beijing', 'Riga Africa Chicago',
  'Oslo Snake Balaton', 'Beijing Ocean Miskolc', 'Chicago Firefly London', 'Leon Africa York',
  'Balaton Snake Tokyo', 'Miskolc Ocean Rome', 'Zulu Firefly Prague', 'Alfa Africa Vienna',
  'Snake Bangkok Zebra', 'Firefly Moscow Ocean', 'Butterfly Riga Africa', 'Ocean Oslo Snake',
  'Africa Beijing Firefly', 'Zebra Chicago Ocean', 'Cylon Leon Africa', 'Mystral Balaton Snake',
  'Sea Miskolc Firefly', 'York London Ocean', 'Leon Tokyo Africa', 'Tokyo Rome Snake',
  'Rome Prague Firefly', 'Prague Vienna Ocean', 'Vienna Bangkok Africa', 'Bangkok Moscow Snake',
  'Moscow Riga Firefly', 'Riga Oslo Ocean', 'Oslo Beijing Africa', 'Beijing Chicago Snake',
  'Chicago Leon Firefly', 'Balaton York Ocean', 'Miskolc London Africa', 'London Tokyo Snake',
  'York Rome Firefly', 'Tokyo Prague Ocean', 'Rome Vienna Africa', 'Prague Bangkok Snake',
  'Vienna Moscow Firefly', 'Bangkok Riga Ocean', 'Moscow Oslo Africa', 'Riga Beijing Snake',
  'Oslo Chicago Firefly', 'Beijing Balaton Ocean', 'Chicago Miskolc Africa', 'Leon Zulu Snake',
  'Balaton Alfa Firefly', 'Miskolc Snake Ocean', 'Zulu Firefly Africa', 'Alfa Ocean Snake',
  'Butterfly Leon Zebra', 'Cylon York Mystral', 'Mystral Tokyo Sea', 'Sea Rome Cylon',
  'Snake Prague Butterfly', 'Firefly Vienna Zebra', 'Ocean Bangkok Cylon', 'Africa Moscow Mystral',
];

async function seedGuestUsernames() {
  try {
    logger.info('🌱 Starting guest usernames seed...');
    
    await connectDB();
    logger.info('✅ Connected to MongoDB');

    // Clear existing usernames
    const deleteResult = await GuestUsername.deleteMany({});
    logger.info(`🗑️  Cleared ${deleteResult.deletedCount} existing usernames`);

    // Insert pre-generated usernames
    const usernames = GUEST_USERNAMES.map(username => ({
      username,
      isActive: true,
      usageCount: 0,
    }));

    const result = await GuestUsername.insertMany(usernames);
    logger.info(`✅ Inserted ${result.length} guest usernames`);

    logger.info('🎉 Guest usernames seed completed successfully!');
    process.exit(0);
  } catch (error) {
    logger.error(`❌ Seed failed: ${error}`);
    process.exit(1);
  }
}

seedGuestUsernames();
