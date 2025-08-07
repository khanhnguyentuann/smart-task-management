import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '../.env' });

const prisma = new PrismaClient();

async function main() {
    process.stdout.write('🌱 Starting database seed...\n');
    process.stdout.write(`📍 Database URL: ${process.env.DATABASE_URL?.replace(/:[^:]*@/, ':****@')}\n`);

    // Create a test user
    const testUser = await prisma.user.upsert({
        where: { email: 'test@test.com' },
        update: {},
        create: {
            firstName: 'Test',
            lastName: 'User',
            email: 'test@test.com',
            passwordHash: await argon2.hash('test123'),
        },
    });
    process.stdout.write(`✅ Created/Updated test user: ${testUser.email}\n`);

    process.stdout.write('✅ Database seed completed!\n');
}

main()
    .catch((e) => {
        process.stderr.write(`❌ Error seeding database: ${e}\n`);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });