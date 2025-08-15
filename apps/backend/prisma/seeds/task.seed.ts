import { PrismaClient, Project, User, TaskStatus, Priority } from '@prisma/client';

export async function seedTasks(prisma: PrismaClient, project: Project, owner: User, creator: User, member: User, viewer: User) {
  // Creator creates 3 tasks and assigns to different people (Multi-Assignee only)
  
  // Task 1: Assigned to Owner, Created by Creator
  const task1 = await prisma.task.create({
    data: {
      project: { connect: { id: project.id } },
      title: 'Setup Project Architecture',
      description: 'Design and implement the basic project structure and architecture',
      status: TaskStatus.TODO,
      priority: Priority.HIGH,
      createdBy: { connect: { id: creator.id } },   // Created by creator
      dueDate: new Date('2025-01-15'),
      // Multi-assignee: Assign to owner
      assignees: {
        create: {
          userId: owner.id,
          assignedBy: creator.id,
        }
      }
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
      createdBy: { connect: { id: creator.id } },   // Created by creator
      dueDate: new Date('2025-01-20'),
      // Multi-assignee: Assign to creator (self)
      assignees: {
        create: {
          userId: creator.id,
          assignedBy: creator.id,
        }
      }
    },
  });

  process.stdout.write(`✅ Created task: ${task2.title} (created by creator, assigned to creator)\n`);

  // Task 3: Multi-assignee task - Assigned to both Member and Creator
  const task3 = await prisma.task.create({
    data: {
      project: { connect: { id: project.id } },
      title: 'Design UI/UX Components',
      description: 'Create responsive and modern UI components for the application',
      status: TaskStatus.TODO,
      priority: Priority.MEDIUM,
      createdBy: { connect: { id: creator.id } },   // Created by creator
      dueDate: new Date('2025-01-25'),
      // Multi-assignee: Assign to both member and creator
      assignees: {
        createMany: {
          data: [
            {
              userId: member.id,
              assignedBy: creator.id,
            },
            {
              userId: creator.id,
              assignedBy: creator.id,
            }
          ]
        }
      }
    },
  });

  process.stdout.write(`✅ Created task: ${task3.title} (created by creator, assigned to member and creator)\n`);

  // Task 4: Owner creates a task and assigns to multiple people
  const task4 = await prisma.task.create({
    data: {
      project: { connect: { id: project.id } },
      title: 'Project Planning & Strategy',
      description: 'Define project roadmap, milestones, and overall strategy for the development team',
      status: TaskStatus.IN_PROGRESS,
      priority: Priority.HIGH,
      createdBy: { connect: { id: owner.id } },     // Created by owner
      dueDate: new Date('2025-01-10'),
      // Multi-assignee: Assign to owner, creator, and member
      assignees: {
        createMany: {
          data: [
            {
              userId: owner.id,
              assignedBy: owner.id,
            },
            {
              userId: creator.id,
              assignedBy: owner.id,
            },
            {
              userId: member.id,
              assignedBy: owner.id,
            }
          ]
        }
      }
    },
  });

  process.stdout.write(`✅ Created task: ${task4.title} (created by owner, assigned to owner, creator, and member)\n`);

  // Task 5: Unassigned task (no assignees)
  const task5 = await prisma.task.create({
    data: {
      project: { connect: { id: project.id } },
      title: 'Code Review Guidelines',
      description: 'Establish code review process and guidelines for the team',
      status: TaskStatus.TODO,
      priority: Priority.LOW,
      createdBy: { connect: { id: owner.id } },     // Created by owner
      dueDate: new Date('2025-02-01'),
      // No assignees - unassigned task
    },
  });

  process.stdout.write(`✅ Created task: ${task5.title} (created by owner, unassigned)\n`);
  process.stdout.write(`✅ Viewer (${viewer.email}) has no tasks assigned or created\n`);

  return [task1, task2, task3, task4, task5];
}
