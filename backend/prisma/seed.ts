import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Skoolar SaaS database seed...');

  // Seed platform admin (MANUFACTURER)
  const adminEmail = 'Nelson29@skoolar.com';
  const adminPassword = 'NELSON2005';
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: passwordHash,
      name: 'Nelson',
      role: UserRole.MANUFACTURER,
    },
    create: {
      email: adminEmail,
      password: passwordHash,
      name: 'Nelson',
      role: UserRole.MANUFACTURER,
      schoolId: null,
    },
  });

  console.log(`✅ Platform admin seeded: ${admin.email} (role: ${admin.role})`);
  console.log('\n🚀 Next Steps:');
  console.log('   1. Start the backend: npm run start:dev');
  console.log('   2. Log in with the seeded admin credentials');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
