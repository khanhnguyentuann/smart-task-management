import { PrismaClient, UserRole } from '@prisma/client';
import * as argon2 from 'argon2';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '../.env' });

const prisma = new PrismaClient();

async function main() {
    process.stdout.write('🌱 Starting database seed...\n');
    process.stdout.write(`📍 Database URL: ${process.env.DATABASE_URL?.replace(/:[^:]*@/, ':****@')}\n`);

    // Create a test admin user
    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@test.com' },
        update: {},
        create: {
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@test.com',
            passwordHash: await argon2.hash('admin123'),
            role: UserRole.ADMIN,
        },
    });
    process.stdout.write(`✅ Created/Updated admin user: ${adminUser.email}\n`);

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