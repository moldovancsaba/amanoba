/**
 * Migration Script: Fix facebookId index to be sparse
 * 
 * What: Drops and recreates the facebookId index with sparse: true
 * Why: Allow multiple null values for SSO users (sparse indexes skip null values)
 * 
 * Usage: tsx scripts/fix-facebookid-index.ts
 */

import 'dotenv/config';
import connectDB from '../app/lib/mongodb';
import { Player } from '../app/lib/models';
import { logger } from '../app/lib/logger';

async function fixFacebookIdIndex() {
  try {
    logger.info('Starting facebookId index fix...');
    
    await connectDB();
    
    // Get the Player collection
    const collection = Player.collection;
    
    // Check current indexes
    const indexes = await collection.indexes();
    logger.info({ indexes: indexes.map(i => ({ name: i.name, key: i.key, unique: i.unique, sparse: i.sparse })) }, 'Current indexes');
    
    // Find the facebookId index
    const facebookIdIndex = indexes.find(
      (idx) => idx.key && 'facebookId' in idx.key
    );
    
    if (facebookIdIndex) {
      logger.info({ indexName: facebookIdIndex.name }, 'Found existing facebookId index, dropping it...');
      
      // Drop the existing index
      await collection.dropIndex(facebookIdIndex.name);
      logger.info('Dropped existing facebookId index');
    } else {
      logger.info('No existing facebookId index found');
    }
    
    // Create new sparse unique index
    logger.info('Creating new sparse unique index on facebookId...');
    await collection.createIndex(
      { facebookId: 1 },
      {
        name: 'player_facebook_id_unique',
        unique: true,
        sparse: true, // This allows multiple null values
      }
    );
    
    logger.info('Successfully created sparse unique index on facebookId');
    
    // Verify the index
    const newIndexes = await collection.indexes();
    const newFacebookIdIndex = newIndexes.find(
      (idx) => idx.key && 'facebookId' in idx.key
    );
    
    if (newFacebookIdIndex) {
      logger.info(
        {
          name: newFacebookIdIndex.name,
          unique: newFacebookIdIndex.unique,
          sparse: newFacebookIdIndex.sparse,
        },
        'Index verified successfully'
      );
    } else {
      logger.error('Failed to verify new index');
    }
    
    // Test: Count players with null facebookId
    const nullFacebookIdCount = await Player.countDocuments({
      $or: [
        { facebookId: null },
        { facebookId: { $exists: false } },
      ],
    });
    
    logger.info(
      { playersWithNullFacebookId: nullFacebookIdCount },
      'Players with null/missing facebookId (should be allowed now)'
    );
    
    logger.info('facebookId index fix completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error({ error }, 'Failed to fix facebookId index');
    process.exit(1);
  }
}

// Run migration
fixFacebookIdIndex();
