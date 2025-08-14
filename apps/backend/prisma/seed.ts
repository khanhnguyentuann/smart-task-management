import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

import { seedUsers } from './seeds/user.seed';
import { seedProject } from './seeds/project.seed';
import { seedTasks } from './seeds/task.seed';

// Load environment variables
dotenv.config({ path: '../.env' });

const prisma = new PrismaClient();

async function main() {
    process.stdout.write('🌱 Starting database seed...\n');
    process.stdout.write(`📍 Database URL: ${process.env.DATABASE_URL?.replace(/:[^:]*@/, ':****@')}\n`);

    // Seed entities
    const { owner, creator, member, viewer } = await seedUsers(prisma);
    const project = await seedProject(prisma, owner, creator, member, viewer);
    await seedTasks(prisma, project, owner, creator, member, viewer);

    process.stdout.write('🌱 Database seed completed!\n');
}

main()
    .catch((e) => {
        process.stderr.write(`❌ Error seeding database: ${e}\n`);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });