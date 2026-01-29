#!/usr/bin/env node
/**
 * scripts/test-sso-rbac.mjs
 * WHAT: Tests the SSO RBAC integration directly
 * WHY: Debug the SSO token validation in Amanoba
 */
import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config({ path: '.env.local' })

const SSO_TOKEN = process.env.QUIZ_ITEM_ADMIN_TOKEN || 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InNzby0yMDI1In0.eyJpc3MiOiJodHRwczovL3Nzby5kb25laXNiZXR0ZXIuY29tIiwic3ViIjoiNzcwMGM3NjktNDkzYi00Nzc4LWIyMWUtMTM3YmJiZTdjMjFmIiwiYXVkIjoiMDNlMjYyNmQtNzYzOS00NWQ3LTg4YTYtZWJmNTY5N2M1OGY3IiwiZXhwIjoxODAxMjQ4MzQ2LCJpYXQiOjE3Njk3MTIzNDYsImp0aSI6IjgyYWI5ZTQwODZhMTQ3MjA0ZDJkM2I5YmRmZjE5NjAxIiwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCBhZG1pbiBtYW5hZ2VfcGVybWlzc2lvbnMiLCJjbGllbnRfaWQiOiIwM2UyNjI2ZC03NjM5LTQ1ZDctODhhNi1lYmY1Njk3YzU4ZjciLCJ0b2tlbl90eXBlIjoiYWNjZXNzX3Rva2VuIn0.gVUO1FKnP2ANuHFNRQ1C-m6-DWkdkP0wMY2GyriXGTUWhMt64k-aevghl4qzTKD6AzkaBIUD8AoPlZz4AVLDDweyiigl-vboQTHRt_n02RxPtn4XutDqbWiXG5CAd9dp5KQQNLyQZVi3-nKM01414I1apWnJlPhVJakE6iT5RsRmLpeOMFSy_oxRuMVjhepKbEZLUOkt6klcsYT2XygxlmPDSRKxiEQKPZOAbU8ttkuKYYah6MveQT-Fyxq3RY_t01Zma3ens0C0JZND6znZOtmJIdiHs_t-tXDMcXZDq99Hlg29sTViZszAR9s3IOQhCAMgJ5JSziub8n4JGFmYpQ'

async function main() {
  console.log('🧪 Testing SSO RBAC integration directly...\n')
  
  // Connect to MongoDB
  const mongoUri = process.env.MONGODB_URI
  if (!mongoUri) {
    console.error('❌ MONGODB_URI environment variable not set')
    process.exit(1)
  }
  
  try {
    await mongoose.connect(mongoUri)
    console.log('✅ Connected to MongoDB')
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message)
    process.exit(1)
  }
  
  // Define Player schema (simplified)
  const playerSchema = new mongoose.Schema({
    ssoSub: String,
    displayName: String,
    email: String,
    role: String,
  }, { collection: 'players' })
  
  const Player = mongoose.model('Player', playerSchema)
  
  try {
    console.log('1. Testing SSO userinfo endpoint...')
    const ssoUserinfoUrl = process.env.SSO_USERINFO_URL || 'https://sso.doneisbetter.com/api/oauth/userinfo'
    
    const response = await fetch(ssoUserinfoUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SSO_TOKEN}`,
        'Content-Type': 'application/json',
      },
    })
    
    console.log(`   Status: ${response.status} ${response.statusText}`)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.log(`   ❌ SSO userinfo failed: ${errorText}`)
      
      // Let's try to decode the JWT token to get the sub directly
      console.log('\n2. Extracting user info from JWT token directly...')
      const tokenParts = SSO_TOKEN.split('.')
      if (tokenParts.length !== 3) {
        console.log('   ❌ Invalid JWT token format')
        return
      }
      
      const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString())
      console.log(`   ✅ Extracted from JWT:`)
      console.log(`   Sub: ${payload.sub}`)
      console.log(`   Client ID: ${payload.client_id}`)
      console.log(`   Scope: ${payload.scope}`)
      
      // Use the extracted sub to check the user in Amanoba
      const sub = payload.sub
      
      console.log('\n3. Checking user in Amanoba database...')
      const player = await Player.findOne({ ssoSub: sub }).lean()
      
      if (!player) {
        console.log(`   ❌ User with ssoSub ${sub} not found in Amanoba database`)
        return
      }
      
      console.log(`   ✅ Found player:`)
      console.log(`   ID: ${player._id}`)
      console.log(`   Display Name: ${player.displayName}`)
      console.log(`   Email: ${player.email}`)
      console.log(`   Role: ${player.role}`)
      
      if (player.role === 'admin') {
        console.log('\n✅ SUCCESS: User has admin role in Amanoba!')
        console.log('The SSO token validation should work once the SSO server issue is resolved.')
      } else {
        console.log(`\n❌ ISSUE: User role is '${player.role}', not 'admin'`)
        console.log('Need to update user role to admin in Amanoba database.')
      }
      
    } else {
      const ssoUserInfo = await response.json()
      console.log(`   ✅ SSO userinfo successful:`)
      console.log(`   Sub: ${ssoUserInfo.sub}`)
      console.log(`   Email: ${ssoUserInfo.email}`)
      console.log(`   Name: ${ssoUserInfo.name}`)
      
      console.log('\n2. Checking user in Amanoba database...')
      const player = await Player.findOne({ ssoSub: ssoUserInfo.sub }).lean()
      
      if (!player) {
        console.log(`   ❌ User with ssoSub ${ssoUserInfo.sub} not found in Amanoba database`)
        return
      }
      
      console.log(`   ✅ Found player:`)
      console.log(`   ID: ${player._id}`)
      console.log(`   Display Name: ${player.displayName}`)
      console.log(`   Email: ${player.email}`)
      console.log(`   Role: ${player.role}`)
      
      if (player.role === 'admin') {
        console.log('\n✅ SUCCESS: Complete SSO integration working!')
        console.log('The user has admin role and SSO token validation is working.')
      } else {
        console.log(`\n❌ ISSUE: User role is '${player.role}', not 'admin'`)
        console.log('Need to update user role to admin in Amanoba database.')
      }
    }
    
  } catch (error) {
    console.error('❌ Error during testing:', error.message)
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