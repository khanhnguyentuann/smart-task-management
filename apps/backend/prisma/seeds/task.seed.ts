import { PrismaClient, Project, User, TaskStatus, Priority } from '@prisma/client';

export async function seedTasks(prisma: PrismaClient, project: Project, owner: User, creator: User, member: User, viewer: User) {
  // Creator creates 3 tasks and assigns to different people
  
  // Task 1: Assigned to Owner, Created by Creator
  const task1 = await prisma.task.create({
    data: {
      project: { connect: { id: project.id } },
      title: 'Setup Project Architecture',
      description: 'Design and implement the basic project structure and architecture',
      status: TaskStatus.TODO,
      priority: Priority.HIGH,
      assignee: { connect: { id: owner.id } },      // Assigned to owner
      createdBy: { connect: { id: creator.id } },   // Created by creator
      dueDate: new Date('2025-01-15'),
    },
  });

  process.stdout.write(`✅ Created task: ${task1.title} (created by creator, assigned to owner)\n`);

  // Task 2: Assigned to Creator (self), Created by Creator
  const task2 = await prisma.task.create({
    data: {
      project: { connect: { id: project.id } },
      title: 'Implement User Authentication',
      description: 'Create login, register and user management features',
      status: TaskStatus.IN_PROGRESS,
      priority: Priority.MEDIUM,
      assignee: { connect: { id: creator.id } },    // Assigned to creator (self)
      createdBy: { connect: { id: creator.id } },   // Created by creator
      dueDate: new Date('2025-01-20'),
    },
  });

  process.stdout.write(`✅ Created task: ${task2.title} (created by creator, assigned to creator)\n`);

  // Task 3: Assigned to Member, Created by Creator
  const task3 = await prisma.task.create({
    data: {
      project: { connect: { id: project.id } },
      title: 'Design UI/UX Components',
      description: 'Create responsive and modern UI components for the application',
      status: TaskStatus.TODO,
      priority: Priority.MEDIUM,
      assignee: { connect: { id: member.id } },     // Assigned to member
      createdBy: { connect: { id: creator.id } },   // Created by creator
      dueDate: new Date('2025-01-25'),
    },
  });

  process.stdout.write(`✅ Created task: ${task3.title} (created by creator, assigned to member)\n`);

  // Task 4: Owner creates a task and assigns to themselves
  const task4 = await prisma.task.create({
    data: {
      project: { connect: { id: project.id } },
      title: 'Project Planning & Strategy',
      description: 'Define project roadmap, milestones, and overall strategy for the development team',
      status: TaskStatus.IN_PROGRESS,
      priority: Priority.HIGH,
      assignee: { connect: { id: owner.id } },      // Assigned to owner (self)
      createdBy: { connect: { id: owner.id } },     // Created by owner
      dueDate: new Date('2025-01-10'),
    },
  });

  process.stdout.write(`✅ Created task: ${task4.title} (created by owner, assigned to owner)\n`);
  process.stdout.write(`✅ Viewer (${viewer.email}) has no tasks assigned or created\n`);

  return [task1, task2, task3, task4];
}
