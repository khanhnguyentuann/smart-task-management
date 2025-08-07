import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '../.env' });

const prisma = new PrismaClient();

async function main() {
    process.stdout.write('🌱 Starting database seed...\n');
    process.stdout.write(`📍 Database URL: ${process.env.DATABASE_URL?.replace(/:[^:]*@/, ':****@')}\n`);

    // Create test users
    const users = [
        {
            email: 'test@test.com',
            firstName: 'Test',
            lastName: 'User',
            password: 'test123'
        },
        {
            email: 'john@example.com',
            firstName: 'John',
            lastName: 'Doe',
            password: 'password123'
        },
        {
            email: 'jane@example.com',
            firstName: 'Jane',
            lastName: 'Smith',
            password: 'password123'
        },
        {
            email: 'mike@example.com',
            firstName: 'Mike',
            lastName: 'Johnson',
            password: 'password123'
        },
        {
            email: 'sarah@example.com',
            firstName: 'Sarah',
            lastName: 'Wilson',
            password: 'password123'
        }
    ];

    for (const userData of users) {
        const user = await prisma.user.upsert({
            where: { email: userData.email },
            update: {},
            create: {
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                passwordHash: await argon2.hash(userData.password),
            },
        });
        process.stdout.write(`✅ Created/Updated user: ${user.email}\n`);
    }

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