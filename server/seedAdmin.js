const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./models/User');

const seedAdmin = async () => {
  // Read optional arguments from CLI
  const args = process.argv.slice(2);
  const customEmail = args[0];
  const customPassword = args[1];

  const adminEmail = customEmail || 'admin@jobscenterindia.com';
  const adminPassword = customPassword || 'admin123';
  const adminName = 'System Administrator';

  if (!process.env.MONGODB_URI) {
    console.error('Error: MONGODB_URI is not defined in the environment variables.');
    process.exit(1);
  }

  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB successfully.');

    // Check if an admin with the same email already exists
    let existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log(`\n⚠️  An account with email "${adminEmail}" already exists.`);
      console.log(`Checking role... It is currently set to: "${existingAdmin.role}"`);
      
      if (existingAdmin.role !== 'admin') {
        console.log('Promoting existing user to "admin" role...');
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('Successfully promoted user to Administrator!');
      } else {
        console.log('The account is already an Administrator. No changes made.');
      }
    } else {
      console.log(`Creating new Admin account: "${adminName}" <${adminEmail}>`);
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);

      const newAdmin = new User({
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: 'admin'
      });

      await newAdmin.save();
      console.log('\n==================================================');
      console.log('🎉 Admin login seeded successfully!');
      console.log('==================================================');
      console.log(`📧 Email:    ${adminEmail}`);
      console.log(`🔑 Password: ${adminPassword}`);
      console.log('==================================================\n');
    }

    mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('Error seeding admin login:', err);
    mongoose.connection.close();
    process.exit(1);
  }
};

seedAdmin();
