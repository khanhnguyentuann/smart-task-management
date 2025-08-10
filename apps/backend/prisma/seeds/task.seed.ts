import { PrismaClient, Project, User } from '@prisma/client';

export async function seedTasks(prisma: PrismaClient, project: Project, owner: User, member: User) {
  // Task 1 for owner
  const task1 = await prisma.task.create({
    data: {
      project: { connect: { id: project.id } },
      title: 'Owner Task',
      description: 'Task assigned to project owner',
      assignee: { connect: { id: owner.id } },
      createdBy: { connect: { id: owner.id } },
    },
  });

  process.stdout.write(`✅ Created task: ${task1.title}\n`);

  // Task 2 for member
  const task2 = await prisma.task.create({
    data: {
      project: { connect: { id: project.id } },
      title: 'Member Task',
      description: 'Task assigned to project member',
      assignee: { connect: { id: member.id } },
      createdBy: { connect: { id: owner.id } },
    },
  });

  process.stdout.write(`✅ Created task: ${task2.title}\n`);

  return [task1, task2];
}
