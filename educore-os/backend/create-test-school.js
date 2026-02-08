require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createTestSchool() {
  try {
    console.log('🏫 Creating test school and admin...');

    const schoolPassword = await bcrypt.hash('school2024', 10);

    // Create Test School
    const testSchool = await prisma.school.upsert({
      where: { email: 'admin@testschool.edu.ng' },
      update: {},
      create: {
        name: 'Test Secondary School',
        type: 'SECONDARY',
        email: 'admin@testschool.edu.ng',
        phone: '+234-800-000-0000',
        address: '123 Education Street',
        state: 'Lagos',
        lga: 'Ikeja',
        contactPersonName: 'John Doe',
        contactPersonRole: 'Principal',
        contactPersonPhone: '+234-800-000-0001',
        estimatedStudentCount: 500,
        subdomain: 'testschool',
        status: 'ACTIVE',
        subscriptionPlan: 'PROFESSIONAL',
        subscriptionStatus: 'TRIAL',
      },
    });

    console.log('✓ School created:', testSchool.name);

    // Create School Admin User
    const schoolAdmin = await prisma.user.upsert({
      where: { email: 'admin@testschool.edu.ng' },
      update: {},
      create: {
        email: 'admin@testschool.edu.ng',
        password: schoolPassword,
        name: 'School Administrator',
        role: 'SCHOOL_ADMIN',
        schoolId: testSchool.id,
      },
    });

    console.log('✓ School admin created:', schoolAdmin.name);
    console.log('\n✅ Test school setup complete!');
    console.log('\n🔐 School Admin Login:');
    console.log('   Email: admin@testschool.edu.ng');
    console.log('   Password: school2024');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestSchool();
