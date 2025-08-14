import { PrismaClient, User, MemberRole } from '@prisma/client';

export async function seedProject(prisma: PrismaClient, owner: User, creator: User, member: User, viewer: User) {
    // Find or create project
    let project = await prisma.project.findFirst({
        where: { name: 'Smart Task Management Demo', ownerId: owner.id },
    });

    if (!project) {
        project = await prisma.project.create({
            data: {
                name: 'Smart Task Management Demo',
                description: 'Demo project to test permissions: Owner, Creator, Member roles',
                owner: { connect: { id: owner.id } },
                status: 'ACTIVE',
                priority: 'HIGH',
            },
        });
        process.stdout.write(`✅ Created project: ${project.name}\n`);
    } else {
        process.stdout.write(`ℹ️  Found existing project: ${project.name}\n`);
    }

    // Add creator, member, and viewer as project members (owner is automatically owner)
    const membersToAdd: Array<{ user: User; role: MemberRole }> = [
        { user: creator, role: MemberRole.MEMBER },
        { user: member, role: MemberRole.MEMBER },
        { user: viewer, role: MemberRole.MEMBER },
    ];

    for (const m of membersToAdd) {
        await prisma.projectMember.upsert({
            where: {
                userId_projectId: {
                    userId: m.user.id,
                    projectId: project.id,
                },
            },
            update: { role: m.role },
            create: {
                user: { connect: { id: m.user.id } },
                project: { connect: { id: project.id } },
                role: m.role,
            },
        });
        process.stdout.write(`✅ Added member ${m.user.email} with role ${m.role} in project\n`);
    }

    return project;
}
