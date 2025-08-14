import { PrismaClient, User } from '@prisma/client';
import * as argon2 from 'argon2';

interface SeedUsersResult {
  owner: User;
  creator: User;
  member: User;
  viewer: User;
}

export async function seedUsers(prisma: PrismaClient): Promise<SeedUsersResult> {
  const passwordPlain = '123aA@';

  const ownerEmail = 'owner@example.com';
  const creatorEmail = 'creator@example.com';
  const memberEmail = 'member@example.com';
  const viewerEmail = 'viewer@example.com';

  // 1. Owner - Full permissions
  const owner = await prisma.user.upsert({
    where: { email: ownerEmail },
    update: {},
    create: {
      email: ownerEmail,
      firstName: 'Project',
      lastName: 'Owner',
      passwordHash: await argon2.hash(passwordPlain),
      gender: 'MALE',
      isVerified: true,
    } as any,
  });

  // 2. Creator - Task creator
  const creator = await prisma.user.upsert({
    where: { email: creatorEmail },
    update: {},
    create: {
      email: creatorEmail,
      firstName: 'Task',
      lastName: 'Creator',
      passwordHash: await argon2.hash(passwordPlain),
      gender: 'FEMALE',
      isVerified: true,
    } as any,
  });

  // 3. Member - Regular member
  const member = await prisma.user.upsert({
    where: { email: memberEmail },
    update: {},
    create: {
      email: memberEmail,
      firstName: 'Team',
      lastName: 'Member',
      passwordHash: await argon2.hash(passwordPlain),
      gender: 'OTHER',
      isVerified: true,
    } as any,
  });

  // 4. Viewer - Member without tasks
  const viewer = await prisma.user.upsert({
    where: { email: viewerEmail },
    update: {},
    create: {
      email: viewerEmail,
      firstName: 'Project',
      lastName: 'Viewer',
      passwordHash: await argon2.hash(passwordPlain),
      gender: 'MALE',
      isVerified: true,
    } as any,
  });

  process.stdout.write(`✅ Seeded owner user: ${owner.email}\n`);
  process.stdout.write(`✅ Seeded creator user: ${creator.email}\n`);
  process.stdout.write(`✅ Seeded member user: ${member.email}\n`);
  process.stdout.write(`✅ Seeded viewer user: ${viewer.email}\n`);

  return { owner, creator, member, viewer };
}
