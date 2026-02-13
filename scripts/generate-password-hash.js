#!/usr/bin/env node

/**
 * Password Hash Generator for Nexus Dashboard
 * 
 * This script generates a bcrypt hash for your dashboard password.
 * Run: node scripts/generate-password-hash.js
 */

const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('\n🔐 Nexus Dashboard Password Hash Generator\n');
console.log('This will generate a bcrypt hash to store in your .env.local file.\n');

rl.question('Enter your desired password: ', async (password) => {
    if (!password || password.length < 4) {
        console.error('\n❌ Password must be at least 4 characters long.\n');
        rl.close();
        process.exit(1);
    }

    console.log('\n⏳ Generating hash...\n');

    try {
        const hash = await bcrypt.hash(password, 10);

        console.log('✅ Hash generated successfully!\n');
        console.log('Add this to your .env.local file:\n');
        console.log(`NEXUS_PASSWORD_HASH=${hash}\n`);
        console.log('⚠️  Keep this hash secret and never commit it to version control.\n');
    } catch (error) {
        console.error('\n❌ Error generating hash:', error.message, '\n');
    }

    rl.close();
});
