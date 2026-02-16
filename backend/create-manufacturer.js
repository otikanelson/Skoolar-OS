const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
require('dotenv').config();

const prisma = new PrismaClient();

async function createManufacturer() {
  try {
    console.log('🏭 Creating Manufacturer User...\n');

    // Get command line arguments
    const args = process.argv.slice(2);
    const name = args[0] || 'Skoolar Manufacturer';
    const email = args[1] || 'manufacturer@skoolar.com';
    const password = args[2] || 'Manufacturer@123';

    // Manufacturer credentials
    const manufacturerData = {
      email: email,
      password: password,
      name: name,
      role: 'MANUFACTURER',
    };

    console.log('📝 Using credentials:');
    console.log('   Name:    ', manufacturerData.name);
    console.log('   Email:   ', manufacturerData.email);
    console.log('   Password:', manufacturerData.password);
    console.log('');

    // Check if manufacturer already exists
    const existingManufacturer = await prisma.user.findUnique({
      where: { email: manufacturerData.email },
    });

    if (existingManufacturer) {
      console.log('⚠️  Manufacturer already exists!');
      console.log('   Deleting old manufacturer...\n');
      
      // Delete old manufacturer
      await prisma.user.delete({
        where: { email: manufacturerData.email },
      });
      
      console.log('✅ Old manufacturer deleted!\n');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(manufacturerData.password, 10);

    // Create manufacturer user
    const manufacturer = await prisma.user.create({
      data: {
        email: manufacturerData.email,
        password: hashedPassword,
        name: manufacturerData.name,
        role: manufacturerData.role,
        requirePasswordChange: false,
      },
    });

    // Store password in history
    await prisma.passwordHistory.create({
      data: {
        userId: manufacturer.id,
        passwordHash: hashedPassword,
      },
    });

    console.log('✅ Manufacturer created successfully!\n');
    console.log('📋 Login Credentials:');
    console.log('   Email:    ', manufacturerData.email);
    console.log('   Password: ', manufacturerData.password);
    console.log('\n🔗 Login URL: http://localhost:5173/manufacturer/login');
    console.log('\n🎉 You can now login as manufacturer!');

  } catch (error) {
    console.error('❌ Error creating manufacturer:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createManufacturer();
