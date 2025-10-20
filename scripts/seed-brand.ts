/**
 * Seed Default Brand
 * 
 * Purpose: Ensure Amanoba brand exists in database for player registration
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Brand } from '../app/lib/models';

async function connectDB() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI not defined');
  }
  await mongoose.connect(mongoUri);
  console.log('✅ Connected to MongoDB');
}

async function seedBrand() {
  try {
    await connectDB();
    
    const existingBrand = await Brand.findOne({ slug: 'amanoba' });
    
    if (existingBrand) {
      console.log('✅ Amanoba brand already exists');
      process.exit(0);
      return;
    }
    
    await Brand.create({
      name: 'Amanoba',
      slug: 'amanoba',
      displayName: 'Amanoba',
      description: 'Unified gamification platform',
      logo: '🎮',
      themeColors: {
        primary: '#6366f1',
        secondary: '#ec4899',
        accent: '#a855f7',
      },
      allowedDomains: ['amanoba.com', 'localhost'],
      supportedLanguages: ['en'],
      defaultLanguage: 'en',
      isActive: true,
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    
    console.log('✅ Created Amanoba brand');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedBrand();
