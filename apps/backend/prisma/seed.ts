import { PrismaClient, UserRole } from '@prisma/client';
import * as argon2 from 'argon2';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');
    console.log('📍 Database URL:', process.env.DATABASE_URL?.replace(/:[^:]*@/, ':****@')); // Log URL với password ẩn

    // Password mặc định cho mock users
    const defaultPassword = await argon2.hash('password123');

    // Mock users data
    const mockUsers = [
        {
            firstName: 'Sarah',
            lastName: 'Chen',
            email: 'sarah@company.com',
            passwordHash: defaultPassword,
            role: UserRole.ADMIN,
        },
        {
            firstName: 'Alex',
            lastName: 'Rodriguez',
            email: 'alex@company.com',
            passwordHash: defaultPassword,
            role: UserRole.MEMBER,
        },
        {
            firstName: 'Emily',
            lastName: 'Johnson',
            email: 'emily@company.com',
            passwordHash: defaultPassword,
            role: UserRole.ADMIN,
        },
        {
            firstName: 'Michael',
            lastName: 'Kim',
            email: 'michael@company.com',
            passwordHash: defaultPassword,
            role: UserRole.MEMBER,
        },
    ];

    // Create users
    for (const userData of mockUsers) {
        const user = await prisma.user.upsert({
            where: { email: userData.email },
            update: {},
            create: userData,
        });
        console.log(`✅ Created/Updated user: ${user.email}`);
    }

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
    console.log(`✅ Created/Updated admin user: ${adminUser.email}`);

    console.log('✅ Database seed completed!');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });