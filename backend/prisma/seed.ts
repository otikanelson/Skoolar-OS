import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Skoolar SaaS database seed...');

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.user.deleteMany({});
  await prisma.school.deleteMany({});
  
  console.log('✅ Database cleared!');
  console.log('\n📝 No seed data created.');
  console.log('   Schools can now register through the registration flow.');
  console.log('\n🚀 Next Steps:');
  console.log('   1. Start the backend: npm run start:dev');
  console.log('   2. Go to the registration page');
  console.log('   3. Register your school!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
