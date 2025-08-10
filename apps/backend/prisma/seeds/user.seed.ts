import { PrismaClient, User } from '@prisma/client';
import * as argon2 from 'argon2';

interface SeedUsersResult {
  owner: User;
  member: User;
}

export async function seedUsers(prisma: PrismaClient): Promise<SeedUsersResult> {
  const passwordPlain = '123aA@';

  const ownerEmail = 'owner@example.com';
  const memberEmail = 'member@example.com';

  const owner = await prisma.user.upsert({
    where: { email: ownerEmail },
    update: {},
    create: {
      email: ownerEmail,
      firstName: 'Owner',
      lastName: 'User',
      passwordHash: await argon2.hash(passwordPlain),
      gender: 'MALE',
      isVerified: true,
    } as any,
  });

  process.stdout.write(`✅ Seeded owner user: ${owner.email}\n`);

  const member = await prisma.user.upsert({
    where: { email: memberEmail },
    update: {},
    create: {
      email: memberEmail,
      firstName: 'Member',
      lastName: 'User',
      passwordHash: await argon2.hash(passwordPlain),
      gender: 'FEMALE',
      isVerified: true,
    } as any,
  });

  process.stdout.write(`✅ Seeded member user: ${member.email}\n`);

  return { owner, member };
}
