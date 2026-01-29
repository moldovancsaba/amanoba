#!/usr/bin/env node
/**
 * scripts/debug-sso-user.mjs
 * WHAT: Debug the SSO user in Amanoba database
 * WHY: Find out why the user lookup is failing
 */
import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config({ path: '.env.local' })

const TARGET_SSO_SUB = '7700c769-493b-4778-b21e-137bbbe7c21f'

async function main() {
  console.log('🔍 Debugging SSO user in Amanoba database...\n')
  
  // Connect to MongoDB
  const mongoUri = process.env.MONGODB_URI
  if (!mongoUri) {
    console.error('❌ MONGODB_URI environment variable not set')
    process.exit(1)
  }
  
  try {
    await mongoose.connect(mongoUri)
    console.log('✅ Connected to MongoDB')
    console.log(`Database: ${mongoose.connection.name}`)
    console.log(`Host: ${mongoose.connection.host}`)
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message)
    process.exit(1)
  }
  
  try {
    // Get all collections
    const collections = await mongoose.connection.db.listCollections().toArray()
    console.log('\n📋 Available collections:')
    collections.forEach(col => console.log(`  - ${col.name}`))
    
    // Check players collection specifically
    console.log('\n🔍 Searching in players collection...')
    const playersCollection = mongoose.connection.db.collection('players')
    
    // Count total players
    const totalPlayers = await playersCollection.countDocuments()
    console.log(`Total players: ${totalPlayers}`)
    
    // Search for our specific user
    console.log(`\n🎯 Searching for ssoSub: ${TARGET_SSO_SUB}`)
    const targetUser = await playersCollection.findOne({ ssoSub: TARGET_SSO_SUB })
    
    if (targetUser) {
      console.log('✅ Found target user:')
      console.log(JSON.stringify(targetUser, null, 2))
    } else {
      console.log('❌ Target user not found')
      
      // Search for users with any ssoSub
      console.log('\n🔍 Looking for any users with ssoSub field...')
      const usersWithSsoSub = await playersCollection.find({ ssoSub: { $exists: true, $ne: null } }).limit(5).toArray()
      
      if (usersWithSsoSub.length > 0) {
        console.log(`Found ${usersWithSsoSub.length} users with ssoSub:`)
        usersWithSsoSub.forEach((user, index) => {
          console.log(`${index + 1}. ssoSub: ${user.ssoSub}, email: ${user.email}, role: ${user.role}`)
        })
      } else {
        console.log('No users found with ssoSub field')
      }
      
      // Search for users with the target email
      console.log('\n📧 Searching for users with email: quiz-automation@amanoba.com')
      const usersByEmail = await playersCollection.find({ email: 'quiz-automation@amanoba.com' }).toArray()
      
      if (usersByEmail.length > 0) {
        console.log(`Found ${usersByEmail.length} users with target email:`)
        usersByEmail.forEach((user, index) => {
          console.log(`${index + 1}. ID: ${user._id}, ssoSub: ${user.ssoSub}, role: ${user.role}`)
        })
      } else {
        console.log('No users found with target email')
      }
      
      // Show sample of recent users
      console.log('\n📊 Sample of recent users:')
      const recentUsers = await playersCollection.find({}).sort({ _id: -1 }).limit(5).toArray()
      recentUsers.forEach((user, index) => {
        console.log(`${index + 1}. ID: ${user._id}, email: ${user.email}, ssoSub: ${user.ssoSub}, role: ${user.role}`)
      })
    }
    
  } catch (error) {
    console.error('❌ Error during debugging:', error.message)
    console.error(error.stack)
  } finally {
    await mongoose.disconnect()
    console.log('\n✅ Disconnected from MongoDB')
  }
  
  process.exit(0)
}

main().catch((err) => {
  console.error('❌ Unexpected error:', err.message)
  console.error(err.stack)
  process.exit(1)
})