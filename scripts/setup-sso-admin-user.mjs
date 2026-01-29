#!/usr/bin/env node
/**
 * scripts/setup-sso-admin-user.mjs
 * WHAT: Creates or updates the SSO admin user in Amanoba's database
 * WHY: Ensure the quiz automation user has admin role in Amanoba
 */
import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config({ path: '.env.local' })

// SSO user details (must match the SSO system)
const SSO_USER = {
  ssoSub: '7700c769-493b-4778-b21e-137bbbe7c21f',
  email: 'quiz-automation@amanoba.com',
  displayName: 'Quiz Item QA Automation',
  role: 'admin'
}

async function main() {
  console.log('🔧 Setting up SSO admin user in Amanoba database...\n')
  
  // Connect to MongoDB using the same configuration as the main app
  const mongoUri = process.env.MONGODB_URI
  const dbName = process.env.DB_NAME || 'amanoba'
  
  if (!mongoUri) {
    console.error('❌ MONGODB_URI environment variable not set')
    process.exit(1)
  }
  
  try {
    await mongoose.connect(mongoUri, {
      dbName: dbName,
      bufferCommands: false,
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    })
    console.log('✅ Connected to MongoDB')
    console.log(`Database: ${mongoose.connection.name}`)
    console.log(`Host: ${mongoose.connection.host}`)
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message)
    process.exit(1)
  }
  
  // Define Player schema (simplified)
  const playerSchema = new mongoose.Schema({
    ssoSub: String,
    displayName: String,
    email: String,
    brandId: mongoose.Schema.Types.ObjectId,
    locale: String,
    isPremium: Boolean,
    isActive: Boolean,
    isBanned: Boolean,
    authProvider: String,
    role: String,
    lastLoginAt: Date,
    lastSeenAt: Date,
  }, { collection: 'players' })
  
  const Player = mongoose.model('Player', playerSchema)
  
  // Define Brand schema (simplified)
  const brandSchema = new mongoose.Schema({
    slug: String,
    name: String,
  }, { collection: 'brands' })
  
  const Brand = mongoose.model('Brand', brandSchema)
  
  try {
    // Get default brand
    console.log('1. Finding default brand...')
    const defaultBrand = await Brand.findOne({ slug: 'amanoba' })
    if (!defaultBrand) {
      console.error('❌ Default brand "amanoba" not found')
      process.exit(1)
    }
    console.log(`   ✅ Found brand: ${defaultBrand.name} (${defaultBrand._id})`)
    
    // Check if user already exists
    console.log('\n2. Checking for existing user...')
    let player = await Player.findOne({ ssoSub: SSO_USER.ssoSub })
    
    if (player) {
      console.log(`   ✅ Found existing player: ${player.displayName} (${player._id})`)
      console.log(`   Current role: ${player.role}`)
      
      // Update role to admin if not already
      if (player.role !== 'admin') {
        console.log('   🔄 Updating role to admin...')
        player.role = 'admin'
        player.lastSeenAt = new Date()
        await player.save()
        console.log('   ✅ Role updated to admin')
      } else {
        console.log('   ✅ User already has admin role')
      }
    } else {
      console.log('   ℹ️  User not found, creating new player...')
      
      player = new Player({
        ssoSub: SSO_USER.ssoSub,
        displayName: SSO_USER.displayName,
        email: SSO_USER.email,
        brandId: defaultBrand._id,
        locale: 'en',
        isPremium: false,
        isActive: true,
        isBanned: false,
        authProvider: 'sso',
        role: 'admin',
        lastLoginAt: new Date(),
        lastSeenAt: new Date(),
      })
      
      await player.save()
      console.log(`   ✅ Created new admin player: ${player.displayName} (${player._id})`)
    }
    
    console.log('\n' + '='.repeat(60))
    console.log('🎉 SSO ADMIN USER SETUP COMPLETE')
    console.log('='.repeat(60))
    console.log()
    console.log('Player Details:')
    console.log(`  ID: ${player._id}`)
    console.log(`  SSO Sub: ${player.ssoSub}`)
    console.log(`  Email: ${player.email}`)
    console.log(`  Display Name: ${player.displayName}`)
    console.log(`  Role: ${player.role}`)
    console.log(`  Auth Provider: ${player.authProvider}`)
    console.log(`  Brand: ${defaultBrand.name}`)
    console.log()
    console.log('Next Steps:')
    console.log('1. Test the SSO token against Amanoba admin API')
    console.log('2. Run: node ../sso/scripts/test-amanoba-sso-integration.mjs')
    console.log('3. If successful, run your quiz automation')
    console.log()
    
  } catch (error) {
    console.error('❌ Error setting up user:', error.message)
    console.error(error.stack)
    process.exit(1)
  } finally {
    await mongoose.disconnect()
    console.log('✅ Disconnected from MongoDB')
  }
  
  process.exit(0)
}

main().catch((err) => {
  console.error('❌ Unexpected error:', err.message)
  console.error(err.stack)
  process.exit(1)
})