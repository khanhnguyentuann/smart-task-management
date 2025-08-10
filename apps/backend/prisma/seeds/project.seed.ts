import { PrismaClient, User, MemberRole } from '@prisma/client';

export async function seedProject(prisma: PrismaClient, owner: User, member: User) {
    // Find or create project
    let project = await prisma.project.findFirst({
        where: { name: 'Base Project', ownerId: owner.id },
    });

    if (!project) {
        project = await prisma.project.create({
            data: {
                name: 'Base Project',
                description: 'Initial project created by demo user',
                owner: { connect: { id: owner.id } },
            },
        });
        process.stdout.write(`✅ Created project: ${project.name}\n`);
    } else {
        process.stdout.write(`ℹ️  Found existing project: ${project.name}\n`);
    }

    // Ensure owner and member are both in project_members
    const membersToAdd: Array<{ user: User; role: MemberRole }> = [
        { user: owner, role: MemberRole.OWNER },
        { user: member, role: MemberRole.MEMBER },
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
        process.stdout.write(`✅ Ensured member ${m.user.email} with role ${m.role} in project\n`);
    }

    return project;
}
