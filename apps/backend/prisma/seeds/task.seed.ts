import { PrismaClient, Project, User, TaskStatus, Priority } from '@prisma/client';

export async function seedTasks(prisma: PrismaClient, project: Project, owner: User, member: User) {
  // Task 1 for owner - IN_PROGRESS
  const task1 = await prisma.task.create({
    data: {
      project: { connect: { id: project.id } },
      title: 'Design Homepage Layout',
      description: 'Create responsive homepage design with modern UI components',
      status: TaskStatus.IN_PROGRESS,
      priority: Priority.HIGH,
      assignee: { connect: { id: owner.id } },
      createdBy: { connect: { id: owner.id } },
      dueDate: new Date('2024-12-25'),
    },
  });

  process.stdout.write(`✅ Created task: ${task1.title}\n`);

  // Task 2 for member - DONE
  const task2 = await prisma.task.create({
    data: {
      project: { connect: { id: project.id } },
      title: 'Setup Database Schema',
      description: 'Initialize database tables and relationships',
      status: TaskStatus.DONE,
      priority: Priority.MEDIUM,
      assignee: { connect: { id: member.id } },
      createdBy: { connect: { id: owner.id } },
      dueDate: new Date('2024-12-20'),
      completedAt: new Date('2024-12-19'),
    },
  });

  process.stdout.write(`✅ Created task: ${task2.title}\n`);

  // Task 3 for owner - TODO
  const task3 = await prisma.task.create({
    data: {
      project: { connect: { id: project.id } },
      title: 'Implement User Authentication',
      description: 'Add JWT-based authentication system',
      status: TaskStatus.TODO,
      priority: Priority.HIGH,
      assignee: { connect: { id: owner.id } },
      createdBy: { connect: { id: owner.id } },
      dueDate: new Date('2024-12-30'),
    },
  });

  process.stdout.write(`✅ Created task: ${task3.title}\n`);

  // Task 4 for member - DONE
  const task4 = await prisma.task.create({
    data: {
      project: { connect: { id: project.id } },
      title: 'Write API Documentation',
      description: 'Create comprehensive API documentation',
      status: TaskStatus.DONE,
      priority: Priority.LOW,
      assignee: { connect: { id: member.id } },
      createdBy: { connect: { id: owner.id } },
      dueDate: new Date('2024-12-18'),
      completedAt: new Date('2024-12-17'),
    },
  });

  process.stdout.write(`✅ Created task: ${task4.title}\n`);

  // Task 5 for owner - IN_PROGRESS (overdue)
  const task5 = await prisma.task.create({
    data: {
      project: { connect: { id: project.id } },
      title: 'Fix Bug in Login System',
      description: 'Resolve authentication bug in production',
      status: TaskStatus.IN_PROGRESS,
      priority: Priority.HIGH,
      assignee: { connect: { id: owner.id } },
      createdBy: { connect: { id: owner.id } },
      dueDate: new Date('2024-12-15'), // Overdue
    },
  });

  process.stdout.write(`✅ Created task: ${task5.title}\n`);

  return [task1, task2, task3, task4, task5];
}
