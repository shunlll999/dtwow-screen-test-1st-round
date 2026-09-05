import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminPasswordHash = await bcrypt.hash('Admin@123', 10);
  const userPasswordHash = await bcrypt.hash('User@123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@datawow.com' },
    update: { name: 'Admin' },
    create: {
      email: 'admin@datawow.com',
      name: 'Admin',
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
    },
  });

  await prisma.user.upsert({
    where: { email: 'user@datawow.com' },
    update: { name: 'Test User' },
    create: {
      email: 'user@datawow.com',
      name: 'Test User',
      passwordHash: userPasswordHash,
      role: Role.USER,
    },
  });

  const concerts = [
    {
      name: 'Bodyslam Live in Bangkok',
      description: 'Free outdoor rock night at Lumpini Park. Doors open 18:00.',
      totalSeats: 500,
    },
    {
      name: 'Jazz Under the Stars',
      description: 'An intimate acoustic jazz evening on the riverside stage.',
      totalSeats: 120,
    },
    {
      name: 'Indie Pop Showcase',
      description:
        'Ten rising indie acts, one stage, zero cost. First come, first served.',
      totalSeats: 3,
    },
  ];

  for (const concert of concerts) {
    const existing = await prisma.concert.findFirst({
      where: {
        name: concert.name,
      },
    });
    if (!existing) {
      await prisma.concert.create({ data: concert });
    }
  }

  console.log('Seeding completed.');
}

main()
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
